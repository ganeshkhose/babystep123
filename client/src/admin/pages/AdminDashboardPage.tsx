import React, { useState, useEffect, useMemo } from 'react';
import { AdminHeader } from '../components/AdminHeader';
import { ProductFormModal } from '../components/ProductFormModal';
import { adminProductService } from '../services/adminProductService';
import { Product } from '../../types/product';
import { ProductFormData } from '../types';
import { SAMPLE_PRODUCTS } from '../../data/sampleProducts';
import {
  Package,
  Plus,
  Search,
  Edit2,
  Trash2,
  Layers,
  Sparkles,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Delete confirmation
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const loadProducts = async () => {
    setIsLoading(true);
    const remote = await adminProductService.fetchAllProducts();
    if (remote && remote.length > 0) {
      setProducts(remote);
    } else {
      // Fall back to sample products if fresh DB
      setProducts(SAMPLE_PRODUCTS);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // Filter products by search and category
  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (selectedCategory !== 'All') {
      const catLower = selectedCategory.toLowerCase().trim();
      list = list.filter(p => p.category.toLowerCase() === catLower);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        p =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.shortDescription && p.shortDescription.toLowerCase().includes(q))
      );
    }

    return list;
  }, [products, selectedCategory, searchQuery]);

  // Catalog Metrics
  const metrics = useMemo(() => {
    const totalCount = products.length;
    const totalStock = products.reduce((sum, p) => sum + (p.stock || 0), 0);
    const categoriesSet = new Set(products.map(p => p.category));
    const lowStockCount = products.filter(p => (p.stock || 0) < 5).length;

    return {
      totalCount,
      totalStock,
      categoriesCount: categoriesSet.size,
      lowStockCount,
    };
  }, [products]);

  // Handle Save (Create or Update)
  const handleSaveProduct = async (formData: ProductFormData, editId?: string): Promise<boolean> => {
    if (editId) {
      const res = await adminProductService.updateProduct(editId, formData);
      if (res.success && res.data) {
        setProducts(prev => prev.map(p => (p.id === editId ? res.data! : p)));
        showToast(`Product '${res.data.name}' updated successfully!`);
        return true;
      }
    } else {
      const res = await adminProductService.createProduct(formData);
      if (res.success && res.data) {
        setProducts(prev => [res.data!, ...prev]);
        showToast(`Product '${res.data.name}' published to catalog!`);
        return true;
      }
    }
    return false;
  };

  // Handle Delete
  const confirmDelete = async () => {
    if (!deletingProduct) return;
    setIsDeleting(true);

    const res = await adminProductService.deleteProduct(deletingProduct.id);
    setIsDeleting(false);

    if (res.success) {
      setProducts(prev => prev.filter(p => p.id !== deletingProduct.id));
      showToast(`Product '${deletingProduct.name}' removed from store.`);
      setDeletingProduct(null);
    } else {
      showToast('Could not delete product.', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-slate-800 flex flex-col">
      <AdminHeader />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl text-xs font-bold transition-all animate-bounce ${
            toastMessage.type === 'success'
              ? 'bg-emerald-600 text-white border border-emerald-500'
              : 'bg-rose-600 text-white border border-rose-500'
          }`}
        >
          {toastMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4" />
          ) : (
            <AlertTriangle className="w-4 h-4" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Main Dashboard Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Top Title & CTA Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-brand-blue-light/70 text-brand-blue text-[11px] font-bold uppercase tracking-wider mb-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Catalog Control Center</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-navy font-display">
              Store Products & Inventory
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Add new baby products, adjust pricing and MRPs, and manage stock levels in real-time.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={loadProducts}
              type="button"
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-white border border-[#E8DFD8] text-xs font-bold text-slate-700 hover:text-brand-blue hover:border-brand-blue/30 shadow-2xs hover:shadow-xs transition-all cursor-pointer"
              title="Refresh products list"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span className="hidden min-[480px]:inline">Refresh</span>
            </button>

            <button
              onClick={() => {
                setEditingProduct(null);
                setIsFormOpen(true);
              }}
              type="button"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-brand-blue to-brand-blue-soft border-2 border-brand-blue shadow-[0_4px_14px_rgba(22,137,216,0.3)] hover:shadow-[0_0_16px_rgba(22,137,216,0.5)] hover:scale-102 active:scale-98 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </button>
          </div>
        </div>

        {/* 4 Metric Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#EDE1EA] shadow-2xs flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-brand-blue-light text-brand-blue flex items-center justify-center shrink-0">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Products</span>
              <p className="text-xl sm:text-2xl font-extrabold text-brand-navy font-display">{metrics.totalCount}</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#EDE1EA] shadow-2xs flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Stock Units</span>
              <p className="text-xl sm:text-2xl font-extrabold text-brand-navy font-display">{metrics.totalStock}</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#EDE1EA] shadow-2xs flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Categories</span>
              <p className="text-xl sm:text-2xl font-extrabold text-brand-navy font-display">{metrics.categoriesCount}</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#EDE1EA] shadow-2xs flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Low Stock (&lt;5)</span>
              <p className="text-xl sm:text-2xl font-extrabold text-amber-600 font-display">{metrics.lowStockCount}</p>
            </div>
          </div>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="bg-white rounded-3xl p-3 sm:p-4 border border-[#EDE1EA] shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative w-full sm:w-80">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search products by title or tag..."
              className="w-full pl-9 pr-3.5 py-2 rounded-2xl bg-slate-50 border border-[#E8DFD8] text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {['All', 'Baby Care', 'Bath & Body', 'Mom & Baby'].map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs font-bold px-3 py-1.5 rounded-full transition-all cursor-pointer shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-brand-blue text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Products Data Table */}
        <div className="bg-white rounded-3xl border border-[#EDE1EA] shadow-2xs overflow-hidden">
          {isLoading ? (
            <div className="py-20 text-center flex flex-col items-center justify-center text-slate-400">
              <RefreshCw className="w-8 h-8 animate-spin text-brand-blue mb-2" />
              <p className="text-xs font-semibold">Loading product catalog...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="py-16 text-center flex flex-col items-center justify-center p-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-pink-light text-brand-pink flex items-center justify-center mb-3">
                <Package className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800 font-display">No products found</h3>
              <p className="text-xs text-slate-500 max-w-xs mt-1">
                No items match your search or filter. Try a different term or create a new product.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF8F5] text-slate-500 font-bold uppercase tracking-wider border-b border-[#EDE1EA] text-[11px]">
                  <tr>
                    <th className="py-3.5 px-4 sm:px-6">Product</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Price & MRP</th>
                    <th className="py-3.5 px-4">Discount</th>
                    <th className="py-3.5 px-4">Stock</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EDE1EA]">
                  {filteredProducts.map(product => (
                    <tr key={product.id} className="hover:bg-[#FAF8F5]/60 transition-colors">
                      {/* Product Thumbnail & Details */}
                      <td className="py-3 px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-11 h-11 rounded-2xl object-cover border border-[#E8DFD8] shrink-0 bg-slate-50"
                            onError={e => {
                              (e.target as HTMLImageElement).src =
                                'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80';
                            }}
                          />
                          <div className="min-w-0 max-w-xs sm:max-w-md">
                            <span className="font-bold text-slate-800 text-xs sm:text-sm block truncate">
                              {product.name}
                            </span>
                            <span className="text-[11px] text-slate-400 block truncate">
                              {product.shortDescription || product.category}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                          {product.category}
                        </span>
                      </td>

                      {/* Price & MRP */}
                      <td className="py-3 px-4">
                        <div className="flex flex-col">
                          <span className="font-extrabold text-brand-navy text-xs sm:text-sm">
                            ₹{product.price.toLocaleString('en-IN')}
                          </span>
                          {product.originalPrice && product.originalPrice > product.price && (
                            <span className="text-[11px] text-slate-400 line-through">
                              ₹{product.originalPrice.toLocaleString('en-IN')}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Discount Badge */}
                      <td className="py-3 px-4">
                        {product.discountPercentage && product.discountPercentage > 0 ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                            <TrendingDown className="w-3 h-3" />
                            <span>{product.discountPercentage}% OFF</span>
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[11px]">—</span>
                        )}
                      </td>

                      {/* Stock Level */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              (product.stock || 0) === 0
                                ? 'bg-rose-500'
                                : (product.stock || 0) < 5
                                ? 'bg-amber-500'
                                : 'bg-emerald-500'
                            }`}
                          />
                          <span className="font-semibold text-slate-700">
                            {(product.stock || 0) === 0 ? 'Out of Stock' : `${product.stock} units`}
                          </span>
                        </div>
                      </td>

                      {/* Action buttons */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Edit Button */}
                          <button
                            type="button"
                            onClick={() => {
                              setEditingProduct(product);
                              setIsFormOpen(true);
                            }}
                            className="p-1.5 rounded-xl text-slate-600 hover:text-brand-blue hover:bg-brand-blue-light/50 transition-colors cursor-pointer"
                            title="Edit product"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          {/* Delete Button */}
                          <button
                            type="button"
                            onClick={() => setDeletingProduct(product)}
                            className="p-1.5 rounded-xl text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Delete product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Add / Edit Product Modal */}
      <ProductFormModal
        isOpen={isFormOpen}
        initialProduct={editingProduct}
        onClose={() => {
          setIsFormOpen(false);
          setEditingProduct(null);
        }}
        onSave={handleSaveProduct}
      />

      {/* Delete Confirmation Modal */}
      {deletingProduct && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl border border-[#EDE1EA] shadow-2xl p-6 max-w-sm w-full text-left">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-3">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 font-display">
              Delete Product?
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Are you sure you want to permanently remove <strong>"{deletingProduct.name}"</strong> from your store? This action cannot be undone.
            </p>
            <div className="mt-5 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setDeletingProduct(null)}
                disabled={isDeleting}
                className="px-4 py-2 rounded-2xl text-xs font-semibold text-slate-600 hover:bg-slate-100 border border-[#E8DFD8] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={isDeleting}
                className="px-4 py-2 rounded-2xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 transition-colors cursor-pointer flex items-center gap-1.5"
              >
                {isDeleting ? 'Deleting...' : 'Delete Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
