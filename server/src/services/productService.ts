import { Product, ProductQueryParams } from '../types/index.js';
import { CreateProductInput, UpdateProductInput } from '../types/admin.js';
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

  async createProduct(input: CreateProductInput): Promise<Product> {
    const id = `prod_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const nowIso = new Date().toISOString();

    const price = Number(input.price);
    const originalPrice = input.originalPrice ? Number(input.originalPrice) : undefined;
    let discountPercentage: number | undefined = undefined;

    if (originalPrice && originalPrice > price) {
      discountPercentage = Math.round(((originalPrice - price) / originalPrice) * 100);
    }

    const newProduct: Product = {
      id,
      name: input.name.trim(),
      shortDescription: (input.shortDescription || input.name).trim(),
      description: (input.description || input.shortDescription || input.name).trim(),
      price,
      originalPrice,
      discountPercentage,
      category: input.category || 'Baby Care',
      ageGroup: input.ageGroup || 'All Ages',
      rating: input.rating !== undefined ? Number(input.rating) : 4.9,
      reviewCount: input.reviewCount !== undefined ? Number(input.reviewCount) : 18,
      imageUrl: input.imageUrl.trim(),
      stock: input.stock !== undefined ? Number(input.stock) : 15,
      tags: input.tags && input.tags.length > 0 ? input.tags : ['New Arrival', 'Pediatrician Approved'],
      benefits: input.benefits && input.benefits.length > 0 ? input.benefits : ['Dermatologically Tested', 'Gentle & Hypoallergenic', '100% Safe For Infants'],
      ingredientsOrSpecs: input.ingredientsOrSpecs || [],
      isFeatured: input.isFeatured ?? true,
      createdAt: nowIso,
    };

    // 1. Write to Firestore
    if (isFirebaseConfigured && db) {
      try {
        await db.collection('products').doc(id).set(newProduct);
        console.log(`✅ Product '${newProduct.name}' successfully added to Firestore (${id})`);
      } catch (err) {
        console.error('Failed to create product in Firestore:', err);
      }
    }

    // 2. Cache in local array
    this.localProducts.unshift(newProduct);

    return newProduct;
  }

  async updateProduct(id: string, input: UpdateProductInput): Promise<Product | null> {
    const existing = await this.getProductById(id);
    if (!existing) {
      return null;
    }

    const price = input.price !== undefined ? Number(input.price) : existing.price;
    const originalPrice = input.originalPrice !== undefined ? Number(input.originalPrice) : existing.originalPrice;
    let discountPercentage = existing.discountPercentage;

    if (originalPrice && originalPrice > price) {
      discountPercentage = Math.round(((originalPrice - price) / originalPrice) * 100);
    } else if (originalPrice && originalPrice <= price) {
      discountPercentage = undefined;
    }

    const updatedProduct: Product = {
      ...existing,
      ...input,
      id,
      price,
      originalPrice,
      discountPercentage,
      name: input.name ? input.name.trim() : existing.name,
      category: input.category || existing.category,
      imageUrl: input.imageUrl ? input.imageUrl.trim() : existing.imageUrl,
      stock: input.stock !== undefined ? Number(input.stock) : existing.stock,
    };

    // 1. Update in Firestore
    if (isFirebaseConfigured && db) {
      try {
        await db.collection('products').doc(id).set(updatedProduct, { merge: true });
        console.log(`✅ Product '${updatedProduct.name}' updated in Firestore (${id})`);
      } catch (err) {
        console.error('Failed to update product in Firestore:', err);
      }
    }

    // 2. Update in local array
    const idx = this.localProducts.findIndex(p => p.id === id);
    if (idx !== -1) {
      this.localProducts[idx] = updatedProduct;
    }

    return updatedProduct;
  }

  async deleteProduct(id: string): Promise<boolean> {
    const existing = await this.getProductById(id);
    if (!existing) {
      return false;
    }

    // 1. Delete from Firestore
    if (isFirebaseConfigured && db) {
      try {
        await db.collection('products').doc(id).delete();
        console.log(`🗑️ Product deleted from Firestore (${id})`);
      } catch (err) {
        console.error('Failed to delete product from Firestore:', err);
      }
    }

    // 2. Delete from local cache
    this.localProducts = this.localProducts.filter(p => p.id !== id);

    return true;
  }
}

export const productService = new ProductService();
