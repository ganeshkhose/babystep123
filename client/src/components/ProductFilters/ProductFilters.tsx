import React from 'react';
import { ShoppingBag, Search, X } from 'lucide-react';
import { FilterState } from '../../types/product';
import { STORE_CATEGORIES } from '../../constants/categories';
import { UserAccountMenu } from '../UserAccountMenu';

interface ProductFiltersProps {
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  onResetFilters?: () => void;
  totalResults?: number;
}

interface SearchInputProps {
  id: string;
  value: string;
  onChange: (query: string) => void;
  inputClassName: string;
  iconSizeClass?: string;
  clearButtonClass?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({
  id,
  value,
  onChange,
  inputClassName,
  iconSizeClass = 'left-2.5 w-4 h-4',
  clearButtonClass = 'right-1.5 w-5 h-5 hover:bg-slate-100',
}) => (
  <div className="relative flex items-center w-full">
    <Search className={`absolute text-brand-blue pointer-events-none ${iconSizeClass}`} />
    <input
      id={id}
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Search essentials (e.g. wipes, lotion)..."
      className={inputClassName}
    />
    {value && (
      <button
        type="button"
        onClick={() => onChange('')}
        aria-label="Clear search"
        className={`absolute rounded-full text-slate-400 hover:text-slate-700 transition-colors flex items-center justify-center active:scale-95 cursor-pointer ${clearButtonClass}`}
      >
        <X className="w-3.5 h-3.5" />
      </button>
    )}
  </div>
);

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  filters,
  onFilterChange,
}) => {
  return (
    <div className="w-full bg-white/95 backdrop-blur-md rounded-lg lg:rounded-full px-2.5 sm:px-4 lg:px-5 py-1.5 sm:py-2 border border-brand-baby-blue/30 shadow-[0_6px_24px_rgb(0,0,0,0.06)] text-left transition-all duration-200">
      {/* 1. MOBILE VIEW: Logo & Search only (Hidden on Desktop: lg:hidden) */}
      <div className="flex items-center gap-2.5 lg:hidden w-full">
        {/* Logo */}
        <div className="flex items-center shrink-0 cursor-default select-none" title="The Baby Step - Home">
          <img
            src="/logo.png"
            alt="The Baby Step - Baby Care Products"
            className="h-7 w-auto object-contain transition-transform duration-300 group-hover:scale-105 filter drop-shadow-xs"
          />
        </div>

        {/* Full Search Bar - Seamless White */}
        <div className="flex-1 ml-0.5">
          <SearchInput
            id="mobile-main-search"
            value={filters.searchQuery || ''}
            onChange={(q) => onFilterChange({ searchQuery: q })}
            inputClassName="w-full bg-transparent border-0 outline-none pl-8 pr-7 py-1 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-0"
          />
        </div>
      </div>

      {/* 2. DESKTOP VIEW (Visible on lg+) */}
      <div className="hidden lg:flex items-center justify-between gap-2.5">
        {/* Brand Logo */}
        <div className="flex items-center shrink-0 mr-4 xl:mr-6 cursor-default select-none" title="The Baby Step - Home">
          <img
            src="/logo.png"
            alt="The Baby Step - Baby Care Products"
            className="h-8 lg:h-9 w-auto object-contain transition-transform duration-300 group-hover:scale-105 filter drop-shadow-xs"
          />
        </div>

        {/* All Desktop Category Pills */}
        <div className="flex items-center gap-1.5 shrink-0">
          {STORE_CATEGORIES.map((cat) => {
            const isSelected =
              filters.category === cat ||
              (cat === 'Home' &&
                (!filters.category || filters.category === 'All Products'));
            return (
              <button
                key={cat}
                type="button"
                onClick={() => onFilterChange({ category: cat })}
                className={`group/tab relative whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 shrink-0 min-h-[32px] flex items-center cursor-pointer select-none focus:outline-none ${
                  isSelected
                    ? 'bg-gradient-to-r from-brand-blue to-brand-blue-soft text-white border-2 border-brand-blue shadow-[0_4px_14px_rgba(22,137,216,0.35)] ring-2 ring-brand-baby-blue/50 hover:shadow-[0_0_18px_rgba(22,137,216,0.55),0_4px_16px_rgba(22,137,216,0.35)] hover:border-white hover:ring-2 hover:ring-brand-blue/80 hover:brightness-105 scale-[1.02] active:scale-95'
                    : 'bg-slate-100/90 text-slate-700 border-2 border-slate-200/70 hover:bg-white hover:text-brand-blue hover:border-brand-blue hover:ring-2 hover:ring-brand-baby-blue/60 hover:shadow-[0_0_14px_rgba(22,137,216,0.3),0_2px_8px_rgba(22,137,216,0.12)] hover:scale-105 hover:-translate-y-0.5 focus:bg-white focus:text-brand-blue focus:border-brand-blue focus:ring-2 focus:ring-brand-baby-blue/70 focus:shadow-[0_0_16px_rgba(22,137,216,0.35)] active:scale-95'
                }`}
              >
                <span>{cat}</span>
              </button>
            );
          })}
        </div>

        {/* Desktop Search Box */}
        <div className="w-56 xl:w-64 2xl:w-72 max-w-xs mx-2 shrink">
          <SearchInput
            id="main-search-input"
            value={filters.searchQuery || ''}
            onChange={(q) => onFilterChange({ searchQuery: q })}
            iconSizeClass="left-3 w-3.5 h-3.5"
            clearButtonClass="right-2 w-5 h-5 hover:bg-slate-200/60"
            inputClassName="w-full bg-slate-100/80 hover:bg-white focus:bg-white border-2 border-slate-200/70 hover:border-brand-baby-blue/70 focus:border-brand-blue rounded-full pl-8 sm:pl-9 pr-8 py-1.5 text-xs text-slate-800 placeholder-slate-400 shadow-xs focus:outline-none focus:ring-2 focus:ring-brand-baby-blue/50 focus:shadow-[0_0_12px_rgba(22,137,216,0.25)] transition-all"
          />
        </div>

        {/* Desktop Right Action Group: Add to Bag + Login/Account */}
        <div className="flex items-center gap-2 shrink-0">
          <div
            id="cat-box-tab-add-to-bag-desktop"
            className="group flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 border-2 shadow-xs bg-slate-100/90 text-brand-navy/80 border-slate-200/70 hover:bg-white hover:text-brand-blue hover:border-brand-blue hover:ring-2 hover:ring-brand-baby-blue/50 hover:shadow-[0_0_12px_rgba(22,137,216,0.25)] hover:scale-105 cursor-default select-none"
          >
            <ShoppingBag className="w-3.5 h-3.5 transition-transform duration-200 group-hover:scale-110 group-hover:-rotate-6" />
            <span>Add to Bag</span>
            <span className="text-[10px] font-medium text-slate-400">
              (0)
            </span>
          </div>

          {/* Desktop User Account Profile */}
          <UserAccountMenu id="box-user-account-btn-desktop" size="sm" />
        </div>
      </div>
    </div>
  );
};

export default ProductFilters;
