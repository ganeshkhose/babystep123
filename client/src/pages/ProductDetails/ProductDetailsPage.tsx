import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Star,
  ShoppingBag,
  Zap,
  ArrowLeft,
  Plus,
  Minus,
  CheckCircle2,
  ShieldCheck,
  Heart,
  Truck,
  Sparkles,
  Package,
} from 'lucide-react';
import { fetchProductById } from '../../services/productService';
import { useAppDispatch } from '../../app/hooks';
import { addToBag } from '../../features/basket/basketSlice';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';

export const ProductDetailsPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { showToast } = useToast();
  const { user, openAuthModal } = useAuth();

  const [quantity, setQuantity] = useState<number>(1);
  const [isFavorite, setIsFavorite] = useState(false);

  const {
    data: product,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => fetchProductById(productId || ''),
    enabled: Boolean(productId),
  });

  if (isLoading) {
    return (
      <div className="max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1536px] 3xl:max-w-[1680px] 4k:max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="aspect-square bg-slate-100 rounded-3xl animate-shimmer" />
          <div className="space-y-4">
            <div className="h-6 w-32 bg-slate-100 rounded-lg" />
            <div className="h-10 w-3/4 bg-slate-100 rounded-xl" />
            <div className="h-8 w-28 bg-slate-100 rounded-lg" />
            <div className="h-24 w-full bg-slate-100 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-2 font-display">
          Product not found
        </h2>
        <p className="text-sm text-slate-500 mb-6">
          We couldn't locate this baby essential. It may have been relocated or renamed.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-brand-blue text-white font-bold px-6 py-3 rounded-full hover:bg-brand-blue-soft transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Products</span>
        </Link>
      </div>
    );
  }

  const handleAddToBag = () => {
    dispatch(addToBag({ product, quantity }));
    showToast(`Added ${quantity}x ${product.name} to your bag`, 'success', 'bag');
  };

  const handleBuyNow = () => {
    dispatch(addToBag({ product, quantity }));
    if (user?.isGuest) {
      openAuthModal(() => navigate('/checkout'));
    } else {
      showToast(`Proceeding to checkout with ${product.name}`, 'info', 'bag');
      navigate('/checkout');
    }
  };

  return (
    <div className="max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1536px] 3xl:max-w-[1680px] 4k:max-w-[1920px] mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-10">
      {/* Breadcrumb Navigation with horizontal scroll on small screens */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-6 overflow-x-auto whitespace-nowrap no-scrollbar py-1">
        <Link to="/" className="hover:text-brand-blue transition-colors shrink-0">
          Products
        </Link>
        <span>/</span>
        <span className="text-slate-600 shrink-0">{product.category}</span>
        <span>/</span>
        <span className="text-brand-blue truncate max-w-[180px] sm:max-w-xs">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10 lg:gap-14 items-start">
        {/* Left Column: Product Image Display */}
        <div className="relative bg-white rounded-3xl sm:rounded-4xl p-4 sm:p-8 border border-slate-100 shadow-soft">
          <div className="relative aspect-square w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-50">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover object-center"
            />
            {product.discountPercentage && product.discountPercentage > 0 && (
              <span className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-brand-pink text-white text-xs font-bold px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full shadow-sm tracking-wide">
                {product.discountPercentage}% OFF
              </span>
            )}
            <button
              onClick={() => {
                setIsFavorite(!isFavorite);
                showToast(
                  !isFavorite ? 'Saved to wishlist' : 'Removed from wishlist',
                  'info',
                  'heart'
                );
              }}
              aria-label={isFavorite ? 'Remove from wishlist' : 'Add to wishlist'}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 w-10 h-10 rounded-full bg-white/95 backdrop-blur-sm shadow-sm flex items-center justify-center text-slate-400 hover:text-brand-pink transition-all active:scale-95"
            >
              <Heart
                className={`w-5 h-5 ${
                  isFavorite ? 'fill-brand-pink text-brand-pink' : 'text-slate-400'
                }`}
              />
            </button>
          </div>

          <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500 pt-3 sm:pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-brand-blue shrink-0" />
              <span>In Stock: <strong>{product.stock} units ready</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="text-emerald-700 font-semibold">Dispatched within 24 hours</span>
            </div>
          </div>
        </div>

        {/* Right Column: Details & Purchasing Controls */}
        <div className="bg-white lg:bg-transparent rounded-3xl p-5 sm:p-6 lg:p-0 border lg:border-none border-slate-100 shadow-soft-sm lg:shadow-none">
          {/* Category & Rating */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-blue bg-brand-blue-light px-2.5 py-1 rounded-md">
              {product.category}
            </span>
            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
              Age: {product.ageGroup}
            </span>
            <div className="flex items-center gap-1 text-xs text-brand-navy font-bold bg-brand-peach-light px-2 py-1 rounded-md">
              <Star className="w-3.5 h-3.5 fill-brand-peach text-brand-peach" />
              <span>{product.rating}</span>
              <span className="text-slate-400 font-normal">({product.reviewCount} reviews)</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-navy font-display tracking-tight leading-snug mb-2">
            {product.name}
          </h1>

          <p className="text-sm text-slate-500 font-medium mb-4">
            {product.shortDescription}
          </p>

          {/* Price Row */}
          <div className="flex items-baseline gap-2.5 sm:gap-3 p-3.5 sm:p-4 rounded-2xl bg-brand-cream border border-slate-100 mb-5">
            <span className="text-2xl sm:text-3xl font-extrabold text-brand-navy">₹{product.price}</span>
            {product.originalPrice && (
              <span className="text-sm sm:text-base text-slate-400 line-through">₹{product.originalPrice}</span>
            )}
            <span className="text-[11px] sm:text-xs text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded ml-auto sm:ml-0">
              Inclusive of GST
            </span>
          </div>

          {/* Description */}
          <div className="mb-5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              About This Essential
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Benefits */}
          {product.benefits && product.benefits.length > 0 && (
            <div className="mb-5 p-4 rounded-2xl bg-slate-50/80 border border-slate-100">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-brand-peach" />
                <span>Key Benefits for Baby</span>
              </h2>
              <ul className="space-y-2">
                {product.benefits.map((benefit, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Ingredients / Specifications */}
          {product.ingredientsOrSpecs && product.ingredientsOrSpecs.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Pure Ingredients & Specifications
              </h2>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {product.ingredientsOrSpecs.map((spec, i) => (
                  <span
                    key={i}
                    className="text-xs font-medium text-slate-600 bg-slate-100 px-3 py-1 rounded-lg"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Stepper & Action Buttons */}
          <div className="pt-5 border-t border-slate-100 space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Quantity
              </span>
              <div className="flex items-center bg-slate-100 rounded-2xl p-1 border border-slate-200">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  aria-label="Decrease quantity"
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-600 hover:bg-white transition-colors active:scale-90"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-10 text-center font-bold text-base text-brand-navy">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  aria-label="Increase quantity"
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-600 hover:bg-white transition-colors active:scale-90"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={handleAddToBag}
                id="details-add-to-bag-btn"
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-brand-blue to-brand-blue-soft text-white font-bold py-3.5 px-6 rounded-2xl border-2 border-brand-blue shadow-[0_4px_14px_rgba(22,137,216,0.35)] ring-2 ring-brand-baby-blue/50 hover:shadow-[0_0_18px_rgba(22,137,216,0.55),0_4px_16px_rgba(22,137,216,0.35)] hover:border-white hover:ring-2 hover:ring-brand-blue/80 hover:brightness-105 transition-all active:scale-98 text-sm min-h-[48px] focus:outline-none focus:ring-2 focus:ring-brand-baby-blue/80"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Bag</span>
              </button>

              <button
                onClick={handleBuyNow}
                id="details-buy-now-btn"
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-brand-pink to-brand-peach text-white font-bold py-3.5 px-6 rounded-2xl border-2 border-brand-pink shadow-[0_4px_14px_rgba(247,168,184,0.4)] ring-2 ring-brand-pink/40 hover:shadow-[0_0_18px_rgba(247,168,184,0.6)] hover:border-white hover:ring-2 hover:ring-brand-pink/80 hover:brightness-105 transition-all active:scale-98 text-sm min-h-[48px] focus:outline-none focus:ring-2 focus:ring-brand-pink/80"
              >
                <Zap className="w-4 h-4" />
                <span>Buy Now</span>
              </button>
            </div>
          </div>

          {/* Reassurance */}
          <div className="mt-5 flex items-center justify-center gap-2.5 text-xs text-slate-400 text-center">
            <ShieldCheck className="w-4 h-4 text-brand-blue shrink-0" />
            <span>100% genuine guaranteed • Safe checkout for families</span>
          </div>
        </div>
      </div>
    </div>
  );
};
