import React from 'react';
import { Star, Heart, ShoppingBag, Eye } from 'lucide-react';

interface LiveCardPreviewProps {
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  imageUrl: string;
  shortDescription: string;
  rating?: number;
  reviewCount?: number;
  ageGroup?: string;
}

export const LiveCardPreview: React.FC<LiveCardPreviewProps> = ({
  name,
  category,
  price,
  originalPrice,
  discountPercentage,
  imageUrl,
  shortDescription,
  rating = 4.9,
  reviewCount = 180,
  ageGroup = 'All Ages',
}) => {
  const displayImage = imageUrl.trim() || '/products/baby-wipes.jpg';
  const displayName = name.trim() || 'Your Product Title Will Appear Here';
  const displayCategory = category || 'Baby Care';
  const displayDesc = shortDescription.trim() || 'Short highlights and details for parents browsing the catalog.';

  // Calculate discount percentage if not provided
  const discount =
    discountPercentage && discountPercentage > 0
      ? discountPercentage
      : originalPrice && originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : null;

  return (
    <div className="bg-white rounded-3xl p-5 border border-brand-baby-blue/30 shadow-soft">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-brand-blue" />
          <h3 className="text-xs font-bold text-brand-navy uppercase tracking-wider">
            Live Storefront Card Preview
          </h3>
        </div>
        <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
          Customer View
        </span>
      </div>

      <div className="max-w-[280px] mx-auto">
        {/* Customer Product Card Simulation */}
        <div className="group relative bg-white rounded-3xl p-3.5 border border-slate-100/90 shadow-soft-sm hover:shadow-soft transition-all duration-300 flex flex-col justify-between">
          <div>
            {/* Card Image Container */}
            <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-slate-50 mb-3">
              <img
                src={displayImage}
                alt={displayName}
                className="w-full h-full object-cover object-center"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/products/baby-wipes.jpg';
                }}
              />

              {/* Discount Badge */}
              {discount && discount > 0 ? (
                <span className="absolute top-2 left-2 bg-brand-pink text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-sm tracking-wide">
                  {discount}% OFF
                </span>
              ) : null}

              {/* Wishlist Heart simulation */}
              <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-slate-400 shadow-soft-sm">
                <Heart className="w-4 h-4" />
              </div>
            </div>

            {/* Category & Rating Row */}
            <div className="flex items-center justify-between gap-1 mb-1.5">
              <span className="text-[10px] font-bold text-brand-blue uppercase tracking-wider truncate max-w-[120px]">
                {displayCategory}
              </span>
              <div className="flex items-center gap-1 text-[11px] font-bold text-slate-600">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span>{rating.toFixed(1)}</span>
                <span className="text-slate-400 font-normal text-[10px]">({reviewCount})</span>
              </div>
            </div>

            {/* Product Title */}
            <h4 className="font-bold text-brand-navy text-xs sm:text-sm line-clamp-1 mb-1 leading-snug">
              {displayName}
            </h4>

            {/* Short Description */}
            <p className="text-[11px] text-slate-500 line-clamp-2 mb-3 leading-relaxed">
              {displayDesc}
            </p>
          </div>

          <div>
            {/* Price & Add to Bag Row */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-50">
              <div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-base sm:text-lg font-extrabold text-brand-navy">
                    ₹{price || 0}
                  </span>
                  {originalPrice && originalPrice > price && (
                    <span className="text-xs text-slate-400 line-through">
                      ₹{originalPrice}
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-slate-400 font-medium">
                  {ageGroup}
                </div>
              </div>

              <div className="inline-flex items-center gap-1 bg-brand-blue text-white text-xs font-bold py-2 px-3 rounded-full shadow-soft-sm">
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add to Bag</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <p className="text-[11px] text-slate-400 text-center mt-4">
        This is an accurate 1:1 preview of how this product will display on the homepage and catalog grid.
      </p>
    </div>
  );
};
