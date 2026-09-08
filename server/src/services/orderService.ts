import { Order, OrderItem, GuestInfo, ShippingAddress } from '../types/index.js';
import { productService } from './productService.js';
import { db, isFirebaseConfigured } from '../config/firebase.js';

interface CreateOrderInput {
  userId?: string;
  guestInfo: GuestInfo;
  shippingAddress: ShippingAddress;
  paymentMethod: 'cod' | 'upi' | 'card';
  items: { productId: string; quantity: number }[];
}

class OrderService {
  private localOrders: Order[] = [];

  async createOrder(input: CreateOrderInput): Promise<Order> {
    if (!input.items || input.items.length === 0) {
      throw new Error('Order must contain at least one item');
    }

    if (!input.guestInfo || !input.guestInfo.name || !input.guestInfo.email || !input.guestInfo.phone) {
      throw new Error('Guest customer information is incomplete');
    }

    if (!input.shippingAddress || !input.shippingAddress.street || !input.shippingAddress.city || !input.shippingAddress.pinCode) {
      throw new Error('Shipping address is incomplete');
    }

    // Securely resolve each product and calculate server-side price
    const verifiedItems: OrderItem[] = [];
    let subtotal = 0;

    for (const item of input.items) {
      if (item.quantity <= 0) {
        throw new Error(`Invalid quantity for product ${item.productId}`);
      }

      const product = await productService.getProductById(item.productId);
      if (!product) {
        throw new Error(`Product not found: ${item.productId}`);
      }

      const itemSubtotal = product.price * item.quantity;
      subtotal += itemSubtotal;

      verifiedItems.push({
        productId: product.id,
        name: product.name,
        price: product.price, // Trusted server price
        quantity: item.quantity,
        imageUrl: product.imageUrl,
      });
    }

    // Business rule: Special promotional discount for orders above ₹999
    const discount = subtotal >= 999 ? 100 : 0;
    // Business rule: Free delivery for all orders above ₹499
    const delivery = subtotal >= 499 ? 0 : 49;
    const total = Math.max(0, subtotal - discount + delivery);

    const orderId = `BS-${Math.floor(100000 + Math.random() * 900000)}`;

    const newOrder: Order = {
      id: orderId,
      userId: input.userId,
      guestInfo: input.guestInfo,
      shippingAddress: input.shippingAddress,
      paymentMethod: input.paymentMethod || 'cod',
      items: verifiedItems,
      subtotal,
      discount,
      delivery,
      total,
      status: 'placed',
      createdAt: new Date().toISOString(),
    };

    if (isFirebaseConfigured && db) {
      try {
        await db.collection('orders').doc(orderId).set(newOrder);
      } catch (err) {
        console.warn('Could not save order to Firestore; stored locally:', err);
      }
    }

    this.localOrders.unshift(newOrder);
    return newOrder;
  }

  async getOrdersByUserId(userId: string): Promise<Order[]> {
    if (isFirebaseConfigured && db) {
      try {
        const snapshot = await db.collection('orders').where('userId', '==', userId).get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
      } catch (err) {
        console.warn('Error fetching orders from Firestore:', err);
      }
    }
    return this.localOrders.filter(o => o.userId === userId);
  }

  async getOrderById(orderId: string): Promise<Order | null> {
    if (isFirebaseConfigured && db) {
      try {
        const doc = await db.collection('orders').doc(orderId).get();
        if (doc.exists) {
          return { id: doc.id, ...doc.data() } as Order;
        }
      } catch (err) {
        console.warn('Error fetching order by ID:', err);
      }
    }
    return this.localOrders.find(o => o.id === orderId) || null;
  }
}

export const orderService = new OrderService();
