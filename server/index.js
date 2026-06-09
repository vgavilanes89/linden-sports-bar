import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { randomUUID } from 'crypto';
import { OAuth2Client } from 'google-auth-library';
import {
  findUserById,
  upsertUser,
  listUsers,
} from './db.js';
import {
  signToken,
  authMiddleware,
  adminMiddleware,
  sanitizeUser,
  isAdminEmail,
} from './auth.js';

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

app.get('/api/auth/me', authMiddleware, (req, res) => {
  const user = findUserById(req.auth.sub);
  if (!user) {
    return res.status(404).json({ error: 'User not found.' });
  }
  res.json({ user: sanitizeUser(user) });
});

app.post('/api/auth/email-phone', (req, res) => {
  const { name, email, phone } = req.body;

  if (!name?.trim()) {
    return res.status(400).json({ error: 'Name is required.' });
  }

  const normalizedEmail = email?.trim().toLowerCase() || null;
  const normalizedPhone = normalizePhone(phone);

  if (!normalizedEmail && !normalizedPhone) {
    return res.status(400).json({ error: 'Email or phone number is required.' });
  }

  const user = upsertUser({
    id: randomUUID(),
    name: name.trim(),
    email: normalizedEmail,
    phone: normalizedPhone,
    provider: 'email',
    provider_id: normalizedEmail || normalizedPhone,
    role: resolveRole(normalizedEmail),
  });

  res.json(loginResponse(user));
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

app.get('/api/admin/users', authMiddleware, adminMiddleware, (_req, res) => {
  const users = listUsers().map(sanitizeUser);
  res.json({ users, total: users.length });
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