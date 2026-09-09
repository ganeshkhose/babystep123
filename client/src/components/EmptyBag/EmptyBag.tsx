import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Sparkles, ArrowRight } from 'lucide-react';

export const EmptyBag: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center max-w-md mx-auto">
      {/* Soft Pastel Illustration Container */}
      <div className="relative w-28 h-28 rounded-full bg-gradient-to-tr from-brand-baby-blue/25 via-brand-pink/20 to-brand-peach/20 flex items-center justify-center mb-6 shadow-soft">
        <ShoppingBag className="w-12 h-12 text-brand-blue" strokeWidth={1.75} />
        <span className="absolute -top-1 -right-1 p-2 rounded-full bg-white shadow-sm text-brand-peach">
          <Sparkles className="w-4 h-4" />
        </span>
      </div>

      <h2 className="text-2xl font-bold text-brand-navy mb-2 font-display">
        Your bag is ready for its first little find.
      </h2>
      <p className="text-sm text-slate-500 mb-8 max-w-sm leading-relaxed">
        Explore our curated collection of gentle washes, organic cloud rompers, and soothing essentials for your little one.
      </p>

      <Link
        to="/"
        className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-blue to-brand-blue-soft text-white font-bold py-3 px-8 rounded-full transition-all duration-200 border-2 border-brand-blue shadow-[0_4px_14px_rgba(22,137,216,0.35)] ring-2 ring-brand-baby-blue/50 hover:shadow-[0_0_18px_rgba(22,137,216,0.55),0_4px_16px_rgba(22,137,216,0.35)] hover:border-white hover:ring-2 hover:ring-brand-blue/80 hover:brightness-105 hover:scale-105 active:scale-98 text-sm focus:outline-none focus:ring-2 focus:ring-brand-baby-blue/80"
      >
        <span>Explore Products</span>
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
};
