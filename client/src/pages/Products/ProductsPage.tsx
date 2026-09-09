import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import {
  Sparkles,
  ArrowDown,
  RefreshCw,
} from 'lucide-react';
import { FilterState, CategoryName } from '../../types/product';
import { fetchProducts } from '../../services/productService';
import { ProductGrid } from '../../components/ProductGrid/ProductGrid';
import { ProductFilters } from '../../components/ProductFilters/ProductFilters';
import { ProductGridSkeleton } from '../../components/LoadingSkeleton/ProductSkeleton';
import { HeroCradle3D } from '../../components/HeroCradle';

const initialFilters: FilterState = {
  category: 'Home',
  searchQuery: '',
  ageGroup: 'All Ages',
  priceRange: [0, 1200],
  minRating: 0,
  sortBy: 'recommended',
};

export const ProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState<FilterState>(() => {
    const cat = searchParams.get('category') as CategoryName;
    const query = searchParams.get('q') || '';
    return {
      ...initialFilters,
      category: (cat && cat !== 'All Products') ? cat : 'Home',
      searchQuery: query,
    };
  });

  // Keep search params in sync
  useEffect(() => {
    const cat = searchParams.get('category') as CategoryName;
    const q = searchParams.get('q');
    if (cat && cat !== filters.category) {
      setFilters(prev => ({ ...prev, category: cat === 'All Products' ? 'Home' : cat }));
    }
    if (q !== null && q !== filters.searchQuery) {
      setFilters(prev => ({ ...prev, searchQuery: q }));
    }
  }, [searchParams]);

  const {
    data: products = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['products', filters],
    queryFn: () => fetchProducts(filters),
    staleTime: 1000 * 5, // 5 seconds cache
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
  });

  // Listen to admin additions/updates across tabs or SPA navigation to update automatically
  useEffect(() => {
    const handleSync = () => {
      refetch();
    };

    window.addEventListener('baby_step_products_updated', handleSync);
    window.addEventListener('storage', handleSync);

    return () => {
      window.removeEventListener('baby_step_products_updated', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, [refetch]);

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters(prev => {
      const updated = { ...prev, ...newFilters };
      if (newFilters.category && newFilters.category !== 'Home' && newFilters.category !== 'All Products') {
        searchParams.set('category', newFilters.category);
      } else if (newFilters.category === 'Home' || newFilters.category === 'All Products') {
        searchParams.delete('category');
      }
      if (newFilters.searchQuery !== undefined) {
        if (newFilters.searchQuery) {
          searchParams.set('q', newFilters.searchQuery);
        } else {
          searchParams.delete('q');
        }
      }
      setSearchParams(searchParams, { replace: true });
      return updated;
    });
  };

  const handleResetFilters = () => {
    setFilters(initialFilters);
    setSearchParams({}, { replace: true });
  };

  const scrollToProducts = () => {
    const el = document.getElementById('products-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen">
      {/* Soft Pastel Hero Section */}
      <section className="relative overflow-hidden pt-1 sm:pt-1.5 md:pt-2 pb-4 sm:pb-6 bg-gradient-to-br from-brand-pink/10 via-transparent to-brand-baby-blue/10">
        {/* Soft background decorative blobs aligned with Option 1 diagonal flow */}
        <div className="absolute top-0 -left-12 sm:-left-20 w-64 sm:w-72 h-64 sm:h-72 rounded-full bg-brand-pink/25 blur-3xl pointer-events-none" />
        <div className="absolute top-1/4 -right-12 sm:-right-20 w-64 sm:w-80 h-64 sm:h-80 rounded-full bg-brand-baby-blue/30 blur-3xl pointer-events-none" />

        <div className="relative w-full max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1536px] 3xl:max-w-[1680px] 4k:max-w-[1920px] mx-auto px-3 sm:px-6 lg:px-8">
          {/* Elongated Unified Navigation & Category Pill Bar - Positioned at the very top */}
          <div className="sticky top-1 sm:top-1.5 z-40 mb-5 sm:mb-7 transition-all duration-300 max-w-5xl xl:max-w-6xl 2xl:max-w-[1240px] 3xl:max-w-[1380px] mx-auto">
            <ProductFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              totalResults={products.length}
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
                  onClick={scrollToProducts}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-brand-blue to-brand-blue-soft text-white font-bold py-3.5 px-8 rounded-full transition-all duration-200 border-2 border-brand-blue shadow-[0_4px_14px_rgba(22,137,216,0.35)] ring-2 ring-brand-baby-blue/50 hover:shadow-[0_0_18px_rgba(22,137,216,0.55),0_4px_16px_rgba(22,137,216,0.35)] hover:border-white hover:ring-2 hover:ring-brand-blue/80 hover:brightness-105 hover:scale-105 active:scale-98 text-sm min-h-[48px] focus:outline-none focus:ring-2 focus:ring-brand-baby-blue/80"
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
      <section id="products-section" className="max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1536px] 3xl:max-w-[1680px] 4k:max-w-[1920px] mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Section Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-brand-navy font-display">
            Made for little moments
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto px-2">
            Thoughtfully selected essentials for every stage of growing up.
          </p>
        </div>

        {/* Loading State */}
        {isLoading && <ProductGridSkeleton count={8} />}

        {/* Error State */}
        {isError && !isLoading && (
          <div className="text-center py-16 px-4 bg-white rounded-3xl border border-rose-100 shadow-soft max-w-md mx-auto my-8">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mb-4">
              <RefreshCw className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-1">
              Oops! We couldn't load the products.
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Please check your connection and give it another gentle try.
            </p>
            <button
              onClick={() => refetch()}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-blue to-brand-blue-soft text-white text-xs font-bold px-6 py-2.5 rounded-full transition-all duration-200 border-2 border-brand-blue shadow-[0_4px_12px_rgba(22,137,216,0.3)] ring-2 ring-brand-baby-blue/40 hover:shadow-[0_0_14px_rgba(22,137,216,0.45)] hover:border-white hover:ring-2 hover:ring-brand-blue/70 hover:scale-105 focus:outline-none"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Try Again</span>
            </button>
          </div>
        )}

        {/* Products Grid */}
        {!isLoading && !isError && products.length > 0 && (
          <ProductGrid products={products} />
        )}

        {/* Empty Catalog / Filter State */}
        {!isLoading && !isError && products.length === 0 && (
          <div className="text-center py-16 px-4 bg-white rounded-3xl border border-slate-100 shadow-soft max-w-md mx-auto my-8">
            <div className="w-16 h-16 mx-auto rounded-full bg-brand-pink-light text-brand-pink flex items-center justify-center mb-4">
              <Sparkles className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-brand-navy mb-1 font-display">
              {filters.searchQuery || (filters.category !== 'Home' && filters.category !== 'All Products')
                ? 'No matching essentials found'
                : 'Ready for New Products'}
            </h3>
            <p className="text-xs text-slate-500 mb-6 max-w-xs mx-auto leading-relaxed">
              {filters.searchQuery || (filters.category !== 'Home' && filters.category !== 'All Products')
                ? 'Try another search term or reset your active filters.'
                : 'The previous sample products have been removed. Provide your product images and details to populate your catalog.'}
            </p>
            {(filters.searchQuery || (filters.category !== 'Home' && filters.category !== 'All Products')) && (
              <button
                onClick={handleResetFilters}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-blue to-brand-blue-soft text-white text-xs font-bold px-6 py-2.5 rounded-full transition-all duration-200 border-2 border-brand-blue shadow-[0_4px_12px_rgba(22,137,216,0.3)] ring-2 ring-brand-baby-blue/40 hover:shadow-[0_0_14px_rgba(22,137,216,0.45)] hover:border-white hover:ring-2 hover:ring-brand-blue/70 hover:scale-105 focus:outline-none"
              >
                <span>Reset Filters</span>
              </button>
            )}
          </div>
        )}
      </section>
    </div>
  );
};
