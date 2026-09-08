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
import { SearchBar } from '../../components/SearchBar/SearchBar';
import { ProductGridSkeleton } from '../../components/LoadingSkeleton/ProductSkeleton';
import { HeroCradle3D } from '../../components/HeroCradle';

const initialFilters: FilterState = {
  category: 'All Products',
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
      category: cat || 'All Products',
      searchQuery: query,
    };
  });

  // Keep search params in sync
  useEffect(() => {
    const cat = searchParams.get('category') as CategoryName;
    const q = searchParams.get('q');
    if (cat && cat !== filters.category) {
      setFilters(prev => ({ ...prev, category: cat }));
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
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters(prev => {
      const updated = { ...prev, ...newFilters };
      if (newFilters.category && newFilters.category !== 'All Products') {
        searchParams.set('category', newFilters.category);
      } else if (newFilters.category === 'All Products') {
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
      <section className="relative overflow-hidden pt-5 sm:pt-7 md:pt-9 pb-4 sm:pb-6 bg-gradient-to-b from-brand-baby-blue/20 via-brand-pink/15 to-[#F5ECF3]">
        {/* Soft background decorative blobs */}
        <div className="absolute top-0 -left-12 sm:-left-20 w-64 sm:w-72 h-64 sm:h-72 rounded-full bg-brand-baby-blue/30 blur-3xl pointer-events-none" />
        <div className="absolute top-1/4 -right-12 sm:-right-20 w-64 sm:w-80 h-64 sm:h-80 rounded-full bg-brand-pink/25 blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl min-[400px]:text-4xl sm:text-5xl lg:text-6xl font-extrabold text-brand-navy font-display tracking-tight leading-tight max-w-3xl mx-auto">
            Little things.{' '}
            <span className="bg-gradient-to-r from-brand-blue via-brand-baby-blue to-brand-pink bg-clip-text text-transparent">
              Big moments.
            </span>
          </h1>

          <div className="mt-5 sm:mt-6 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <button
              onClick={scrollToProducts}
              className="w-full max-w-xs sm:w-auto inline-flex items-center justify-center gap-2 bg-brand-blue hover:bg-brand-blue-soft text-white font-bold py-3.5 px-8 rounded-full transition-all duration-200 shadow-soft hover:shadow-glow-blue hover:scale-105 active:scale-98 text-sm min-h-[48px]"
            >
              <span>Explore Products</span>
              <ArrowDown className="w-4 h-4 animate-bounce" />
            </button>
          </div>

          {/* 3D Animated Hero Cradle with consistent brand palette */}
          <HeroCradle3D />
        </div>
      </section>

      {/* Main Shopping Section */}
      <section id="products-section" className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Section Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-brand-navy font-display">
            Made for little moments
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto px-2">
            Thoughtfully selected essentials for every stage of growing up.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <SearchBar
            value={filters.searchQuery}
            onChange={(val) => handleFilterChange({ searchQuery: val })}
            onClear={() => handleFilterChange({ searchQuery: '' })}
          />
        </div>

        {/* Filters & Sorting */}
        <ProductFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onResetFilters={handleResetFilters}
          totalResults={products.length}
        />

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
              className="inline-flex items-center gap-2 bg-brand-blue text-white text-xs font-bold px-6 py-3 rounded-full hover:bg-brand-blue-soft transition-all shadow-sm"
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
              {filters.searchQuery || filters.category !== 'All Products'
                ? 'No matching essentials found'
                : 'Ready for New Products'}
            </h3>
            <p className="text-xs text-slate-500 mb-6 max-w-xs mx-auto leading-relaxed">
              {filters.searchQuery || filters.category !== 'All Products'
                ? 'Try another search term or reset your active filters.'
                : 'The previous sample products have been removed. Provide your product images and details to populate your catalog.'}
            </p>
            {(filters.searchQuery || filters.category !== 'All Products') && (
              <button
                onClick={handleResetFilters}
                className="inline-flex items-center gap-2 bg-brand-blue text-white text-xs font-bold px-6 py-3 rounded-full hover:bg-brand-blue-soft transition-all shadow-sm"
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
