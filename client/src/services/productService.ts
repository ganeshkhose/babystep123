import { apiClient } from './api';
import { Product, FilterState } from '../types/product';
import { SAMPLE_PRODUCTS } from '../data/sampleProducts';
import { firestore, isFirebaseAvailable } from './firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';

export const fetchProducts = async (filters?: Partial<FilterState>): Promise<Product[]> => {
  let baseProducts: Product[] | null = null;

  // 1. Direct Firebase Firestore Database Integration
  if (isFirebaseAvailable && firestore) {
    try {
      const productsCol = collection(firestore, 'products');
      const snapshot = await getDocs(productsCol);
      if (!snapshot.empty) {
        baseProducts = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Product));
      } else {
        baseProducts = [...SAMPLE_PRODUCTS];
      }
    } catch (err) {
      console.warn('Firestore fetchProducts note:', err);
    }
  }

  // 2. Express Backend API Fallback
  if (!baseProducts) {
    try {
      const params: Record<string, any> = {};
      if (filters?.category && filters.category !== 'All Products') {
        params.category = filters.category;
      }
      if (filters?.searchQuery) {
        params.search = filters.searchQuery;
      }
      if (filters?.ageGroup && filters.ageGroup !== 'All Ages') {
        params.ageGroup = filters.ageGroup;
      }
      if (filters?.priceRange) {
        params.minPrice = filters.priceRange[0];
        params.maxPrice = filters.priceRange[1];
      }
      if (filters?.minRating && filters.minRating > 0) {
        params.minRating = filters.minRating;
      }
      if (filters?.sortBy) {
        params.sort = filters.sortBy;
      }

      const response = await apiClient.get<{ success: boolean; data: Product[] }>('/products', { params });
      if (response.data?.success && Array.isArray(response.data.data)) {
        return response.data.data;
      }
    } catch (error) {
      // Graceful fallback to client dataset
    }
  }

  // 3. Fallback to bundled sample products
  let products = baseProducts ? [...baseProducts] : [...SAMPLE_PRODUCTS];

  if (filters?.category && filters.category !== 'All Products') {
    const cat = filters.category.toLowerCase().trim();
    products = products.filter(p => p.category.toLowerCase() === cat);
  }

  if (filters?.searchQuery && filters.searchQuery.trim()) {
    const q = filters.searchQuery.toLowerCase().trim();
    products = products.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.shortDescription.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.tags.some(t => t.toLowerCase().includes(q))
    );
  }

  if (filters?.ageGroup && filters.ageGroup !== 'All Ages') {
    const age = filters.ageGroup.toLowerCase();
    products = products.filter(p => p.ageGroup.toLowerCase() === age || p.ageGroup === 'All Ages');
  }

  if (filters?.priceRange) {
    const [min, max] = filters.priceRange;
    products = products.filter(p => p.price >= min && p.price <= max);
  }

  if (filters?.minRating && filters.minRating > 0) {
    const min = filters.minRating;
    products = products.filter(p => p.rating >= min);
  }

  if (filters?.sortBy) {
    switch (filters.sortBy) {
      case 'price_asc':
        products.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        products.sort((a, b) => b.price - a.price);
        break;
      case 'best_rated':
        products.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        products.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'recommended':
      default:
        products.sort((a, b) => {
          if (a.isFeatured && !b.isFeatured) return -1;
          if (!a.isFeatured && b.isFeatured) return 1;
          return b.rating - a.rating;
        });
        break;
    }
  }

  return products;
};

export const fetchProductById = async (productId: string): Promise<Product | null> => {
  // 1. Check Firestore
  if (isFirebaseAvailable && firestore) {
    try {
      const snap = await getDoc(doc(firestore, 'products', productId));
      if (snap.exists()) {
        return { id: snap.id, ...snap.data() } as Product;
      }
    } catch (err) {
      // Fallback
    }
  }

  // 2. Check Backend API
  try {
    const response = await apiClient.get<{ success: boolean; data: Product }>(`/products/${productId}`);
    if (response.data?.success && response.data.data) {
      return response.data.data;
    }
  } catch (error) {
    // Fallback to sample data
  }

  const found = SAMPLE_PRODUCTS.find(p => p.id === productId);
  return found || null;
};
