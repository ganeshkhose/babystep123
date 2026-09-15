import { adminAuthService } from './adminAuthService';
import { Product } from '../../types/product';
import { ProductFormData } from '../types';

const API_BASE = import.meta.env.VITE_API_URL || '';

class AdminProductService {
  private getAuthHeaders(): HeadersInit {
    const token = adminAuthService.getToken();
    return {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    };
  }

  async fetchAllProducts(): Promise<Product[]> {
    try {
      const res = await fetch(`${API_BASE}/api/products`);
      if (!res.ok) throw new Error('Failed to fetch products');
      const data = await res.json();
      return data.data || [];
    } catch (err) {
      console.warn('Could not fetch remote products:', err);
      return [];
    }
  }

  async createProduct(formData: ProductFormData): Promise<{ success: boolean; data?: Product; message?: string }> {
    try {
      const res = await fetch(`${API_BASE}/api/products`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, message: data.message || 'Failed to create product' };
      }

      return { success: true, data: data.data };
    } catch (err: any) {
      return { success: false, message: err.message || 'Network error creating product' };
    }
  }

  async updateProduct(id: string, formData: Partial<ProductFormData>): Promise<{ success: boolean; data?: Product; message?: string }> {
    try {
      const res = await fetch(`${API_BASE}/api/products/${id}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, message: data.message || 'Failed to update product' };
      }

      return { success: true, data: data.data };
    } catch (err: any) {
      return { success: false, message: err.message || 'Network error updating product' };
    }
  }

  async deleteProduct(id: string): Promise<{ success: boolean; message?: string }> {
    try {
      const res = await fetch(`${API_BASE}/api/products/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, message: data.message || 'Failed to delete product' };
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, message: err.message || 'Network error deleting product' };
    }
  }
}

export const adminProductService = new AdminProductService();
