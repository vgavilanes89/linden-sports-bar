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
  return readUsers().find((user) => user.phone === phone);
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
    phone,
    provider: 'email',
    provider_id: email,
    password_hash: passwordHash,
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

export function updateUserPhone(userId, phone) {
  const existingByPhone = findUserByPhone(phone);
  if (existingByPhone && existingByPhone.id !== userId) {
    return { error: 'This phone number is already linked to another account.' };
  }

  const users = readUsers();
  const existing = users.find((user) => user.id === userId);
  if (!existing) {
    return { error: 'User not found.' };
  }

  const updated = { ...existing, phone };
  writeUsers(users.map((entry) => (entry.id === userId ? updated : entry)));
  return { user: updated };
}
