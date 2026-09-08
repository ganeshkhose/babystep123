export interface OrderItemSummary {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

export interface GuestCustomer {
  name: string;
  email: string;
  phone: string;
}

export interface OrderAddress {
  street: string;
  city: string;
  state: string;
  pinCode: string;
  landmark?: string;
}

export interface Order {
  id: string;
  userId?: string;
  guestInfo: GuestCustomer;
  shippingAddress: OrderAddress;
  paymentMethod: 'cod' | 'upi' | 'card';
  items: OrderItemSummary[];
  subtotal: number;
  discount: number;
  delivery: number;
  total: number;
  status: 'placed' | 'confirmed' | 'dispatched' | 'delivered';
  createdAt: string;
}
