import React, { useState, useEffect } from 'react';
import { ShoppingBag, User, X, LayoutGrid, ChevronRight } from 'lucide-react';
import { MOBILE_CATEGORIES } from '../../constants/categories';

interface NavbarProps {
  activeCategory?: string;
  onSelectCategory?: (category: string) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeCategory = 'Home',
  onSelectCategory,
}) => {
  const [categorySheetOpen, setCategorySheetOpen] = useState(false);

  const handleCategoryClick = (catName: string) => {
    setCategorySheetOpen(false);
    if (onSelectCategory) {
      onSelectCategory(catName);
    }
    const section = document.getElementById('products-section');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Close category sheet on Escape key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setCategorySheetOpen(false);
      }
    };

    if (categorySheetOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [categorySheetOpen]);

  return (
    <>

      {/* Persistent Mobile Bottom Navigation Bar (md:hidden) */}
      <nav
        aria-label="Mobile Navigation"
        className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200/80 shadow-[0_-4px_24px_rgba(0,0,0,0.07)] pb-safe md:hidden transition-transform duration-200"
      >
        <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
          {/* 1. Home Tab */}
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className={`flex-1 flex flex-col items-center justify-center py-1 rounded-xl transition-all duration-150 active:scale-95 cursor-pointer ${
              !activeCategory || activeCategory === 'Home' || activeCategory === 'All Products'
                ? 'text-brand-blue font-bold'
                : 'text-slate-500 hover:text-brand-navy'
            }`}
          >
            <div className={`p-1 rounded-full ${!activeCategory || activeCategory === 'Home' || activeCategory === 'All Products' ? 'bg-brand-blue-light/60' : ''}`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <span className="text-[11px] mt-0.5 tracking-tight">Home</span>
          </button>

          {/* 2. Categories Tab */}
          <button
            type="button"
            onClick={() => setCategorySheetOpen(true)}
            aria-label="Shop by Category"
            className={`flex-1 flex flex-col items-center justify-center py-1 rounded-xl transition-all duration-150 active:scale-95 cursor-pointer ${
              categorySheetOpen || (activeCategory && activeCategory !== 'Home' && activeCategory !== 'All Products')
                ? 'text-brand-blue font-bold'
                : 'text-slate-500 hover:text-brand-navy'
            }`}
          >
            <div className={`p-1 rounded-full ${categorySheetOpen || (activeCategory && activeCategory !== 'Home' && activeCategory !== 'All Products') ? 'bg-brand-blue-light/60' : ''}`}>
              <LayoutGrid className="w-5 h-5" />
            </div>
            <span className="text-[11px] mt-0.5 tracking-tight truncate max-w-[68px]">
              {activeCategory && activeCategory !== 'Home' ? activeCategory : 'Categories'}
            </span>
          </button>

          {/* 3. Bag Tab */}
          <div
            className="flex-1 flex flex-col items-center justify-center py-1 rounded-xl text-slate-500 relative cursor-default select-none"
          >
            <div className="p-1 rounded-full relative">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <span className="text-[11px] mt-0.5 tracking-tight">Bag (0)</span>
          </div>

          {/* 4. Account Tab */}
          <div
            className="flex-1 flex flex-col items-center justify-center py-1 rounded-xl text-slate-500 cursor-default select-none"
          >
            <div className="p-1 rounded-full">
              <User className="w-5 h-5" />
            </div>
            <span className="text-[11px] mt-0.5 tracking-tight truncate max-w-[64px]">
              Account
            </span>
          </div>
        </div>
      </nav>

      {/* Category Bottom Sheet Modal (Mobile Only) */}
      {categorySheetOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex flex-col justify-end animate-in fade-in duration-200">
          {/* Backdrop */}
          <div
            onClick={() => setCategorySheetOpen(false)}
            className="fixed inset-0 bg-brand-navy/50 backdrop-blur-xs transition-opacity cursor-pointer"
          />

          {/* Bottom Sheet Card */}
          <div className="relative z-10 bg-white rounded-t-3xl shadow-[0_-10px_35px_rgba(0,0,0,0.2)] border-t border-brand-baby-blue/30 p-4 pb-8 max-w-lg mx-auto w-full animate-in slide-in-from-bottom duration-250">
            {/* Pull Bar */}
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-3" />

            {/* Sheet Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-extrabold text-brand-navy">Shop by Category</h3>
                <p className="text-xs text-slate-500">Pick a category to filter products</p>
              </div>
              <button
                onClick={() => setCategorySheetOpen(false)}
                type="button"
                aria-label="Close"
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors cursor-pointer active:scale-95"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Categories List */}
            <div className="py-2.5 space-y-2">
              {MOBILE_CATEGORIES.map((cat) => {
                const isSelected =
                  (cat.name === 'All Products' && (!activeCategory || activeCategory === 'Home')) ||
                  activeCategory === cat.name;

                return (
                  <button
                    key={cat.name}
                    type="button"
                    onClick={() => handleCategoryClick(cat.name)}
                    className={`w-full flex items-center justify-between p-3 rounded-2xl transition-all cursor-pointer text-left border-2 ${
                      isSelected
                        ? 'bg-brand-blue-light/50 border-brand-blue text-brand-blue shadow-xs'
                        : 'bg-slate-50/90 hover:bg-slate-100/90 text-slate-700 border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl select-none">{cat.icon}</span>
                      <div>
                        <p className={`text-sm font-bold ${isSelected ? 'text-brand-blue' : 'text-slate-800'}`}>
                          {cat.label}
                        </p>
                        <p className="text-[11px] text-slate-500">{cat.desc}</p>
                      </div>
                    </div>
                    <ChevronRight className={`w-4 h-4 ${isSelected ? 'text-brand-blue font-bold' : 'text-slate-400'}`} />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
