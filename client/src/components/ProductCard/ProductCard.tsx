import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Heart, ShoppingBag, Check } from 'lucide-react';
import { Product } from '../../types/product';
import { useAppDispatch } from '../../app/hooks';
import { addToBag } from '../../features/basket/basketSlice';
import { useToast } from '../../context/ToastContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const dispatch = useAppDispatch();
  const { showToast } = useToast();
  const [isFavorite, setIsFavorite] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const handleAddToBag = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    dispatch(addToBag({ product, quantity: 1 }));
    showToast(`Added ${product.name} to your bag`, 'success', 'bag');

    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
    showToast(
      !isFavorite ? `Saved ${product.name} to wishlist` : `Removed from wishlist`,
      'info',
      'heart'
    );
  };

  return (
    <div className="group relative bg-white rounded-3xl p-3 sm:p-4 border border-slate-100/90 shadow-soft-sm hover:shadow-soft transition-all duration-300 flex flex-col justify-between soft-card-hover">
      <div>
        {/* Card Image Container */}
        <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-slate-50 mb-3">
          <Link to={`/products/${product.id}`} className="block w-full h-full">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          </Link>

          {/* Discount Badge */}
          {product.discountPercentage && product.discountPercentage > 0 && (
            <span className="absolute top-2 left-2 bg-brand-pink text-brand-navy text-[10px] sm:text-[11px] font-extrabold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full shadow-sm tracking-wide">
              {product.discountPercentage}% OFF
            </span>
          )}

          {/* Favorite Heart Button */}
          <button
            onClick={toggleFavorite}
            aria-label={isFavorite ? 'Remove from wishlist' : 'Save to wishlist'}
            className="absolute top-2 right-2 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/95 backdrop-blur-sm shadow-sm flex items-center justify-center text-slate-400 hover:text-brand-pink transition-all hover:scale-110 active:scale-90"
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                isFavorite ? 'fill-brand-pink text-brand-pink' : 'text-slate-400'
              }`}
            />
          </button>
        </div>

        {/* Product Category & Rating Row */}
        <div className="flex items-center justify-between gap-1.5 mb-1.5 px-0.5">
          <span className="text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase text-brand-blue bg-brand-blue-light/90 px-1.5 sm:px-2 py-0.5 rounded-md truncate max-w-[110px]">
            {product.category}
          </span>
          <div className="flex items-center gap-1 text-[11px] sm:text-xs text-brand-navy font-bold bg-brand-peach-light px-1.5 sm:px-2 py-0.5 rounded-md shrink-0">
            <Star className="w-3 h-3 fill-brand-peach text-brand-peach" />
            <span>{product.rating}</span>
            <span className="text-slate-400 font-normal text-[10px] hidden min-[400px]:inline">({product.reviewCount})</span>
          </div>
        </div>

        {/* Product Title */}
        <Link to={`/products/${product.id}`} className="block group-hover:text-brand-blue transition-colors px-0.5">
          <h3 className="text-sm sm:text-base font-bold text-brand-navy line-clamp-1 leading-snug mb-1">
            {product.name}
          </h3>
        </Link>

        {/* Short Description */}
        <p className="text-[11px] sm:text-xs text-slate-500 line-clamp-2 leading-relaxed mb-2.5 px-0.5">
          {product.shortDescription}
        </p>
      </div>

      {/* Pricing & Add to Bag Footer */}
      <div className="pt-2 border-t border-slate-50 flex items-center justify-between gap-1.5">
        <div className="flex flex-col min-w-0">
          <div className="flex items-baseline gap-1">
            <span className="text-base sm:text-lg font-extrabold text-brand-navy">₹{product.price}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-[10px] sm:text-xs text-slate-400 line-through">₹{product.originalPrice}</span>
            )}
          </div>
          <span className="text-[10px] text-slate-400 font-medium truncate">{product.ageGroup}</span>
        </div>

        <button
          onClick={handleAddToBag}
          id={`add-to-bag-${product.id}`}
          aria-label={`Add ${product.name} to bag`}
          className={`flex items-center justify-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 active:scale-95 shadow-sm min-h-[38px] shrink-0 ${
            justAdded
              ? 'bg-emerald-500 text-white'
              : 'bg-brand-blue text-white hover:bg-brand-blue-soft hover:shadow-glow-blue'
          }`}
        >
          {justAdded ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Added</span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Add<span className="hidden min-[480px]:inline"> to Bag</span></span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
