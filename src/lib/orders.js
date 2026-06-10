const ORDERS_KEY_PREFIX = 'linden_orders_';

function getStorageKey(userId) {
  return `${ORDERS_KEY_PREFIX}${userId}`;
}

export function getOrders(userId) {
  if (!userId) return [];

  try {
    const raw = localStorage.getItem(getStorageKey(userId));
    const orders = raw ? JSON.parse(raw) : [];
    return orders.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch {
    return [];
  }
}

export function saveOrder(userId, order) {
  if (!userId) return null;

  const orders = getOrders(userId);
  const saved = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    status: 'placed',
    ...order,
  };

  localStorage.setItem(getStorageKey(userId), JSON.stringify([saved, ...orders]));
  return saved;
}
