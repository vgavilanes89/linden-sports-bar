import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { randomUUID } from 'crypto';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, 'data');
const ordersPath = path.join(dataDir, 'orders.json');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

function readOrders() {
  if (!fs.existsSync(ordersPath)) {
    return [];
  }

  try {
    return JSON.parse(fs.readFileSync(ordersPath, 'utf8'));
  } catch {
    return [];
  }
}

function writeOrders(orders) {
  fs.writeFileSync(ordersPath, JSON.stringify(orders, null, 2));
}

export function createOrder({ userId, userName, userEmail, items, subtotal, tax, total }) {
  const order = {
    id: randomUUID(),
    user_id: userId,
    user_name: userName,
    user_email: userEmail ?? null,
    items,
    subtotal,
    tax,
    total,
    status: 'placed',
    created_at: new Date().toISOString(),
  };

  writeOrders([order, ...readOrders()]);
  return order;
}

export function listOrdersByUser(userId) {
  return readOrders()
    .filter((order) => order.user_id === userId)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export function listAllOrders() {
  return readOrders().sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export function findOrderById(id) {
  return readOrders().find((order) => order.id === id);
}

export function deleteOrder(id) {
  const orders = readOrders();
  const order = orders.find((entry) => entry.id === id);
  if (!order) return null;

  writeOrders(orders.filter((entry) => entry.id !== id));
  return order;
}

export function sanitizeOrder(order) {
  return {
    id: order.id,
    userId: order.user_id,
    userName: order.user_name,
    userEmail: order.user_email,
    items: order.items,
    subtotal: order.subtotal,
    tax: order.tax,
    total: order.total,
    status: order.status,
    createdAt: order.created_at,
  };
}
