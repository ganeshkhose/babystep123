import { apiClient } from './api';
import { Order, GuestCustomer, OrderAddress } from '../types/order';
import { BasketItem } from '../types/basket';
import { firestore, isFirebaseAvailable } from './firebase';
import { doc, setDoc, collection, getDocs, query, where } from 'firebase/firestore';

interface CreateOrderPayload {
  guestInfo: GuestCustomer;
  shippingAddress: OrderAddress;
  paymentMethod: 'cod' | 'upi' | 'card';
  items: BasketItem[];
  userId?: string;
}

const LOCAL_ORDERS_KEY = 'baby_step_orders';

export const createOrder = async (payload: CreateOrderPayload): Promise<Order> => {
  const backendItems = payload.items.map(item => ({
    productId: item.product.id,
    quantity: item.quantity,
  }));

  // Calculate order financials
  const subtotal = payload.items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const discount = subtotal >= 999 ? 100 : 0;
  const delivery = subtotal >= 499 ? 0 : 49;
  const total = Math.max(0, subtotal - discount + delivery);

  const orderId = `BS-${Math.floor(100000 + Math.random() * 900000)}`;

  const order: Order = {
    id: orderId,
    userId: payload.userId,
    guestInfo: payload.guestInfo,
    shippingAddress: payload.shippingAddress,
    paymentMethod: payload.paymentMethod,
    items: payload.items.map(i => ({
      productId: i.product.id,
      name: i.product.name,
      price: i.product.price,
      quantity: i.quantity,
      imageUrl: i.product.imageUrl,
    })),
    subtotal,
    discount,
    delivery,
    total,
    status: 'placed',
    createdAt: new Date().toISOString(),
  };

  // 1. Persist directly to Firebase Firestore Database if configured
  if (isFirebaseAvailable && firestore) {
    try {
      await setDoc(doc(firestore, 'orders', order.id), order);
      console.log('✅ Order saved to Firebase Firestore:', order.id);
    } catch (err) {
      console.warn('Firestore createOrder note:', err);
    }
  }

  // 2. Also notify Express backend if running
  try {
    const response = await apiClient.post<{ success: boolean; data: Order }>('/orders', {
      guestInfo: payload.guestInfo,
      shippingAddress: payload.shippingAddress,
      paymentMethod: payload.paymentMethod,
      items: backendItems,
      userId: payload.userId,
    });
    if (response.data?.success && response.data.data) {
      saveOrderLocally(response.data.data);
      return response.data.data;
    }
  } catch (error) {
    // Local / Firestore order is already prepared
  }

  saveOrderLocally(order);
  return order;
};

const saveOrderLocally = (order: Order) => {
  try {
    const saved = localStorage.getItem(LOCAL_ORDERS_KEY);
    const orders: Order[] = saved ? JSON.parse(saved) : [];
    orders.unshift(order);
    localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(orders));
  } catch (err) {
    console.warn('Could not save order locally:', err);
  }
};

export const getLocalOrders = (): Order[] => {
  try {
    const saved = localStorage.getItem(LOCAL_ORDERS_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

export const fetchOrdersByUser = async (userId: string): Promise<Order[]> => {
  if (isFirebaseAvailable && firestore && userId) {
    try {
      const q = query(collection(firestore, 'orders'), where('userId', '==', userId));
      const snap = await getDocs(q);
      if (!snap.empty) {
        return snap.docs.map(d => ({ id: d.id, ...d.data() } as Order));
      }
    } catch (err) {
      console.warn('Firestore fetchOrdersByUser note:', err);
    }
  }

  // Fallback to local storage filtered by userId or all local orders
  const local = getLocalOrders();
  if (userId) {
    const filtered = local.filter(o => o.userId === userId);
    return filtered.length > 0 ? filtered : local;
  }
  return local;
};
