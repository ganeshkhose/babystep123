import React from 'react';

export const ProductSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-soft-sm flex flex-col justify-between animate-pulse">
      <div>
        {/* Image Box */}
        <div className="w-full aspect-square rounded-2xl bg-slate-100 mb-4 animate-shimmer" />

        {/* Tag & Rating */}
        <div className="flex items-center justify-between mb-2">
          <div className="h-4 w-16 bg-slate-100 rounded-md" />
          <div className="h-4 w-12 bg-slate-100 rounded-md" />
        </div>

        {/* Title */}
        <div className="h-5 w-4/5 bg-slate-100 rounded-lg mb-2" />
        <div className="h-3 w-full bg-slate-100 rounded-md mb-1" />
        <div className="h-3 w-2/3 bg-slate-100 rounded-md mb-4" />
      </div>

      {/* Price and Button */}
      <div className="pt-3 border-t border-slate-50 flex items-center justify-between">
        <div className="h-6 w-16 bg-slate-100 rounded-lg" />
        <div className="h-8 w-24 bg-slate-100 rounded-xl" />
      </div>
    </div>
  );
};

export const ProductGridSkeleton: React.FC<{ count?: number }> = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 gap-2.5 sm:gap-4 md:gap-5 lg:gap-6">
      {Array.from({ length: count }).map((_, idx) => (
        <ProductSkeleton key={idx} />
      ))}
    </div>
  );
};

