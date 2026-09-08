export interface Product {
  id: string;
  name: string;
  shortDescription: string;
  description: string;
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  category: string;
  ageGroup: string;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  stock: number;
  tags: string[];
  benefits: string[];
  ingredientsOrSpecs?: string[];
  isFeatured?: boolean;
  createdAt: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

export interface GuestInfo {
  name: string;
  email: string;
  phone: string;
}

export interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  pinCode: string;
  landmark?: string;
}

export interface Order {
  id: string;
  userId?: string;
  guestInfo: GuestInfo;
  shippingAddress: ShippingAddress;
  paymentMethod: 'cod' | 'upi' | 'card';
  items: OrderItem[];
  subtotal: number;
  discount: number;
  delivery: number;
  total: number;
  status: 'placed' | 'confirmed' | 'dispatched' | 'delivered';
  createdAt: string;
}

export interface ProductQueryParams {
  category?: string;
  search?: string;
  ageGroup?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  sort?: 'recommended' | 'price_asc' | 'price_desc' | 'newest' | 'rating';
}
