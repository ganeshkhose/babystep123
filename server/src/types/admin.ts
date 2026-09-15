import { Product } from './index.js';

export type AdminRole = 'superadmin' | 'catalog_manager';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
  passwordHash: string; // bcrypt salt + hash
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

export interface AdminAuthPayload {
  adminId: string;
  email: string;
  name: string;
  role: AdminRole;
}

// Augment Express Request interface for TypeScript
declare global {
  namespace Express {
    interface Request {
      admin?: AdminAuthPayload;
    }
  }
}

export interface CreateProductInput {
  name: string;
  shortDescription?: string;
  description?: string;
  price: number;
  originalPrice?: number;
  category: string;
  ageGroup?: string;
  imageUrl: string;
  stock: number;
  rating?: number;
  reviewCount?: number;
  tags?: string[];
  benefits?: string[];
  ingredientsOrSpecs?: string[];
  isFeatured?: boolean;
}

export interface UpdateProductInput extends Partial<CreateProductInput> {
  id?: string;
}
