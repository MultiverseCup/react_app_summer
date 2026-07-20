import type { CartItem } from "../Contexts/CartContext";

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  totalPrice: number;
  orderTime: string;
  status: "active" | "ready" | "completed";
}

const ORDERS_KEY = "all_orders";

export const getOrders = (): Order[] => {
  const stored = localStorage.getItem(ORDERS_KEY);
  return stored ? JSON.parse(stored) : [];
};

const saveOrders = (orders: Order[]) => {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
};

export const addOrder = (order: Order) => {
  const orders = getOrders();
  orders.push(order);
  saveOrders(orders);
};

export const updateOrderStatus = (orderId: string, status: Order["status"]) => {
  const orders = getOrders();
  const idx = orders.findIndex((o) => o.id === orderId);
  if (idx !== -1) {
    orders[idx].status = status;
    saveOrders(orders);
  }
};

export const getActiveOrderForUser = (userId: string): Order | null => {
  const orders = getOrders();
  return orders.find((o) => o.userId === userId && o.status !== "completed") ?? null;
};