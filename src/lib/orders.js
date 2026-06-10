import { api } from './api';

export async function getOrders() {
  const data = await api.getOrders();
  return data.orders;
}

export async function placeOrder(order) {
  const data = await api.createOrder(order);
  return data.order;
}
