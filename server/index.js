import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { randomUUID } from 'crypto';
import bcrypt from 'bcryptjs';
import { OAuth2Client } from 'google-auth-library';
import appleSignin from 'apple-signin-auth';
import {
  findUserById,
  findUserByEmail,
  upsertUser,
  listUsers,
  createEmailUser,
  touchUserLogin,
  startPhoneVerification,
  completePhoneVerification,
  updateUserByAdmin,
  deleteUser,
} from './db.js';
import { sendVerificationSms } from './sms.js';
import {
  signToken,
  authMiddleware,
  adminMiddleware,
  sanitizeUser,
  isAdminEmail,
} from './auth.js';
import {
  createOrder,
  listOrdersByUser,
  listAllOrders,
  deleteOrder,
  deleteOrdersByUserId,
  sanitizeOrder,
} from './orders.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.join(__dirname, '..', 'dist');
const isProduction = process.env.NODE_ENV === 'production';

const app = express();
const PORT = process.env.PORT || 3001;
const googleClient = process.env.GOOGLE_CLIENT_ID
  ? new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
  : null;

if (!isProduction) {
  app.use(cors());
}
app.use(express.json());
function normalizePhone(phone) {
  return phone?.replace(/\D/g, '') || null;
}

function resolveRole(email) {
  return isAdminEmail(email) ? 'admin' : 'user';
}

function loginResponse(user) {
  return {
    token: signToken(user),
    user: sanitizeUser(user),
  };
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.get('/api/config/public', (_req, res) => {
  res.json({
    googleClientId: process.env.GOOGLE_CLIENT_ID || '',
    appleClientId: process.env.APPLE_CLIENT_ID || '',
  });
});

app.get('/api/auth/me', authMiddleware, (req, res) => {
  const user = findUserById(req.auth.sub);
  if (!user) {
    return res.status(404).json({ error: 'User not found.' });
  }
  res.json({ user: sanitizeUser(user) });
});

function generateVerificationCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

app.post('/api/auth/phone/send-code', authMiddleware, async (req, res) => {
  const normalizedPhone = normalizePhone(req.body.phone);

  if (!normalizedPhone || normalizedPhone.length < 10) {
    return res.status(400).json({ error: 'A valid phone number is required.' });
  }

  const user = findUserById(req.auth.sub);
  if (!user) {
    return res.status(404).json({ error: 'User not found.' });
  }

  if (user.phone_verified && user.phone === normalizedPhone) {
    return res.status(400).json({ error: 'This phone number is already verified on your account.' });
  }

  const code = generateVerificationCode();
  const codeHash = await bcrypt.hash(code, 10);
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

  const result = startPhoneVerification(req.auth.sub, normalizedPhone, codeHash, expiresAt);
  if (result.error) {
    return res.status(409).json({ error: result.error });
  }

  try {
    const sms = await sendVerificationSms(normalizedPhone, code);
    res.json({
      ok: true,
      message: 'Verification code sent.',
      expiresInMinutes: 10,
      ...(sms.devMode && sms.devCode ? { devCode: sms.devCode } : {}),
    });
  } catch (err) {
    res.status(503).json({ error: err.message });
  }
});

app.post('/api/auth/phone/verify', authMiddleware, async (req, res) => {
  const normalizedPhone = normalizePhone(req.body.phone);
  const { code } = req.body;

  if (!normalizedPhone || !code) {
    return res.status(400).json({ error: 'Phone number and verification code are required.' });
  }

  const user = findUserById(req.auth.sub);
  if (!user) {
    return res.status(404).json({ error: 'User not found.' });
  }

  if (user.phone_pending !== normalizedPhone) {
    return res.status(400).json({ error: 'Request a new verification code for this phone number.' });
  }

  if (!user.phone_verify_code_hash || !user.phone_verify_expires) {
    return res.status(400).json({ error: 'No active verification code. Please request a new one.' });
  }

  if (new Date(user.phone_verify_expires).getTime() < Date.now()) {
    return res.status(400).json({ error: 'Verification code expired. Please request a new one.' });
  }

  const valid = await bcrypt.compare(String(code).trim(), user.phone_verify_code_hash);
  if (!valid) {
    return res.status(401).json({ error: 'Invalid verification code.' });
  }

  const result = completePhoneVerification(req.auth.sub, normalizedPhone);
  if (result.error) {
    return res.status(400).json({ error: result.error });
  }

  res.json({ user: sanitizeUser(result.user) });
});

app.post('/api/auth/register', async (req, res) => {
  const { name, email, phone, password } = req.body;

  if (!name?.trim()) {
    return res.status(400).json({ error: 'Full name is required.' });
  }

  const normalizedEmail = email?.trim().toLowerCase();
  const normalizedPhone = normalizePhone(phone);

  if (!normalizedEmail) {
    return res.status(400).json({ error: 'Email is required.' });
  }

  if (!normalizedPhone) {
    return res.status(400).json({ error: 'Phone number is required.' });
  }

  if (!password || password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters.' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const result = createEmailUser({
    id: randomUUID(),
    name: name.trim(),
    email: normalizedEmail,
    phone: normalizedPhone,
    passwordHash,
    role: resolveRole(normalizedEmail),
  });

  if (result.error) {
    return res.status(409).json({ error: result.error });
  }

  res.status(201).json(loginResponse(result.user));
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  const normalizedEmail = email?.trim().toLowerCase();
  if (!normalizedEmail || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const user = findUserByEmail(normalizedEmail);
  if (!user?.password_hash) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  const loggedIn = touchUserLogin(user.id);
  res.json(loginResponse(loggedIn));
});

app.post('/api/auth/email-phone', (_req, res) => {
  res.status(410).json({
    error:
      'Sign-in has been updated. Use Create Account with Email to register, or Log In with Email and your password.',
  });
});

app.post('/api/auth/social', (req, res) => {
  const { provider, name, email, phone, providerId } = req.body;
  const allowed = ['google', 'apple', 'yahoo'];

  if (!allowed.includes(provider)) {
    return res.status(400).json({ error: 'Unsupported provider.' });
  }

  if (!name?.trim()) {
    return res.status(400).json({ error: 'Name is required.' });
  }

  const normalizedEmail = email?.trim().toLowerCase() || null;
  const normalizedPhone = normalizePhone(phone);

  if (!normalizedEmail && !normalizedPhone && !providerId) {
    return res.status(400).json({ error: 'Email, phone, or provider ID is required.' });
  }

  const user = upsertUser({
    id: randomUUID(),
    name: name.trim(),
    email: normalizedEmail,
    phone: normalizedPhone,
    provider,
    provider_id: providerId || normalizedEmail || normalizedPhone,
    role: resolveRole(normalizedEmail),
  });

  res.json(loginResponse(user));
});

app.post('/api/auth/google', async (req, res) => {
  const { credential } = req.body;

  if (!credential) {
    return res.status(400).json({ error: 'Google credential is required.' });
  }

  if (!googleClient) {
    return res.status(503).json({
      error: 'Google sign-in is not configured. Set GOOGLE_CLIENT_ID on the server.',
    });
  }

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    if (!payload?.email || !payload.name) {
      return res.status(400).json({ error: 'Google account is missing required profile info.' });
    }

    const user = upsertUser({
      id: randomUUID(),
      name: payload.name,
      email: payload.email.toLowerCase(),
      phone: null,
      provider: 'google',
      provider_id: payload.sub,
      role: resolveRole(payload.email),
    });

    res.json(loginResponse(user));
  } catch {
    res.status(401).json({ error: 'Google sign-in failed.' });
  }
});

app.post('/api/auth/apple', async (req, res) => {
  const { identityToken, user: appleUser } = req.body;
  const appleClientId = process.env.APPLE_CLIENT_ID;

  if (!identityToken) {
    return res.status(400).json({ error: 'Apple identity token is required.' });
  }

  if (!appleClientId) {
    return res.status(503).json({
      error: 'Apple sign-in is not configured. Set APPLE_CLIENT_ID on the server.',
    });
  }

  try {
    const claims = await appleSignin.verifyIdToken(identityToken, {
      audience: appleClientId,
    });

    const providerId = claims.sub;
    const email = claims.email?.toLowerCase() || null;
    const firstName = appleUser?.name?.firstName?.trim();
    const lastName = appleUser?.name?.lastName?.trim();
    const fullName = [firstName, lastName].filter(Boolean).join(' ') || null;

    const user = upsertUser({
      id: randomUUID(),
      name: fullName || email?.split('@')[0] || 'Apple User',
      email,
      phone: null,
      provider: 'apple',
      provider_id: providerId,
      role: resolveRole(email),
    });

    res.json(loginResponse(user));
  } catch {
    res.status(401).json({ error: 'Apple sign-in failed.' });
  }
});

app.get('/api/admin/users', authMiddleware, adminMiddleware, (_req, res) => {
  const users = listUsers().map(sanitizeUser);
  res.json({ users, total: users.length });
});

app.patch('/api/admin/users/:userId', authMiddleware, adminMiddleware, (req, res) => {
  const { name, email, phone, role, phoneVerified } = req.body;
  const result = updateUserByAdmin(req.params.userId, {
    name,
    email,
    phone,
    role,
    phoneVerified,
  });

  if (result.error) {
    const status = result.error === 'User not found.' ? 404 : 409;
    return res.status(status).json({ error: result.error });
  }

  res.json({ user: sanitizeUser(result.user) });
});

app.delete('/api/admin/users/:userId', authMiddleware, adminMiddleware, (req, res) => {
  if (req.params.userId === req.auth.sub) {
    return res.status(400).json({ error: 'You cannot delete your own account.' });
  }

  const result = deleteUser(req.params.userId);
  if (result.error) {
    return res.status(404).json({ error: result.error });
  }

  const ordersRemoved = deleteOrdersByUserId(req.params.userId);
  res.json({ ok: true, ordersRemoved });
});

app.get('/api/orders', authMiddleware, (req, res) => {
  const orders = listOrdersByUser(req.auth.sub).map(sanitizeOrder);
  res.json({ orders, total: orders.length });
});

app.post('/api/orders', authMiddleware, (req, res) => {
  const user = findUserById(req.auth.sub);
  if (!user) {
    return res.status(404).json({ error: 'User not found.' });
  }

  if (!user.phone || !user.phone_verified) {
    return res.status(400).json({
      error: 'A verified phone number is required on your account before placing orders.',
    });
  }

  const { items, subtotal, tax, total } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Order must include at least one item.' });
  }

  const order = createOrder({
    userId: user.id,
    userName: user.name,
    userEmail: user.email,
    items,
    subtotal: Number(subtotal),
    tax: Number(tax),
    total: Number(total),
  });

  res.status(201).json({ order: sanitizeOrder(order) });
});

app.get('/api/admin/orders', authMiddleware, adminMiddleware, (_req, res) => {
  const orders = listAllOrders().map(sanitizeOrder);
  res.json({ orders, total: orders.length });
});

app.delete('/api/admin/orders/:orderId', authMiddleware, adminMiddleware, (req, res) => {
  const deleted = deleteOrder(req.params.orderId);
  if (!deleted) {
    return res.status(404).json({ error: 'Order not found.' });
  }
  res.json({ ok: true, order: sanitizeOrder(deleted) });
});

if (isProduction) {
  app.use(express.static(distPath));

  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}${isProduction ? ' (production)' : ''}`);
});