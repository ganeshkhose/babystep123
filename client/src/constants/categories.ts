import { CategoryName } from '../types/product';

export const STORE_CATEGORIES: CategoryName[] = [
  'Home',
  'Baby Care',
  'Bath & Body',
  'Mom & Baby',
];

export interface MobileCategoryItem {
  name: string;
  label: string;
  icon: string;
  desc: string;
}

export const MOBILE_CATEGORIES: MobileCategoryItem[] = [
  { name: 'All Products', label: 'All Products', icon: '🏠', desc: 'Explore all baby essentials' },
  { name: 'Baby Care', label: 'Baby Care', icon: '🍼', desc: 'Diapers, wipes, lotions & oils' },
  { name: 'Bath & Body', label: 'Bath & Body', icon: '🛁', desc: 'Gentle washes, shampoos & soaps' },
  { name: 'Mom & Baby', label: 'Mom & Baby', icon: '🤱', desc: 'Nursing, feeding & maternal care' },
];
