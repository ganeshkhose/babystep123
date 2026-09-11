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

export interface ProductQueryParams {
  category?: string;
  search?: string;
  ageGroup?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  sort?: 'recommended' | 'price_asc' | 'price_desc' | 'newest' | 'rating';
}
