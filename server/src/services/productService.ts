import { Product, ProductQueryParams } from '../types/index.js';
import { INITIAL_PRODUCTS } from '../data/initialProducts.js';
import { db, isFirebaseConfigured } from '../config/firebase.js';

class ProductService {
  private localProducts: Product[] = [...INITIAL_PRODUCTS];
  private isRestored = false;

  async getProducts(params: ProductQueryParams = {}): Promise<Product[]> {
    let products: Product[] = [];

    if (isFirebaseConfigured && db) {
      try {
        const snapshot = await db.collection('products').get();
        if (!snapshot.empty) {
          products = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() } as Product));
        } else {
          products = [...this.localProducts];
        }
      } catch (err) {
        console.warn('Error fetching from Firestore, falling back to local dataset:', err);
        products = [...this.localProducts];
      }
    } else {
      products = [...this.localProducts];
    }

    // Ensure all initial products are available
    const productMap = new Map<string, Product>();
    for (const initProd of INITIAL_PRODUCTS) {
      productMap.set(initProd.id, initProd);
    }
    for (const p of products) {
      productMap.set(p.id, p);
    }
    products = Array.from(productMap.values());

    // One-time restore of initial products to Firestore
    if (!this.isRestored && isFirebaseConfigured && db) {
      this.isRestored = true;
      for (const initProd of INITIAL_PRODUCTS) {
        db.collection('products').doc(initProd.id).set(initProd, { merge: true }).catch(() => {});
      }
    }

    // Filter by Category
    if (params.category && params.category !== 'All' && params.category !== 'All Products' && params.category !== 'Home') {
      const catLower = params.category.toLowerCase().trim();
      products = products.filter(p => p.category.toLowerCase() === catLower);
    }

    // Filter by Search Query (Name, Category, Description, Tags)
    if (params.search && params.search.trim()) {
      const q = params.search.toLowerCase().trim();
      products = products.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.tags.some(tag => tag.toLowerCase().includes(q))
      );
    }

    // Filter by Age Group
    if (params.ageGroup && params.ageGroup !== 'All Ages') {
      const ageLower = params.ageGroup.toLowerCase();
      products = products.filter(p => p.ageGroup.toLowerCase() === ageLower || p.ageGroup === 'All Ages');
    }

    // Filter by Price Range
    if (params.minPrice !== undefined) {
      products = products.filter(p => p.price >= (params.minPrice || 0));
    }
    if (params.maxPrice !== undefined) {
      products = products.filter(p => p.price <= (params.maxPrice || Infinity));
    }

    // Filter by Rating
    if (params.minRating !== undefined && params.minRating > 0) {
      products = products.filter(p => p.rating >= (params.minRating || 0));
    }

    // Sorting
    switch (params.sort) {
      case 'price_asc':
        products.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        products.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        products.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        products.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'recommended':
      default:
        // Prioritize newly added products, then featured products, then highest rating
        products.sort((a, b) => {
          const aTime = new Date(a.createdAt || 0).getTime();
          const bTime = new Date(b.createdAt || 0).getTime();
          if (aTime !== bTime) {
            return bTime - aTime;
          }
          if (a.isFeatured && !b.isFeatured) return -1;
          if (!a.isFeatured && b.isFeatured) return 1;
          return b.rating - a.rating;
        });
        break;
    }

    return products;
  }

  async getProductById(id: string): Promise<Product | null> {
    if (isFirebaseConfigured && db) {
      try {
        const doc = await db.collection('products').doc(id).get();
        if (doc.exists) {
          return { id: doc.id, ...doc.data() } as Product;
        }
      } catch (err) {
        console.warn(`Firestore getProductById error for ${id}:`, err);
      }
    }
    return this.localProducts.find(p => p.id === id) || null;
  }

  async createProduct(data: Omit<Product, 'id' | 'createdAt'>): Promise<Product> {
    const newProduct: Product = {
      ...data,
      id: `bs-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    if (isFirebaseConfigured && db) {
      try {
        await db.collection('products').doc(newProduct.id).set(newProduct);
      } catch (err) {
        console.warn('Firestore createProduct error:', err);
      }
    }
    this.localProducts.unshift(newProduct);
    return newProduct;
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
    const existing = await this.getProductById(id);
    if (!existing) return null;

    const updated: Product = {
      ...existing,
      ...updates,
      id,
    };

    if (isFirebaseConfigured && db) {
      try {
        await db.collection('products').doc(id).set(updated, { merge: true });
      } catch (err) {
        console.warn(`Firestore updateProduct error for ${id}:`, err);
      }
    }

    const index = this.localProducts.findIndex(p => p.id === id);
    if (index !== -1) {
      this.localProducts[index] = updated;
    } else {
      this.localProducts.unshift(updated);
    }
    return updated;
  }

  async deleteProduct(id: string): Promise<boolean> {
    const existing = await this.getProductById(id);
    if (!existing) return false;

    if (isFirebaseConfigured && db) {
      try {
        await db.collection('products').doc(id).delete();
      } catch (err) {
        console.warn(`Firestore deleteProduct error for ${id}:`, err);
      }
    }

    this.localProducts = this.localProducts.filter(p => p.id !== id);
    return true;
  }
}

export const productService = new ProductService();
