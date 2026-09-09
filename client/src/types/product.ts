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

export type CategoryName =
  | 'Home'
  | 'All Products'
  | 'Baby Care'
  | 'Bath & Body'
  | 'Mom & Baby';

export type AgeGroup =
  | 'All Ages'
  | '0-6 months'
  | '6-12 months'
  | '1-2 years'
  | '2+ years';

export type SortOption =
  | 'recommended'
  | 'price_asc'
  | 'price_desc'
  | 'newest'
  | 'best_rated';

export interface FilterState {
  category: CategoryName;
  searchQuery: string;
  ageGroup: AgeGroup;
  priceRange: [number, number];
  minRating: number;
  sortBy: SortOption;
}
