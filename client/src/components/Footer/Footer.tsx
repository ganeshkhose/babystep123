import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ShieldCheck, Feather, Truck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-100 mt-20">
      {/* Why Parents Choose Baby Step - 4 Key Benefits */}
      <div className="border-b border-slate-100 bg-gradient-to-b from-brand-cream to-white">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="text-center mb-6 sm:mb-10">
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-brand-blue bg-brand-blue-light/70 px-3 py-1 rounded-full">
              Our Promise to Families
            </span>
            <h2 className="text-xl sm:text-3xl font-bold text-brand-navy font-display mt-2">
              Why parents choose Baby Step
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto mt-1.5 px-2">
              Every formula, fabric, and toy is carefully evaluated for tender infant safety and gentle comfort.
            </p>
          </div>

          <div className="grid grid-cols-1 min-[420px]:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6">
            <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-100 shadow-soft-sm text-center flex flex-col items-center">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-brand-blue-light text-brand-blue flex items-center justify-center mb-3 sm:mb-4">
                <Feather className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h3 className="font-bold text-brand-navy text-sm sm:text-base mb-1">Gentle Choices</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Dermatologically tested formulas, plant botanicals, and hypoallergenic certified fibers.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-100 shadow-soft-sm text-center flex flex-col items-center">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-brand-pink-light text-brand-pink flex items-center justify-center mb-3 sm:mb-4">
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h3 className="font-bold text-brand-navy text-sm sm:text-base mb-1">Everyday Essentials</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                From morning bath bubbles to midnight soothing rompers, built for real parenting routines.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-100 shadow-soft-sm text-center flex flex-col items-center">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-brand-blue-powder/60 text-brand-navy flex items-center justify-center mb-3 sm:mb-4">
                <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-brand-blue" />
              </div>
              <h3 className="font-bold text-brand-navy text-sm sm:text-base mb-1">Thoughtfully Selected</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Tested by pediatric specialists with zero toxins, zero artificial dyes, and zero phthalates.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-100 shadow-soft-sm text-center flex flex-col items-center">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-brand-peach-light text-brand-navy flex items-center justify-center mb-3 sm:mb-4">
                <Truck className="w-5 h-5 sm:w-6 sm:h-6 text-brand-peach" />
              </div>
              <h3 className="font-bold text-brand-navy text-sm sm:text-base mb-1">Easy Shopping</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Instant guest checkout, transparent pricing, fast dispatch, and simple 7-day exchanges.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Wordmark */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-5 sm:gap-6 text-center md:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
            <img src="/logo.png" alt="The Baby Step - Baby Care Products" className="h-10 sm:h-12 w-auto object-contain rounded-lg drop-shadow-sm" />
            <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
              Little essentials for every little step. Thoughtfully formulated and tested for tender comfort.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-slate-600 font-medium">
            <Link to="/" className="hover:text-brand-blue transition-colors py-1">
              Products
            </Link>
            <Link to="/bag" className="hover:text-brand-pink transition-colors py-1">
              Add to Bag
            </Link>
            <span className="text-slate-300 hidden sm:inline">•</span>
            <span className="text-slate-500 py-1">Pediatrician Approved</span>
            <span className="text-slate-300 hidden sm:inline">•</span>
            <span className="text-slate-500 py-1">Cruelty Free</span>
          </div>

          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} Baby Step. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
