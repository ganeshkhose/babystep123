import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Edit3, Trash2, ExternalLink, Plus, Package, Tag, CheckCircle2 } from 'lucide-react';
import { Product } from '../../types/product';

interface ProductTableProps {
  products: Product[];
  isLoading: boolean;
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => Promise<void>;
  onAddNew: () => void;
}

const CATEGORIES = ['All', 'Baby Care', 'Bath & Body', 'Mom & Baby'];

export const ProductTable: React.FC<ProductTableProps> = ({
  products,
  isLoading,
  onEdit,
  onDelete,
  onAddNew,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredProducts = products.filter((p) => {
    const matchesCat =
      selectedCategory === 'All' ||
      p.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      !search.trim() ||
      p.name.toLowerCase().includes(search.toLowerCase().trim()) ||
      p.category.toLowerCase().includes(search.toLowerCase().trim());
    return matchesCat && matchesSearch;
  });

  const handleDelete = async (product: Product) => {
    if (window.confirm(`Are you sure you want to delete "${product.name}" from the store catalog?`)) {
      setDeletingId(product.id);
      try {
        await onDelete(product.id);
      } finally {
        setDeletingId(null);
      }
    }
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-8 border border-slate-100 shadow-soft space-y-6">
      {/* Header with Search & Add New button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-brand-blue" />
            <h2 className="text-lg sm:text-xl font-extrabold text-brand-navy font-display">
              Store Catalog Management
            </h2>
            <span className="text-xs font-bold bg-brand-blue-light text-brand-blue px-2.5 py-0.5 rounded-full">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'items'}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage your store's live inventory, update discount offers, or remove products anytime.
          </p>
        </div>

        <button
          onClick={onAddNew}
          className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-brand-blue to-brand-blue-soft text-white text-xs sm:text-sm font-bold py-2.5 px-6 rounded-full transition-all border-2 border-brand-blue shadow-[0_4px_14px_rgba(22,137,216,0.35)] ring-2 ring-brand-baby-blue/50 hover:shadow-[0_0_18px_rgba(22,137,216,0.55),0_4px_16px_rgba(22,137,216,0.35)] hover:border-white hover:ring-2 hover:ring-brand-blue/80 hover:brightness-105 hover:scale-105 active:scale-98 self-start sm:self-auto shrink-0 focus:outline-none focus:ring-2 focus:ring-brand-baby-blue/80"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by title or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border-2 border-slate-200/80 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-baby-blue/50 transition-all"
          />
        </div>

        {/* Category Pills with reflected border */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap border-2 focus:outline-none ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-brand-blue to-brand-blue-soft text-white border-brand-blue shadow-[0_2px_8px_rgba(22,137,216,0.3)] ring-2 ring-brand-baby-blue/50 scale-[1.02]'
                  : 'bg-slate-100/90 text-slate-700 border-slate-200/70 hover:bg-white hover:text-brand-blue hover:border-brand-blue hover:ring-2 hover:ring-brand-baby-blue/50 hover:shadow-[0_0_12px_rgba(22,137,216,0.25)] hover:scale-105 focus:border-brand-blue focus:ring-2 focus:ring-brand-baby-blue/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Table */}
      {isLoading ? (
        <div className="py-16 text-center text-slate-400 text-sm">
          Loading catalog products...
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="py-16 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 p-6">
          <Package className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-bold text-slate-600">No products match your criteria</p>
          <p className="text-xs text-slate-400 mt-1">Try changing your search term or add a new product.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <th className="pb-3 pl-2">Product</th>
                <th className="pb-3">Category</th>
                <th className="pb-3">Price & Offers</th>
                <th className="pb-3">Stock</th>
                <th className="pb-3 text-right pr-2">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.map((product) => {
                const discount =
                  product.discountPercentage && product.discountPercentage > 0
                    ? product.discountPercentage
                    : product.originalPrice && product.originalPrice > product.price
                    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                    : null;

                return (
                  <tr key={product.id} className="hover:bg-slate-50/80 transition-colors group">
                    {/* Product thumbnail & Name */}
                    <td className="py-3.5 pl-2">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-12 h-12 rounded-xl object-cover bg-slate-100 border border-slate-200/80 shrink-0"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/products/baby-wipes.jpg';
                          }}
                        />
                        <div className="min-w-0 max-w-xs sm:max-w-sm">
                          <p className="font-bold text-brand-navy truncate text-xs sm:text-sm">
                            {product.name}
                          </p>
                          <p className="text-[11px] text-slate-400 truncate mt-0.5">
                            {product.shortDescription}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5">
                      <span className="inline-block px-2.5 py-1 rounded-full text-[11px] font-bold bg-brand-blue-light text-brand-blue border border-brand-baby-blue/30 whitespace-nowrap">
                        {product.category}
                      </span>
                    </td>

                    {/* Price & Discount */}
                    <td className="py-3.5 whitespace-nowrap">
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-extrabold text-brand-navy text-sm sm:text-base">
                          ₹{product.price}
                        </span>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <span className="text-[11px] text-slate-400 line-through">
                            ₹{product.originalPrice}
                          </span>
                        )}
                      </div>
                      {discount && discount > 0 ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-brand-pink bg-brand-pink/10 px-2 py-0.5 rounded-full mt-0.5">
                          <Tag className="w-2.5 h-2.5" />
                          <span>{discount}% OFF</span>
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400">Regular Price</span>
                      )}
                    </td>

                    {/* Stock Status */}
                    <td className="py-3.5 whitespace-nowrap">
                      {product.stock > 0 ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                          <span>{product.stock} in stock</span>
                        </span>
                      ) : (
                        <span className="text-[11px] font-bold text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full">
                          Out of stock
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 text-right pr-2 whitespace-nowrap">
                      <div className="inline-flex items-center gap-1">
                        {/* View in Store */}
                        <Link
                          to={`/products/${product.id}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 text-slate-400 hover:text-brand-blue rounded-xl hover:bg-white transition-colors"
                          title="View on Customer Storefront"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>

                        {/* Edit button */}
                        <button
                          onClick={() => onEdit(product)}
                          className="p-2 text-slate-600 hover:text-brand-blue rounded-xl hover:bg-brand-blue-light transition-colors"
                          title="Edit Product"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        {/* Delete button */}
                        <button
                          onClick={() => handleDelete(product)}
                          disabled={deletingId === product.id}
                          className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-colors disabled:opacity-50"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
