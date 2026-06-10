import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, 'data');
const dbPath = path.join(dataDir, 'users.json');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

function readUsers() {
  if (!fs.existsSync(dbPath)) {
    return [];
  }

  try {
    return JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  } catch {
    return [];
  }
}

function writeUsers(users) {
  fs.writeFileSync(dbPath, JSON.stringify(users, null, 2));
}

export function findUserById(id) {
  return readUsers().find((user) => user.id === id);
}

export function findUserByEmail(email) {
  if (!email) return null;
  return readUsers().find((user) => user.email?.toLowerCase() === email.toLowerCase());
}

export function findUserByPhone(phone) {
  if (!phone) return null;
  return readUsers().find(
    (user) => user.phone === phone || user.phone_pending === phone
  );
}

export function isPhoneTakenByOther(phone, userId) {
  if (!phone) return false;
  return readUsers().some(
    (user) =>
      user.id !== userId && (user.phone === phone || user.phone_pending === phone)
  );
}

export function findUserByProvider(provider, providerId) {
  if (!providerId) return null;
  return readUsers().find(
    (user) => user.provider === provider && user.provider_id === providerId
  );
}

export function upsertUser(user) {
  const users = readUsers();
  const existing =
    (user.email && findUserByEmail(user.email)) ||
    (user.phone && findUserByPhone(user.phone)) ||
    (user.provider_id && findUserByProvider(user.provider, user.provider_id));

  const now = new Date().toISOString();

  if (existing) {
    const updated = {
      ...existing,
      name: user.name?.trim() || existing.name,
      email: user.email ?? existing.email,
      phone: user.phone ?? existing.phone,
      provider: user.provider,
      provider_id: user.provider_id ?? existing.provider_id,
      role: user.role ?? existing.role,
      password_hash: user.password_hash ?? existing.password_hash,
      phone_verified: user.phone_verified ?? existing.phone_verified ?? false,
      phone_pending: user.phone_pending ?? existing.phone_pending ?? null,
      phone_verify_code_hash: user.phone_verify_code_hash ?? existing.phone_verify_code_hash ?? null,
      phone_verify_expires: user.phone_verify_expires ?? existing.phone_verify_expires ?? null,
      last_login_at: now,
    };

    writeUsers(users.map((entry) => (entry.id === existing.id ? updated : entry)));
    return updated;
  }

  const created = {
    id: user.id,
    name: user.name,
    email: user.email ?? null,
    phone: user.phone ?? null,
    provider: user.provider,
    provider_id: user.provider_id ?? null,
    password_hash: user.password_hash ?? null,
    phone_verified: user.phone_verified ?? false,
    phone_pending: user.phone_pending ?? null,
    phone_verify_code_hash: user.phone_verify_code_hash ?? null,
    phone_verify_expires: user.phone_verify_expires ?? null,
    role: user.role ?? 'user',
    created_at: now,
    last_login_at: now,
  };

  writeUsers([created, ...users]);
  return created;
}

export function listUsers() {
  return readUsers().sort(
    (a, b) => new Date(b.last_login_at).getTime() - new Date(a.last_login_at).getTime()
  );
}

export function createEmailUser({ id, name, email, phone, passwordHash, role }) {
  if (findUserByEmail(email)) {
    return { error: 'An account with this email already exists.' };
  }

  if (findUserByPhone(phone)) {
    return { error: 'An account with this phone number already exists.' };
  }

  const now = new Date().toISOString();
  const user = {
    id,
    name,
    email,
    phone: null,
    provider: 'email',
    provider_id: email,
    password_hash: passwordHash,
    phone_verified: false,
    phone_pending: phone,
    phone_verify_code_hash: null,
    phone_verify_expires: null,
    role: role ?? 'user',
    created_at: now,
    last_login_at: now,
  };

  writeUsers([user, ...readUsers()]);
  return { user };
}

export function touchUserLogin(userId) {
  const users = readUsers();
  const existing = users.find((user) => user.id === userId);
  if (!existing) return null;

  const now = new Date().toISOString();
  const updated = { ...existing, last_login_at: now };
  writeUsers(users.map((entry) => (entry.id === userId ? updated : entry)));
  return updated;
}

export function startPhoneVerification(userId, phone, codeHash, expiresAt) {
  if (isPhoneTakenByOther(phone, userId)) {
    return { error: 'This phone number is already linked to another account.' };
  }

  const users = readUsers();
  const existing = users.find((user) => user.id === userId);
  if (!existing) {
    return { error: 'User not found.' };
  }

  const updated = {
    ...existing,
    phone_pending: phone,
    phone_verify_code_hash: codeHash,
    phone_verify_expires: expiresAt,
  };

  writeUsers(users.map((entry) => (entry.id === userId ? updated : entry)));
  return { user: updated };
}

export function completePhoneVerification(userId, phone) {
  const users = readUsers();
  const existing = users.find((user) => user.id === userId);
  if (!existing) {
    return { error: 'User not found.' };
  }

  const updated = {
    ...existing,
    phone,
    phone_verified: true,
    phone_pending: null,
    phone_verify_code_hash: null,
    phone_verify_expires: null,
  };

  writeUsers(users.map((entry) => (entry.id === userId ? updated : entry)));
  return { user: updated };
}

export function clearPhoneVerification(userId) {
  const users = readUsers();
  const existing = users.find((user) => user.id === userId);
  if (!existing) return null;

  const updated = {
    ...existing,
    phone_pending: null,
    phone_verify_code_hash: null,
    phone_verify_expires: null,
  };

  writeUsers(users.map((entry) => (entry.id === userId ? updated : entry)));
  return updated;
}

export function updateUserByAdmin(userId, { name, email, phone, role, phoneVerified }) {
  const users = readUsers();
  const existing = users.find((user) => user.id === userId);
  if (!existing) {
    return { error: 'User not found.' };
  }

  const normalizedEmail = email?.trim().toLowerCase() || null;
  const normalizedPhone = phone?.replace(/\D/g, '') || null;

  if (!name?.trim()) {
    return { error: 'Name is required.' };
  }

  if (normalizedEmail) {
    const emailTaken = users.find(
      (user) => user.id !== userId && user.email?.toLowerCase() === normalizedEmail
    );
    if (emailTaken) {
      return { error: 'Another account already uses this email.' };
    }
  }

  if (normalizedPhone && isPhoneTakenByOther(normalizedPhone, userId)) {
    return { error: 'Another account already uses this phone number.' };
  }

  const verified = Boolean(phoneVerified && normalizedPhone);

  const updated = {
    ...existing,
    name: name.trim(),
    email: normalizedEmail,
    phone: normalizedPhone,
    phone_verified: verified,
    phone_pending: verified ? null : existing.phone_pending,
    phone_verify_code_hash: verified ? null : existing.phone_verify_code_hash,
    phone_verify_expires: verified ? null : existing.phone_verify_expires,
    role: role === 'admin' ? 'admin' : 'user',
    provider_id:
      existing.provider === 'email' && normalizedEmail
        ? normalizedEmail
        : existing.provider_id,
  };

  writeUsers(users.map((entry) => (entry.id === userId ? updated : entry)));
  return { user: updated };
}

export function deleteUser(userId) {
  const users = readUsers();
  const existing = users.find((user) => user.id === userId);
  if (!existing) {
    return { error: 'User not found.' };
  }

  writeUsers(users.filter((user) => user.id !== userId));
  return { user: existing };
}
