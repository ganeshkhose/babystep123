import React from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  onClear: () => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  onClear,
  placeholder = 'Search essentials (e.g. wipes, lotion, romper)...',
}) => {
  return (
    <div className="relative w-full max-w-2xl mx-auto px-1 sm:px-0">
      <div className="relative flex items-center">
        <div className="absolute left-4 sm:left-5 text-slate-400 pointer-events-none flex items-center justify-center">
          <Search className="w-4 h-4 sm:w-5 sm:h-5 text-brand-blue" />
        </div>

        <input
          id="main-search-input"
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-white border border-slate-200/90 rounded-full pl-11 sm:pl-14 pr-11 sm:pr-12 py-3 sm:py-3.5 text-base sm:text-sm text-slate-800 placeholder-slate-400 shadow-soft-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue transition-all"
        />

        {value && (
          <button
            onClick={onClear}
            aria-label="Clear search"
            className="absolute right-2 sm:right-3 w-10 h-10 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors flex items-center justify-center active:scale-95"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
