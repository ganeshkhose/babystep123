import { Product } from './product';

export interface BasketItem {
  product: Product;
  quantity: number;
}

export interface BasketState {
  items: BasketItem[];
}
