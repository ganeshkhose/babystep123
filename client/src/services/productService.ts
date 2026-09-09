import { apiClient } from './api';
import { Product, FilterState } from '../types/product';
import { SAMPLE_PRODUCTS } from '../data/sampleProducts';
import { firestore, isFirebaseAvailable } from './firebase';
import { collection, getDocs, doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';

const CUSTOM_PRODUCTS_KEY = 'baby_step_admin_custom_products';
const DELETED_PRODUCTS_KEY = 'baby_step_deleted_ids';

export const getLocalCustomProducts = (): Product[] => {
  try {
    const raw = localStorage.getItem(CUSTOM_PRODUCTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveLocalCustomProducts = (products: Product[]) => {
  try {
    localStorage.setItem(CUSTOM_PRODUCTS_KEY, JSON.stringify(products));
  } catch {}
};

export const getDeletedProductIds = (): string[] => {
  try {
    const raw = localStorage.getItem(DELETED_PRODUCTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const fetchProducts = async (filters?: Partial<FilterState>): Promise<Product[]> => {
  let baseProducts: Product[] | null = null;

  // 1. Direct Firebase Firestore Database Integration
  if (isFirebaseAvailable && firestore) {
    try {
      const productsCol = collection(firestore, 'products');
      const snapshot = await getDocs(productsCol);
      if (!snapshot.empty) {
        baseProducts = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Product));
      }
    } catch (err) {
      console.warn('Firestore fetchProducts note:', err);
    }
  }

  // 2. Express Backend API Fallback
  if (!baseProducts) {
    try {
      const params: Record<string, any> = {};
      if (filters?.category && filters.category !== 'All Products' && filters.category !== 'Home') {
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
      if (response.data?.success && Array.isArray(response.data.data) && response.data.data.length > 0) {
        baseProducts = response.data.data;
      }
    } catch (error) {
      // Graceful fallback to client dataset
    }
  }

  // 3. Merge custom products with base/sample products
  const customProducts = getLocalCustomProducts();
  const deletedIds = new Set(getDeletedProductIds());

  // Map to hold unique products by ID (custom products override base products)
  const productMap = new Map<string, Product>();

  // Add custom products FIRST so admin newly created products appear immediately on top!
  for (const prod of customProducts) {
    if (!deletedIds.has(prod.id)) {
      productMap.set(prod.id, prod);
    }
  }

  // Then add base/sample products
  const sourceProducts = baseProducts && baseProducts.length > 0 ? baseProducts : SAMPLE_PRODUCTS;
  for (const prod of sourceProducts) {
    if (!deletedIds.has(prod.id) && !productMap.has(prod.id)) {
      productMap.set(prod.id, prod);
    }
  }

  let products = Array.from(productMap.values());

  if (filters?.category && filters.category !== 'All Products' && filters.category !== 'Home') {
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

  const sortBy = filters?.sortBy || 'recommended';
  switch (sortBy) {
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
      products.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      break;
    case 'recommended':
    default:
      products.sort((a, b) => {
        const aTime = new Date(a.createdAt || 0).getTime();
        const bTime = new Date(b.createdAt || 0).getTime();
        if (aTime !== bTime) {
          return bTime - aTime; // Admin newly added products appear on top!
        }
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
        return b.rating - a.rating;
      });
      break;
  }

  return products;
};

export const fetchProductById = async (productId: string): Promise<Product | null> => {
  const deletedIds = new Set(getDeletedProductIds());
  if (deletedIds.has(productId)) {
    return null;
  }

  // 1. Check local custom products first
  const custom = getLocalCustomProducts().find(p => p.id === productId);
  if (custom) return custom;

  // 2. Check Firestore
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

  // 3. Check Backend API
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

export const createProduct = async (
  data: Omit<Product, 'id' | 'createdAt'>
): Promise<Product> => {
  const newProduct: Product = {
    ...data,
    id: `bs-${Date.now()}`,
    createdAt: new Date().toISOString(),
    rating: data.rating || 5.0,
    reviewCount: data.reviewCount || 1,
  };

  // 1. Save to Firestore if configured
  if (isFirebaseAvailable && firestore) {
    try {
      await setDoc(doc(firestore, 'products', newProduct.id), newProduct);
    } catch (err) {
      console.warn('Firestore createProduct note:', err);
    }
  }

  // 2. Post to Express API
  try {
    await apiClient.post('/products', newProduct);
  } catch (err) {
    // Graceful offline fallback
  }

  // 3. Update local custom products
  const custom = getLocalCustomProducts().filter(p => p.id !== newProduct.id);
  saveLocalCustomProducts([newProduct, ...custom]);

  // Remove from deleted set if re-creating
  try {
    const deleted = getDeletedProductIds().filter(id => id !== newProduct.id);
    localStorage.setItem(DELETED_PRODUCTS_KEY, JSON.stringify(deleted));
  } catch {}

  // 4. Notify all listeners and other tabs of product catalog update
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('baby_step_last_updated', Date.now().toString());
      window.dispatchEvent(new CustomEvent('baby_step_products_updated', { detail: newProduct }));
    } catch {}
  }

  return newProduct;
};

export const updateProduct = async (
  productId: string,
  updates: Partial<Product>
): Promise<Product> => {
  // 1. Update in Firestore if configured
  if (isFirebaseAvailable && firestore) {
    try {
      await setDoc(doc(firestore, 'products', productId), updates, { merge: true });
    } catch (err) {
      console.warn('Firestore updateProduct note:', err);
    }
  }

  // 2. Put to Express API
  try {
    await apiClient.put(`/products/${productId}`, updates);
  } catch (err) {}

  // 3. Update in local custom products
  const custom = getLocalCustomProducts();
  const idx = custom.findIndex(p => p.id === productId);
  let updatedProduct: Product;

  if (idx !== -1) {
    updatedProduct = { ...custom[idx], ...updates, id: productId };
    custom[idx] = updatedProduct;
    saveLocalCustomProducts(custom);
  } else {
    // If it was a sample product, promote to custom overrides
    const sample = SAMPLE_PRODUCTS.find(p => p.id === productId) || ({} as Product);
    updatedProduct = { ...sample, ...updates, id: productId };
    saveLocalCustomProducts([updatedProduct, ...custom]);
  }

  // 4. Notify all listeners and tabs
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('baby_step_last_updated', Date.now().toString());
      window.dispatchEvent(new CustomEvent('baby_step_products_updated', { detail: updatedProduct }));
    } catch {}
  }

  return updatedProduct;
};

export const deleteProduct = async (productId: string): Promise<boolean> => {
  // 1. Delete from Firestore if configured
  if (isFirebaseAvailable && firestore) {
    try {
      await deleteDoc(doc(firestore, 'products', productId));
    } catch (err) {
      console.warn('Firestore deleteProduct note:', err);
    }
  }

  // 2. Delete from Express API
  try {
    await apiClient.delete(`/products/${productId}`);
  } catch (err) {}

  // 3. Remove from custom products list
  const custom = getLocalCustomProducts().filter(p => p.id !== productId);
  saveLocalCustomProducts(custom);

  // 4. Mark ID in deleted set
  const deleted = getDeletedProductIds();
  if (!deleted.includes(productId)) {
    deleted.push(productId);
    localStorage.setItem(DELETED_PRODUCTS_KEY, JSON.stringify(deleted));
  }

  // 5. Notify all listeners and tabs
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('baby_step_last_updated', Date.now().toString());
      window.dispatchEvent(new CustomEvent('baby_step_products_updated', { detail: { id: productId, deleted: true } }));
    } catch {}
  }

  return true;
};
