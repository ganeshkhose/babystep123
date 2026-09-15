import React, { useState, useEffect, useMemo } from 'react';
import { Product } from '../../types/product';
import { ProductFormData } from '../types';
import { PRODUCT_CATEGORIES, AGE_GROUPS } from '../../constants/categories';
import { X, Sparkles, Image as ImageIcon, Check, Star, AlertCircle, Eye } from 'lucide-react';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (formData: ProductFormData, editId?: string) => Promise<boolean>;
  initialProduct?: Product | null;
}

// Curated high-res baby product assets for fast 1-click thumbnail selection
const SAMPLE_IMAGE_PRESETS = [
  { label: 'Foaming Wash', url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80' },
  { label: 'Baby Lotion', url: 'https://images.unsplash.com/photo-1576426863848-c21f53c60b19?w=600&auto=format&fit=crop&q=80' },
  { label: 'Organic Romper', url: 'https://images.unsplash.com/photo-1522771930-78848d9293e8?w=600&auto=format&fit=crop&q=80' },
  { label: 'Soothing Teether', url: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600&auto=format&fit=crop&q=80' },
  { label: 'Swaddle Wrap', url: 'https://images.unsplash.com/photo-1544126592-807ade215a0b?w=600&auto=format&fit=crop&q=80' },
];

const CATEGORIES = PRODUCT_CATEGORIES;

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialProduct,
}) => {
  const [name, setName] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [originalPrice, setOriginalPrice] = useState<number | ''>('');
  const [category, setCategory] = useState('Baby Care');
  const [ageGroup, setAgeGroup] = useState('All Ages');
  const [imageUrl, setImageUrl] = useState('');
  const [stock, setStock] = useState<number | ''>(15);
  const [tagsInput, setTagsInput] = useState('Pediatrician Approved, Organic');
  const [isFeatured, setIsFeatured] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const isEditMode = !!initialProduct;

  useEffect(() => {
    if (initialProduct) {
      setName(initialProduct.name);
      setShortDescription(initialProduct.shortDescription || '');
      setDescription(initialProduct.description || '');
      setPrice(initialProduct.price);
      setOriginalPrice(initialProduct.originalPrice || '');
      setCategory(initialProduct.category || 'Baby Care');
      setAgeGroup(initialProduct.ageGroup || 'All Ages');
      setImageUrl(initialProduct.imageUrl || '');
      setStock(initialProduct.stock ?? 15);
      setTagsInput(initialProduct.tags?.join(', ') || 'Organic');
      setIsFeatured(initialProduct.isFeatured ?? true);
    } else {
      setName('');
      setShortDescription('');
      setDescription('');
      setPrice('');
      setOriginalPrice('');
      setCategory('Baby Care');
      setAgeGroup('All Ages');
      setImageUrl(SAMPLE_IMAGE_PRESETS[0].url);
      setStock(15);
      setTagsInput('Pediatrician Approved, Organic');
      setIsFeatured(true);
    }
    setErrorMsg(null);
  }, [initialProduct, isOpen]);

  // Compute live discount %
  const liveDiscountPercent = useMemo(() => {
    const numPrice = Number(price);
    const numMRP = Number(originalPrice);
    if (numMRP > 0 && numPrice > 0 && numMRP > numPrice) {
      return Math.round(((numMRP - numPrice) / numMRP) * 100);
    }
    return 0;
  }, [price, originalPrice]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!name.trim()) {
      setErrorMsg('Product name is required.');
      return;
    }

    if (price === '' || isNaN(Number(price)) || Number(price) <= 0) {
      setErrorMsg('Please enter a valid selling price greater than 0.');
      return;
    }

    if (!imageUrl.trim()) {
      setErrorMsg('Product image URL is required.');
      return;
    }

    setIsSubmitting(true);

    const tags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const formData: ProductFormData = {
      name: name.trim(),
      shortDescription: shortDescription.trim() || name.trim(),
      description: description.trim() || shortDescription.trim() || name.trim(),
      price: Number(price),
      originalPrice: originalPrice !== '' ? Number(originalPrice) : undefined,
      category,
      ageGroup,
      imageUrl: imageUrl.trim(),
      stock: stock !== '' ? Number(stock) : 10,
      tags: tags.length > 0 ? tags : ['Organic Care'],
      benefits: ['Dermatologically Tested', '100% Safe For Infants', 'Hypoallergenic Formulated'],
      isFeatured,
    };

    const success = await onSave(formData, initialProduct?.id);
    setIsSubmitting(false);

    if (success) {
      onClose();
    } else {
      setErrorMsg('Failed to save product. Please check console or server connection.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="relative w-full max-w-4xl bg-[#FAF8F5] border border-[#E8DFD8] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8DFD8] bg-white/70">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-brand-blue-light text-brand-blue flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-800 font-display">
                {isEditMode ? 'Edit Product Details' : 'Add New Product to Catalog'}
              </h3>
              <p className="text-xs text-slate-500">
                {isEditMode ? 'Update pricing, inventory, and storefront presentation' : 'Create a new baby essential that immediately appears on the storefront'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 hover:text-slate-600 hover:bg-slate-200 flex items-center justify-center transition-colors cursor-pointer"
            type="button"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body: Two columns (Form on Left, Live Card Preview on Right) */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Form inputs (7 cols on lg) */}
          <form onSubmit={handleSubmit} id="product-form" className="lg:col-span-7 space-y-4 text-left">
            {errorMsg && (
              <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Product Title */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Product Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Natural Oat & Shea Baby Body Butter"
                className="w-full px-3.5 py-2.5 rounded-2xl bg-white border border-[#E8DFD8] text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue"
                required
              />
            </div>

            {/* Short Tagline / Description */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Short Tagline / Subtitle
              </label>
              <input
                type="text"
                value={shortDescription}
                onChange={e => setShortDescription(e.target.value)}
                placeholder="e.g. Ultra-rich barrier moisture for delicate newborn skin"
                className="w-full px-3.5 py-2.5 rounded-2xl bg-white border border-[#E8DFD8] text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue"
              />
            </div>

            {/* Category & Age Group Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Category <span className="text-rose-500">*</span>
                </label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-white border border-[#E8DFD8] text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Age Recommendation
                </label>
                <select
                  value={ageGroup}
                  onChange={e => setAgeGroup(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-white border border-[#E8DFD8] text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue"
                >
                  {AGE_GROUPS.map(ag => (
                    <option key={ag} value={ag}>{ag}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Pricing & Stock Row */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Selling Price (₹) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={price}
                  onChange={e => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="599"
                  className="w-full px-3 py-2.5 rounded-2xl bg-white border border-[#E8DFD8] text-xs sm:text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  MRP / Original (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={originalPrice}
                  onChange={e => setOriginalPrice(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="799"
                  className="w-full px-3 py-2.5 rounded-2xl bg-white border border-[#E8DFD8] text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Stock Units
                </label>
                <input
                  type="number"
                  min="0"
                  value={stock}
                  onChange={e => setStock(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="20"
                  className="w-full px-3 py-2.5 rounded-2xl bg-white border border-[#E8DFD8] text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue"
                />
              </div>
            </div>

            {/* Discount Indicator notice if computed */}
            {liveDiscountPercent > 0 && (
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                <Check className="w-3.5 h-3.5" />
                <span>Auto-computed Customer Discount: <strong>{liveDiscountPercent}% OFF</strong></span>
              </div>
            )}

            {/* Image URL & Quick Presets */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Image CDN URL <span className="text-rose-500">*</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={imageUrl}
                  onChange={e => setImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-white border border-[#E8DFD8] text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue"
                  required
                />
              </div>
              {/* Image presets */}
              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] text-slate-400 font-medium">Quick Pick Sample:</span>
                {SAMPLE_IMAGE_PRESETS.map(preset => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => setImageUrl(preset.url)}
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-lg bg-white border border-[#E8DFD8] text-slate-600 hover:text-brand-blue hover:border-brand-blue cursor-pointer transition-colors"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tags (comma separated) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Product Badges / Tags (comma separated)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={e => setTagsInput(e.target.value)}
                placeholder="Organic, Pediatrician Approved, Newborn Safe"
                className="w-full px-3.5 py-2.5 rounded-2xl bg-white border border-[#E8DFD8] text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue"
              />
            </div>
          </form>

          {/* Right Column: Live Storefront Card Preview (5 cols on lg) */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center p-4 bg-white/60 border border-[#E8DFD8] rounded-3xl">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
              <Eye className="w-3.5 h-3.5 text-brand-blue" />
              <span>Live Customer Card Preview</span>
            </div>

            {/* Mocked Storefront Card */}
            <div className="w-full max-w-[280px] bg-white rounded-3xl border border-[#EDE1EA] shadow-soft-sm overflow-hidden p-3 transition-all">
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-50 mb-3">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={name || 'Preview'}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = SAMPLE_IMAGE_PRESETS[0].url;
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
                    <ImageIcon className="w-10 h-10 mb-1" />
                    <span className="text-[11px]">No Image Loaded</span>
                  </div>
                )}

                {/* Discount Badge */}
                {liveDiscountPercent > 0 && (
                  <div className="absolute top-2 left-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-xs">
                    {liveDiscountPercent}% OFF
                  </div>
                )}

                {/* Category badge */}
                <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-xs text-brand-navy text-[10px] font-bold px-2 py-0.5 rounded-full border border-white/40">
                  {category}
                </div>
              </div>

              {/* Title & info */}
              <div className="space-y-1 text-left">
                <div className="flex items-center gap-1 text-amber-400 text-[11px]">
                  <Star className="w-3 h-3 fill-current" />
                  <span className="font-bold text-slate-700">4.9</span>
                  <span className="text-slate-400">(18)</span>
                </div>
                <h4 className="font-bold text-brand-navy text-sm line-clamp-1">
                  {name.trim() || 'Your Product Title'}
                </h4>
                <p className="text-[11px] text-slate-500 line-clamp-1">
                  {shortDescription.trim() || 'Gentle soothing formula for infant care'}
                </p>

                {/* Price */}
                <div className="pt-2 flex items-baseline gap-2 border-t border-slate-100">
                  <span className="text-base font-extrabold text-brand-navy">
                    ₹{price !== '' ? Number(price).toLocaleString('en-IN') : '599'}
                  </span>
                  {originalPrice !== '' && Number(originalPrice) > Number(price || 0) && (
                    <span className="text-xs text-slate-400 line-through">
                      ₹{Number(originalPrice).toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 text-center mt-3">
              This preview matches the exact customer card rendered on the homepage.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-[#E8DFD8] bg-white/70 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            type="button"
            className="px-4 py-2 rounded-2xl text-xs font-semibold text-slate-600 hover:bg-slate-100 border border-[#E8DFD8] transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="product-form"
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-2xl text-xs font-bold text-white bg-gradient-to-r from-brand-blue to-brand-blue-soft border-2 border-brand-blue shadow-soft hover:shadow-md transition-all duration-150 disabled:opacity-50 cursor-pointer flex items-center gap-2"
          >
            {isSubmitting ? (
              <span>Saving Changes...</span>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>{isEditMode ? 'Update Product' : 'Publish Product to Store'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
