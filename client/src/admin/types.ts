export type AdminRole = 'superadmin' | 'catalog_manager';

export interface AdminProfile {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
  lastLoginAt?: string;
}

export interface AdminAuthSession {
  token: string;
  admin: AdminProfile;
}

export interface ProductFormData {
  name: string;
  shortDescription: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  ageGroup: string;
  imageUrl: string;
  stock: number;
  tags: string[];
  benefits: string[];
  isFeatured: boolean;
}
