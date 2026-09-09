import React, { useState, useEffect } from 'react';
import { Sparkles, Image, Check, AlertCircle } from 'lucide-react';
import { Product } from '../../types/product';
import { LiveCardPreview } from './LiveCardPreview';
import { Dropdown } from '../../components/Dropdown';

interface ProductFormProps {
  initialData?: Product | null;
  onSubmit: (productData: Omit<Product, 'id' | 'createdAt'>) => Promise<void>;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

const CATEGORY_OPTIONS = ['Baby Care', 'Bath & Body', 'Mom & Baby'];
const AGE_OPTIONS = ['All Ages', '0-6 months', '6-12 months', '1-2 years', '2+ years'];

const IMAGE_PRESETS = [
  { label: 'Aloe Wipes', url: '/products/baby-wipes.jpg' },
  { label: 'Tummy Roll-on', url: '/products/tummy-roll-on.jpg' },
  { label: 'Laundry Detergent', url: '/products/baby-laundry.jpg' },
  { label: 'Diaper Pants', url: '/products/baby-diapers.jpg' },
  { label: 'Bedtime Balm', url: '/products/baby-balm.jpg' },
  { label: 'Wash & Shampoo', url: '/products/baby-wash-shampoo.jpg' },
  { label: 'Body Lotion', url: '/products/baby-body-lotion.jpg' },
  { label: 'Bottle Cleaner', url: '/products/bottle-cleaner.jpg' },
];

export const ProductForm: React.FC<ProductFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
}) => {
  const [name, setName] = useState(initialData?.name || '');
  const [category, setCategory] = useState(initialData?.category || 'Baby Care');
  const [ageGroup, setAgeGroup] = useState(initialData?.ageGroup || 'All Ages');
  const [price, setPrice] = useState<number | string>(initialData?.price ?? 299);
  const [originalPrice, setOriginalPrice] = useState<number | string>(initialData?.originalPrice ?? 399);
  const [discountPercentage, setDiscountPercentage] = useState<number | string>(initialData?.discountPercentage ?? 25);
  const [stock, setStock] = useState<number | string>(initialData?.stock ?? 45);
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || '/products/baby-wipes.jpg');
  const [shortDescription, setShortDescription] = useState(
    initialData?.shortDescription || 'Gentle organic baby formula dermatologically tested for soft newborn skin.'
  );
  const [description, setDescription] = useState(
    initialData?.description ||
      'Crafted with utmost love and pure botanical ingredients. Provides all-day soothing care and protection without harsh chemicals or artificial fragrance.'
  );
  const [isFeatured, setIsFeatured] = useState(initialData?.isFeatured ?? false);

  // Dynamic Benefit items
  const [benefits, setBenefits] = useState<string[]>(
    initialData?.benefits || ['100% Pediatrician Approved', 'Hypoallergenic & Gentle', 'No Artificial Fragrance']
  );
  const [newBenefit, setNewBenefit] = useState('');

  // Dynamic Specs/Ingredients
  const [ingredientsOrSpecs, setIngredientsOrSpecs] = useState<string[]>(
    initialData?.ingredientsOrSpecs || ['Organic Aloe Vera', 'Pure Spring Water', 'Chamomile Extract']
  );
  const [newIngredient, setNewIngredient] = useState('');

  const [formError, setFormError] = useState<string | null>(null);

  // Sync state if initialData changes
  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setCategory(initialData.category);
      setAgeGroup(initialData.ageGroup);
      setPrice(initialData.price);
      setOriginalPrice(initialData.originalPrice ?? '');
      setDiscountPercentage(initialData.discountPercentage ?? '');
      setStock(initialData.stock);
      setImageUrl(initialData.imageUrl);
      setShortDescription(initialData.shortDescription);
      setDescription(initialData.description);
      setIsFeatured(initialData.isFeatured ?? false);
      setBenefits(initialData.benefits || []);
      setIngredientsOrSpecs(initialData.ingredientsOrSpecs || []);
    }
  }, [initialData]);

  // Automatically compute discount percentage when price or originalPrice changes
  const handlePriceChange = (val: string) => {
    const p = parseFloat(val);
    setPrice(val);
    const orig = parseFloat(String(originalPrice));
    if (!isNaN(p) && !isNaN(orig) && orig > p) {
      setDiscountPercentage(Math.round(((orig - p) / orig) * 100));
    }
  };

  const handleOriginalPriceChange = (val: string) => {
    const orig = parseFloat(val);
    setOriginalPrice(val);
    const p = parseFloat(String(price));
    if (!isNaN(p) && !isNaN(orig) && orig > p) {
      setDiscountPercentage(Math.round(((orig - p) / orig) * 100));
    }
  };

  const handleAddBenefit = () => {
    if (newBenefit.trim() && !benefits.includes(newBenefit.trim())) {
      setBenefits([...benefits, newBenefit.trim()]);
      setNewBenefit('');
    }
  };

  const handleRemoveBenefit = (idx: number) => {
    setBenefits(benefits.filter((_, i) => i !== idx));
  };

  const handleAddIngredient = () => {
    if (newIngredient.trim() && !ingredientsOrSpecs.includes(newIngredient.trim())) {
      setIngredientsOrSpecs([...ingredientsOrSpecs, newIngredient.trim()]);
      setNewIngredient('');
    }
  };

  const handleRemoveIngredient = (idx: number) => {
    setIngredientsOrSpecs(ingredientsOrSpecs.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const numPrice = parseFloat(String(price));
    const numOriginal = originalPrice ? parseFloat(String(originalPrice)) : undefined;
    const numDiscount = discountPercentage ? parseFloat(String(discountPercentage)) : undefined;
    const numStock = parseInt(String(stock), 10) || 0;

    if (!name.trim()) {
      setFormError('Product Name is required.');
      return;
    }
    if (isNaN(numPrice) || numPrice <= 0) {
      setFormError('Please enter a valid positive Selling Price.');
      return;
    }

    const payload: Omit<Product, 'id' | 'createdAt'> = {
      name: name.trim(),
      category,
      ageGroup,
      price: numPrice,
      originalPrice: numOriginal && numOriginal > 0 ? numOriginal : undefined,
      discountPercentage: numDiscount && numDiscount > 0 ? numDiscount : undefined,
      stock: numStock,
      imageUrl: imageUrl.trim() || '/products/baby-wipes.jpg',
      shortDescription: shortDescription.trim(),
      description: description.trim(),
      benefits: benefits.length > 0 ? benefits : ['Safe & Gentle', 'Pediatrician Approved'],
      ingredientsOrSpecs: ingredientsOrSpecs.length > 0 ? ingredientsOrSpecs : ['Pure Plant Extracts'],
      rating: initialData?.rating || 4.9,
      reviewCount: initialData?.reviewCount || 150,
      tags: [category.toLowerCase(), 'baby', 'essential'],
      isFeatured,
    };

    try {
      await onSubmit(payload);
    } catch (err: any) {
      setFormError(err.message || 'Failed to save product. Please try again.');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left Column: Form Fields (7-8 cols) */}
      <form
        onSubmit={handleSubmit}
        className="lg:col-span-7 xl:col-span-8 bg-white rounded-3xl p-5 sm:p-8 border border-slate-100 shadow-soft space-y-6"
      >
        <div className="border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-blue" />
            <h2 className="text-lg sm:text-xl font-extrabold text-brand-navy font-display">
              {initialData ? 'Edit Product & Offers' : 'Add New Product & Offers'}
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Fill in the details below. As soon as you publish, this product and its offer will be live on the storefront.
          </p>
        </div>

        {formError && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        {/* Section 1: Basic Details */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            1. Basic Information
          </h3>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Product Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Pure Aloe Vera Gentle Baby Wipes"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue font-semibold text-brand-navy"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Dropdown
                id="admin-category-select"
                label="Store Category *"
                options={CATEGORY_OPTIONS}
                value={category}
                onChange={(val) => setCategory(String(val))}
              />
            </div>
            <div>
              <Dropdown
                id="admin-age-select"
                label="Target Age Group"
                options={AGE_OPTIONS}
                value={ageGroup}
                onChange={(val) => setAgeGroup(String(val))}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Short Summary / Highlight *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. 99% pure water & organic aloe vera wipes with moisture-lock lid"
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Shown directly on the product card in the catalog.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Full Description
            </label>
            <textarea
              rows={3}
              placeholder="Comprehensive details, usage tips, and parent benefits..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue"
            />
          </div>
        </div>

        {/* Section 2: Pricing, Discount & Offers */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              2. Pricing, Discount & Offer Badges
            </h3>
            <span className="text-[10px] font-bold text-brand-pink bg-brand-pink/10 px-2 py-0.5 rounded-full">
              Live Discount Tag
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Selling Price (₹) *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-slate-400 font-bold text-sm">₹</span>
                <input
                  type="number"
                  required
                  min="1"
                  step="1"
                  value={price}
                  onChange={(e) => handlePriceChange(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-4 py-2.5 text-sm font-extrabold text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Original MRP (₹)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-slate-400 font-bold text-sm">₹</span>
                <input
                  type="number"
                  min="1"
                  step="1"
                  placeholder="e.g. 399"
                  value={originalPrice}
                  onChange={(e) => handleOriginalPriceChange(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue"
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Strikethrough reference price</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Discount Badge (% OFF)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="99"
                  placeholder="e.g. 25"
                  value={discountPercentage}
                  onChange={(e) => setDiscountPercentage(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-brand-pink focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue"
                />
                <span className="absolute right-3.5 top-2.5 text-xs font-bold text-brand-pink">% OFF</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Auto-calculated or custom</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Available Stock Count
              </label>
              <input
                type="number"
                min="0"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue"
              />
            </div>

            <div className="flex items-center pt-6">
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-4 h-4 text-brand-blue rounded border-slate-300 focus:ring-brand-blue"
                />
                <span className="text-xs font-bold text-slate-700">
                  Feature on Homepage Hero & Top Results
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Section 3: Media & Image Selection */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            3. Product Image
          </h3>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Image URL / Path *
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Image className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                <input
                  type="text"
                  required
                  placeholder="/products/baby-wipes.jpg or https://..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue"
                />
              </div>
            </div>
          </div>

          {/* Quick Image Presets */}
          <div>
            <span className="text-[11px] font-bold text-slate-500 block mb-2">
              Quick Pick from Sample Product Library:
            </span>
            <div className="flex flex-wrap gap-2">
              {IMAGE_PRESETS.map((preset) => (
                <button
                  key={preset.url}
                  type="button"
                  onClick={() => setImageUrl(preset.url)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all flex items-center gap-1.5 ${
                    imageUrl === preset.url
                      ? 'bg-brand-blue text-white border-brand-blue shadow-xs font-bold'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-brand-blue/40'
                  }`}
                >
                  <span>{preset.label}</span>
                  {imageUrl === preset.url && <Check className="w-3 h-3" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Section 4: Benefits & Pure Ingredients */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            4. Key Benefits & Pure Ingredients
          </h3>

          {/* Key Benefits */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Key Benefits (for Product Page)
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="e.g. 100% Pediatrician Approved"
                value={newBenefit}
                onChange={(e) => setNewBenefit(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddBenefit();
                  }
                }}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
              />
              <button
                type="button"
                onClick={handleAddBenefit}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors shrink-0"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {benefits.map((b, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold"
                >
                  <span>{b}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveBenefit(i)}
                    className="hover:text-rose-600 ml-1"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Pure Ingredients */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Pure Ingredients & Specs
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="e.g. Organic Aloe Vera"
                value={newIngredient}
                onChange={(e) => setNewIngredient(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddIngredient();
                  }
                }}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
              />
              <button
                type="button"
                onClick={handleAddIngredient}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors shrink-0"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {ingredientsOrSpecs.map((spec, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-medium"
                >
                  <span>{spec}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveIngredient(i)}
                    className="hover:text-rose-600 ml-1"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-end gap-3">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="w-full sm:w-auto px-6 py-2.5 rounded-full text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors border-2 border-transparent hover:border-slate-200"
            >
              Cancel
            </button>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-brand-blue to-brand-blue-soft text-white font-bold py-3 px-8 rounded-full transition-all duration-200 border-2 border-brand-blue shadow-[0_4px_14px_rgba(22,137,216,0.35)] ring-2 ring-brand-baby-blue/50 hover:shadow-[0_0_18px_rgba(22,137,216,0.55),0_4px_16px_rgba(22,137,216,0.35)] hover:border-white hover:ring-2 hover:ring-brand-blue/80 hover:brightness-105 hover:scale-105 active:scale-98 text-sm min-h-[44px] disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-brand-baby-blue/80"
          >
            <Sparkles className="w-4 h-4" />
            <span>
              {isSubmitting
                ? 'Publishing Product...'
                : initialData
                ? 'Save & Update Product'
                : 'Publish Product to Store'}
            </span>
          </button>
        </div>
      </form>

      {/* Right Column: Live Card Preview (4-5 cols) */}
      <div className="lg:col-span-5 xl:col-span-4 sticky top-24">
        <LiveCardPreview
          name={name}
          category={category}
          price={parseFloat(String(price)) || 0}
          originalPrice={originalPrice ? parseFloat(String(originalPrice)) : undefined}
          discountPercentage={discountPercentage ? parseFloat(String(discountPercentage)) : undefined}
          imageUrl={imageUrl}
          shortDescription={shortDescription}
          ageGroup={ageGroup}
        />
      </div>
    </div>
  );
};
