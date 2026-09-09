import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Package,
  Tag,
  Layers,
  Star,
  Plus,
  Shield,
  KeyRound,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { Product } from '../../types/product';
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../../services/productService';
import { useToast } from '../../context/ToastContext';
import { AdminNavbar } from './AdminNavbar';
import { ProductTable } from './ProductTable';
import { ProductForm } from './ProductForm';

const ADMIN_SESSION_KEY = 'baby_step_admin_authenticated';
const DEFAULT_PASSCODE = 'admin123';

export const AdminPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true';
  });
  const [passcode, setPasscode] = useState('');
  const [passcodeError, setPasscodeError] = useState<string | null>(null);

  // View States
  const [activeTab, setActiveTab] = useState<'catalog' | 'add_product'>('catalog');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch products
  const { data: products = [], isLoading, refetch } = useQuery({
    queryKey: ['products'],
    queryFn: () => fetchProducts({ category: 'All Products' }),
  });

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode.trim() === DEFAULT_PASSCODE) {
      sessionStorage.setItem(ADMIN_SESSION_KEY, 'true');
      setIsAuthenticated(true);
      setPasscodeError(null);
      showToast('Welcome to Baby Step Admin Portal', 'success', 'check');
    } else {
      setPasscodeError('Invalid Admin Passcode. Default is admin123');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    setIsAuthenticated(false);
    setPasscode('');
    showToast('Admin session locked', 'info');
  };

  // Handlers for Products CRUD
  const handleSaveProduct = async (productData: Omit<Product, 'id' | 'createdAt'>) => {
    setIsSubmitting(true);
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, productData);
        showToast(`Updated "${productData.name}" successfully!`, 'success', 'check');
      } else {
        await createProduct(productData);
        showToast(`Published "${productData.name}" to storefront!`, 'success', 'check');
      }

      // Invalidate React Query cache so customer storefront updates instantly
      await queryClient.invalidateQueries({ queryKey: ['products'] });
      await refetch();

      setEditingProduct(null);
      setActiveTab('catalog');
    } catch (err: any) {
      showToast(err.message || 'Failed to save product', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      await deleteProduct(productId);
      showToast('Product removed from catalog', 'info', 'trash');
      await queryClient.invalidateQueries({ queryKey: ['products'] });
      await refetch();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete product', 'error');
    }
  };

  const handleStartEdit = (product: Product) => {
    setEditingProduct(product);
    setActiveTab('add_product');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelForm = () => {
    setEditingProduct(null);
    setActiveTab('catalog');
  };

  // Compute Metrics
  const totalProducts = products.length;
  const activeOffersCount = products.filter(
    (p) =>
      (p.discountPercentage && p.discountPercentage > 0) ||
      (p.originalPrice && p.originalPrice > p.price)
  ).length;
  const uniqueCategories = new Set(products.map((p) => p.category)).size;

  // PASSCODE LOCK SCREEN
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FDF0F6] via-white to-[#EDF6FD] flex flex-col justify-center items-center p-4">
        <div className="w-full max-w-md bg-white rounded-4xl p-8 border border-slate-100 shadow-soft-lg text-center animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-3xl bg-brand-blue-light text-brand-blue flex items-center justify-center mx-auto mb-4 shadow-soft-sm">
            <Shield className="w-8 h-8" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-pink/10 text-brand-pink text-xs font-bold mb-3">
            <KeyRound className="w-3.5 h-3.5" />
            <span>Authorized Personnel Only</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-navy font-display mb-2">
            Baby Step Admin
          </h1>
          <p className="text-xs text-slate-500 max-w-xs mx-auto mb-6">
            Enter your admin passphrase to manage products, pricing, and discount offers.
          </p>

          {passcodeError && (
            <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-semibold">
              {passcodeError}
            </div>
          )}

          <form onSubmit={handleUnlock} className="space-y-4">
            <div className="relative">
              <input
                type="password"
                required
                autoFocus
                placeholder="Enter Admin Passcode (admin123)"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-center text-sm font-bold tracking-widest focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue"
              />
            </div>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 bg-brand-blue hover:bg-brand-blue-soft text-white font-bold py-3.5 px-6 rounded-2xl transition-all shadow-soft hover:shadow-glow-blue active:scale-98 text-sm"
            >
              <span>Unlock Admin Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <p className="text-[11px] text-slate-400 mt-6">
            Default credentials for this environment: <strong className="text-slate-600">admin123</strong>
          </p>
        </div>
      </div>
    );
  }

  // AUTHENTICATED ADMIN DASHBOARD
  return (
    <div className="min-h-screen bg-transparent flex flex-col">
      <AdminNavbar onLogout={handleLogout} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6">
        {/* Top Header Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-brand-blue/10 via-brand-baby-blue/15 to-brand-pink/15 p-6 rounded-3xl border border-brand-baby-blue/30 shadow-soft-sm">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-brand-peach" />
              <span className="text-xs font-bold text-brand-blue uppercase tracking-wider">
                Storefront Inventory Control
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-navy font-display">
              Products, Offers & Pricing
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
              Any item added, discounted, or updated here is directly published to the live Baby Step customer website.
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center bg-white/90 backdrop-blur-xs p-1.5 rounded-2xl border border-brand-baby-blue/40 shadow-soft-sm self-start md:self-auto">
            <button
              onClick={() => {
                setEditingProduct(null);
                setActiveTab('catalog');
              }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'catalog'
                  ? 'bg-brand-blue text-white shadow-soft-sm'
                  : 'text-slate-600 hover:text-brand-navy'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>Catalog ({totalProducts})</span>
            </button>

            <button
              onClick={() => {
                setEditingProduct(null);
                setActiveTab('add_product');
              }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'add_product'
                  ? 'bg-brand-blue text-white shadow-soft-sm'
                  : 'text-slate-600 hover:text-brand-navy'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{editingProduct ? 'Edit Product' : 'Add Product'}</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-soft-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-blue-light text-brand-blue flex items-center justify-center shrink-0">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Products</p>
              <p className="text-lg sm:text-xl font-extrabold text-brand-navy">{totalProducts}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-soft-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-pink/15 text-brand-pink flex items-center justify-center shrink-0">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Offers</p>
              <p className="text-lg sm:text-xl font-extrabold text-brand-navy">{activeOffersCount}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-soft-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Categories</p>
              <p className="text-lg sm:text-xl font-extrabold text-brand-navy">{uniqueCategories}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-soft-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
              <Star className="w-5 h-5 fill-amber-400" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Store Average</p>
              <p className="text-lg sm:text-xl font-extrabold text-brand-navy">4.9 ★</p>
            </div>
          </div>
        </div>

        {/* Dynamic View: Catalog vs Add/Edit Form */}
        {activeTab === 'catalog' ? (
          <ProductTable
            products={products}
            isLoading={isLoading}
            onEdit={handleStartEdit}
            onDelete={handleDeleteProduct}
            onAddNew={() => {
              setEditingProduct(null);
              setActiveTab('add_product');
            }}
          />
        ) : (
          <ProductForm
            initialData={editingProduct}
            onSubmit={handleSaveProduct}
            onCancel={handleCancelForm}
            isSubmitting={isSubmitting}
          />
        )}
      </main>
    </div>
  );
};
