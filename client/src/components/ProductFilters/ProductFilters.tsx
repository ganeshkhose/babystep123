import React, { useState } from 'react';
import {
  CategoryName,
  AgeGroup,
  SortOption,
  FilterState,
} from '../../types/product';
import { RotateCcw, SlidersHorizontal, ChevronDown, ChevronUp } from 'lucide-react';
import { Dropdown } from '../Dropdown';

interface ProductFiltersProps {
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  onResetFilters: () => void;
  totalResults: number;
}

const CATEGORIES: CategoryName[] = [
  'All Products',
  'Baby Care',
  'Bath & Body',
  'Feeding',
  'Clothing',
  'Toys',
  'Mom & Baby',
  'Daily Essentials',
];

const AGE_GROUPS: AgeGroup[] = [
  'All Ages',
  '0-6 months',
  '6-12 months',
  '1-2 years',
  '2+ years',
];

const RATING_OPTIONS = [
  { value: 0, label: 'All Ratings' },
  { value: 4.5, label: '4.5 ★ and above' },
  { value: 4.8, label: '4.8 ★ and above' },
];

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'recommended', label: 'Recommended' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'best_rated', label: 'Best Rated' },
  { value: 'newest', label: 'Newest Arrivals' },
];

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  totalResults,
}) => {
  const [mobileExpanded, setMobileExpanded] = useState(false);

  // Count active non-default sub-filters
  const activeSubFiltersCount =
    (filters.ageGroup !== 'All Ages' ? 1 : 0) +
    (filters.priceRange[1] < 1200 ? 1 : 0) +
    (filters.minRating > 0 ? 1 : 0) +
    (filters.sortBy !== 'recommended' ? 1 : 0);

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-100 shadow-soft-sm mb-6 sm:mb-8">
      {/* Category Pills Slider/Row */}
      <div className="mb-4 sm:mb-6">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Categories
          </span>
          <span className="text-xs text-slate-500 font-medium">
            Showing <strong className="text-brand-navy">{totalResults}</strong> items
          </span>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-1 px-1 no-scrollbar touch-pan-x">
          {CATEGORIES.map((cat) => {
            const isSelected = filters.category === cat;
            return (
              <button
                key={cat}
                onClick={() => onFilterChange({ category: cat })}
                className={`whitespace-nowrap px-3.5 sm:px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 shrink-0 min-h-[38px] flex items-center ${
                  isSelected
                    ? 'bg-brand-blue text-white shadow-sm shadow-blue-200 scale-100'
                    : 'bg-slate-100/90 text-slate-600 hover:bg-brand-baby-blue/20 hover:text-brand-navy active:scale-95'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile Sub-Filters Accordion Toggle */}
      <div className="md:hidden pt-3 border-t border-slate-100">
        <button
          onClick={() => setMobileExpanded(!mobileExpanded)}
          className="w-full flex items-center justify-between py-2 px-3 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-colors min-h-[44px]"
        >
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-brand-blue" />
            <span>Filter & Sort Controls</span>
            {activeSubFiltersCount > 0 && (
              <span className="bg-brand-blue text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                {activeSubFiltersCount} active
              </span>
            )}
          </div>
          <div className="text-slate-400">
            {mobileExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>
      </div>

      {/* Sub-Filters: Age Group, Price, Rating, Sort */}
      <div
        className={`${
          mobileExpanded ? 'block' : 'hidden'
        } md:grid pt-4 md:border-t border-slate-100 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end animate-in fade-in duration-150`}
      >
        {/* Age Group Filter with Custom Dropdown UI */}
        <div>
          <Dropdown<AgeGroup>
            id="filter-age-group"
            label="Age Group"
            options={AGE_GROUPS}
            value={filters.ageGroup}
            onChange={(val) => onFilterChange({ ageGroup: val })}
            size="sm"
          />
        </div>

        {/* Price Range Filter */}
        <div className="pt-2 sm:pt-0">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Max Price
            </label>
            <span className="text-xs font-bold text-brand-blue">
              ₹{filters.priceRange[1]}
            </span>
          </div>
          <input
            type="range"
            min="200"
            max="1200"
            step="50"
            value={filters.priceRange[1]}
            onChange={(e) =>
              onFilterChange({
                priceRange: [filters.priceRange[0], Number(e.target.value)],
              })
            }
            className="w-full accent-brand-blue cursor-pointer h-2 bg-slate-200 rounded-lg appearance-none my-2"
          />
        </div>

        {/* Rating Filter with Custom Dropdown UI */}
        <div>
          <Dropdown<number>
            id="filter-min-rating"
            label="Customer Rating"
            options={RATING_OPTIONS}
            value={filters.minRating}
            onChange={(val) => onFilterChange({ minRating: val })}
            size="sm"
          />
        </div>

        {/* Sorting Dropdown & Reset with Custom Dropdown UI */}
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <Dropdown<SortOption>
              id="filter-sort-by"
              label="Sort By"
              options={SORT_OPTIONS}
              value={filters.sortBy}
              onChange={(val) => onFilterChange({ sortBy: val })}
              size="sm"
            />
          </div>

          <button
            onClick={onResetFilters}
            title="Reset All Filters"
            className="h-11 w-11 rounded-2xl border border-slate-200 text-slate-500 hover:text-rose-500 hover:bg-rose-50 transition-colors flex items-center justify-center shrink-0 mb-0.5 active:scale-95"
            aria-label="Reset all filters"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
