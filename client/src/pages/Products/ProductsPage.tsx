import React, { useState, useMemo, useEffect } from 'react';
import { Sparkles, ArrowDown } from 'lucide-react';
import { FilterState, CategoryName } from '../../types/product';
import { SAMPLE_PRODUCTS } from '../../data/sampleProducts';
import { ProductGrid } from '../../components/ProductGrid/ProductGrid';
import { ProductFilters } from '../../components/ProductFilters/ProductFilters';
import { HeroCradle3D } from '../../components/HeroCradle';

interface ProductsPageProps {
  activeCategory?: string;
  onCategoryChange?: (cat: string) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

const initialFilters: FilterState = {
  category: 'Home',
  searchQuery: '',
  ageGroup: 'All Ages',
  priceRange: [0, 1200],
  minRating: 0,
  sortBy: 'recommended',
};

export const ProductsPage: React.FC<ProductsPageProps> = ({
  activeCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
}) => {
  const [internalFilters, setInternalFilters] = useState<FilterState>(initialFilters);

  // Synchronize when controlled from parent Navbar/App
  useEffect(() => {
    if (activeCategory !== undefined) {
      setInternalFilters(prev => ({ ...prev, category: activeCategory as CategoryName }));
    }
  }, [activeCategory]);

  useEffect(() => {
    if (searchQuery !== undefined) {
      setInternalFilters(prev => ({ ...prev, searchQuery }));
    }
  }, [searchQuery]);

  const currentCategory = activeCategory !== undefined ? activeCategory : internalFilters.category;
  const currentSearch = searchQuery !== undefined ? searchQuery : internalFilters.searchQuery;

  // In-memory instant filtering for static UI display
  const filteredProducts = useMemo(() => {
    let result = [...SAMPLE_PRODUCTS];

    if (currentCategory && currentCategory !== 'Home' && currentCategory !== 'All Products') {
      const cat = currentCategory.toLowerCase().trim();
      result = result.filter(p => p.category.toLowerCase() === cat);
    }

    if (currentSearch && currentSearch.trim()) {
      const q = currentSearch.toLowerCase().trim();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    return result;
  }, [currentCategory, currentSearch]);

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    if (newFilters.category !== undefined && onCategoryChange) {
      onCategoryChange(newFilters.category);
    }
    if (newFilters.searchQuery !== undefined && onSearchChange) {
      onSearchChange(newFilters.searchQuery);
    }
    setInternalFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleResetFilters = () => {
    if (onCategoryChange) onCategoryChange('Home');
    if (onSearchChange) onSearchChange('');
    setInternalFilters(initialFilters);
  };

  const scrollToProducts = () => {
    const el = document.getElementById('products-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const activeFiltersForBar: FilterState = {
    ...internalFilters,
    category: (currentCategory || 'Home') as CategoryName,
    searchQuery: currentSearch || '',
  };

  return (
    <div className="min-h-screen">
      {/* Soft Pastel Hero Section */}
      <section className="relative overflow-hidden pt-1 sm:pt-1.5 md:pt-2 pb-4 sm:pb-6 bg-gradient-to-br from-brand-pink/10 via-transparent to-brand-baby-blue/10">
        <div className="absolute top-0 -left-12 sm:-left-20 w-64 sm:w-72 h-64 sm:h-72 rounded-full bg-brand-pink/25 blur-3xl pointer-events-none" />
        <div className="absolute top-1/4 -right-12 sm:-right-20 w-64 sm:w-80 h-64 sm:h-80 rounded-full bg-brand-baby-blue/30 blur-3xl pointer-events-none" />

        <div className="relative w-full max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1536px] 3xl:max-w-[1680px] 4k:max-w-[1920px] mx-auto px-3 sm:px-6 lg:px-8">
          {/* Elongated Unified Navigation & Category Pill Bar */}
          <div className="sticky top-1 sm:top-1.5 z-40 mb-5 sm:mb-7 transition-all duration-300 max-w-5xl xl:max-w-6xl 2xl:max-w-[1240px] 3xl:max-w-[1380px] mx-auto">
            <ProductFilters
              filters={activeFiltersForBar}
              onFilterChange={handleFilterChange}
              totalResults={filteredProducts.length}
            />
          </div>

          {/* Hero Content: 2-column on desktop (Cradle on Left, Text on Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-6 lg:gap-10 max-w-6xl 3xl:max-w-7xl mx-auto py-2 sm:py-4">
            {/* Left Side: 3D Interactive Cradle */}
            <div className="lg:col-span-6 flex justify-center order-2 lg:order-1">
              <HeroCradle3D />
            </div>

            {/* Right Side: Headline, Subtitle, and Action Button */}
            <div className="lg:col-span-6 flex flex-col items-center lg:items-start text-center lg:text-left order-1 lg:order-2 space-y-3.5 sm:space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-pink/10 border border-brand-pink/20 text-brand-pink text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Nurturing Every Little Milestone</span>
              </div>

              <h1 className="text-3xl min-[400px]:text-4xl sm:text-5xl lg:text-5xl xl:text-6xl font-extrabold text-brand-navy font-display tracking-tight leading-tight">
                Little things.{' '}
                <span className="bg-gradient-to-r from-brand-blue via-brand-baby-blue to-brand-pink bg-clip-text text-transparent block sm:inline lg:block xl:inline">
                  Big moments.
                </span>
              </h1>

              <p className="text-xs sm:text-sm md:text-base text-slate-600 max-w-lg leading-relaxed">
                Discover thoughtful essentials for your little one's journey. Pediatrician-certified formulas, organic care, and peaceful nursery comfort.
              </p>

              <div className="pt-1 flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={scrollToProducts}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-brand-blue to-brand-blue-soft text-white font-bold py-3.5 px-8 rounded-full transition-all duration-200 border-2 border-brand-blue shadow-[0_4px_14px_rgba(22,137,216,0.35)] ring-2 ring-brand-baby-blue/50 hover:shadow-[0_0_18px_rgba(22,137,216,0.55),0_4px_16px_rgba(22,137,216,0.35)] hover:border-white hover:ring-2 hover:ring-brand-blue/80 hover:brightness-105 hover:scale-105 active:scale-98 text-sm min-h-[48px] focus:outline-none focus:ring-2 focus:ring-brand-baby-blue/80 cursor-pointer"
                >
                  <span>Explore Products</span>
                  <ArrowDown className="w-4 h-4 animate-bounce" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Shopping Section */}
      <section id="products-section" className="max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1536px] 3xl:max-w-[1680px] 4k:max-w-[1920px] mx-auto px-3 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-2 sm:pb-3">
        {/* Section Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-brand-navy font-display">
            Made for little moments
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto px-2">
            Thoughtfully selected essentials for every stage of growing up.
          </p>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <ProductGrid products={filteredProducts} />
        ) : (
          <div className="text-center py-16 px-4 bg-white rounded-3xl border border-slate-100 shadow-soft max-w-md mx-auto my-8">
            <div className="w-16 h-16 mx-auto rounded-full bg-brand-pink-light text-brand-pink flex items-center justify-center mb-4">
              <Sparkles className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-brand-navy mb-1 font-display">
              No matching essentials found
            </h3>
            <p className="text-xs text-slate-500 mb-6 max-w-xs mx-auto leading-relaxed">
              Try another search term or reset your active filters.
            </p>
            <button
              onClick={handleResetFilters}
              type="button"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-blue to-brand-blue-soft text-white text-xs font-bold px-6 py-2.5 rounded-full transition-all duration-200 border-2 border-brand-blue shadow-[0_4px_12px_rgba(22,137,216,0.3)] ring-2 ring-brand-baby-blue/40 hover:shadow-[0_0_14px_rgba(22,137,216,0.45)] hover:border-white hover:ring-2 hover:ring-brand-blue/70 hover:scale-105 focus:outline-none cursor-pointer"
            >
              <span>Reset Filters</span>
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default ProductsPage;
