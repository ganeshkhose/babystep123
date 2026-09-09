import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Search, X, User } from 'lucide-react';
import { useAppSelector } from '../../app/hooks';
import { selectBasketItemCount } from '../../features/basket/basketSelectors';
import { useAuth } from '../../context/AuthContext';
import { CategoryName, FilterState } from '../../types/product';

interface ProductFiltersProps {
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  onResetFilters?: () => void;
  totalResults?: number;
}

const CATEGORIES: CategoryName[] = [
  'Home',
  'Baby Care',
  'Bath & Body',
  'Mom & Baby',
];

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  filters,
  onFilterChange,
}) => {
  const location = useLocation();
  const itemCount = useAppSelector(selectBasketItemCount);
  const { user, openAuthModal, logout } = useAuth();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isBagActive = location.pathname === '/bag';

  // Close dropdown when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setUserDropdownOpen(false);
      }
    };

    if (userDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [userDropdownOpen]);

  return (
    <div className="w-full bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl lg:rounded-full px-3 sm:px-4 lg:px-5 py-1.5 sm:py-2 border border-brand-baby-blue/30 shadow-[0_6px_24px_rgb(0,0,0,0.06)] text-left transition-all duration-200">
      <div className="flex flex-wrap lg:flex-nowrap items-center justify-between gap-2 sm:gap-2.5">
        {/* Brand Logo - Order 1 */}
        <div className="order-1 flex items-center shrink-0 mr-3 sm:mr-4 lg:mr-6 xl:mr-8">
          <Link to="/" className="flex items-center group py-0.5" title="The Baby Step - Home">
            <img
              src="/logo.png"
              alt="The Baby Step - Baby Care Products"
              className="h-7 sm:h-8 lg:h-9 w-auto object-contain transition-transform duration-300 group-hover:scale-105 filter drop-shadow-xs"
            />
          </Link>
        </div>

        {/* Right Action Group on mobile/tablet (Bag + Login) / Far Right on Desktop - Order 2 on mobile, Order 4 on Desktop */}
        <div className="order-2 lg:order-4 flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Add to Bag Tab with reflected border on hover/focus */}
          <Link
            to="/bag"
            id="cat-box-tab-add-to-bag"
            className={`group flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 border-2 shadow-xs focus:outline-none ${
              isBagActive
                ? 'bg-gradient-to-r from-brand-blue to-brand-blue-soft text-white border-brand-blue shadow-[0_4px_12px_rgba(22,137,216,0.3)] ring-2 ring-brand-baby-blue/50 scale-[1.02]'
                : 'bg-slate-100/90 text-brand-navy/80 border-slate-200/70 hover:bg-white hover:text-brand-blue hover:border-brand-blue hover:ring-2 hover:ring-brand-baby-blue/50 hover:shadow-[0_0_12px_rgba(22,137,216,0.25)] hover:scale-105 focus:bg-white focus:text-brand-blue focus:border-brand-blue focus:ring-2 focus:ring-brand-baby-blue/60 focus:shadow-[0_0_12px_rgba(22,137,216,0.25)] active:scale-95'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5 transition-transform duration-200 group-hover:scale-110 group-hover:-rotate-6" />
            <span className="hidden min-[380px]:inline">Add to </span>
            <span>Bag</span>
            {itemCount > 0 ? (
              <span
                className={`inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold rounded-full shadow-xs transition-all duration-200 group-hover:scale-110 ${
                  isBagActive ? 'bg-white text-brand-blue' : 'bg-brand-pink text-white group-hover:shadow-glow-pink'
                }`}
              >
                {itemCount}
              </span>
            ) : (
              <span className={`text-[10px] font-medium transition-colors duration-200 ${isBagActive ? 'text-white/90' : 'text-slate-400 group-hover:text-brand-blue'}`}>
                (0)
              </span>
            )}
          </Link>

          {/* Login / Guest Account Profile & Dropdown with reflected border on hover/focus */}
          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              id="box-user-account-btn"
              aria-label="User Account"
              className="flex items-center gap-1.5 sm:gap-2 py-1.5 px-2.5 sm:px-3.5 text-brand-navy hover:text-brand-blue bg-slate-100/90 hover:bg-white rounded-full transition-all border-2 border-slate-200/70 hover:border-brand-blue hover:ring-2 hover:ring-brand-baby-blue/50 hover:shadow-[0_0_12px_rgba(22,137,216,0.25)] hover:scale-105 active:scale-95 cursor-pointer text-xs font-bold focus:outline-none focus:bg-white focus:text-brand-blue focus:border-brand-blue focus:ring-2 focus:ring-brand-baby-blue/60 focus:shadow-[0_0_12px_rgba(22,137,216,0.25)]"
            >
              <div className="w-4.5 h-4.5 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue">
                <User className="w-3 h-3" />
              </div>
              <span className="truncate max-w-[70px] sm:max-w-none">
                {user?.isGuest ? 'Guest' : user?.displayName || 'My Account'}
              </span>
              {user?.isGuest && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-white" title="Active Guest Mode" />
              )}
            </button>

            {userDropdownOpen && (
              <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-[0_12px_36px_-6px_rgba(22,137,216,0.18),0_6px_20px_-3px_rgba(0,0,0,0.08)] border border-brand-baby-blue/30 py-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-4 pb-2.5 border-b border-slate-100">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    {user?.isGuest ? 'Active Session' : 'Signed In'}
                  </p>
                  <p className="text-sm font-bold text-brand-navy truncate">
                    {user?.isGuest ? 'Guest' : user?.displayName || 'My Account'}
                  </p>
                  {user?.isGuest ? (
                    <p className="text-[11px] text-emerald-600 font-medium mt-0.5">
                      ✓ Browsing as guest
                    </p>
                  ) : (
                    <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                  )}
                </div>

                <div className="pt-2 px-2 space-y-1">
                  {user?.isGuest ? (
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        openAuthModal();
                      }}
                      className="w-full text-left px-3.5 py-2.5 text-xs font-bold text-brand-navy hover:text-brand-blue hover:bg-slate-50/90 rounded-xl transition-colors flex items-center justify-between cursor-pointer"
                    >
                      <span>Sign in or Register</span>
                      <span className="text-[10px] text-slate-400 font-normal">Optional</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        logout();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-3.5 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                    >
                      Log out (Switch to Guest)
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Category Pills with Reflective Border on Hover & Focus - Order 3 on mobile, Order 2 on Desktop */}
        <div className="order-3 lg:order-2 flex items-center gap-1 sm:gap-1.5 overflow-x-auto pb-1 lg:pb-0 -mx-1 px-1 no-scrollbar touch-pan-x shrink-0 w-full md:w-auto">
          {CATEGORIES.map((cat) => {
            const isSelected =
              filters.category === cat ||
              (cat === 'Home' && (!filters.category || filters.category === 'All Products'));
            return (
              <button
                key={cat}
                onClick={() => onFilterChange({ category: cat })}
                className={`group/tab relative whitespace-nowrap px-3 sm:px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 shrink-0 min-h-[32px] flex items-center cursor-pointer select-none focus:outline-none ${
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

        {/* Search Box with Reflected Border on Focus - Order 4 on mobile, Order 3 on Desktop */}
        <div className="order-4 lg:order-3 w-full md:w-56 lg:w-56 xl:w-64 2xl:w-72 md:ml-auto lg:ml-0 lg:max-w-xs lg:mx-1.5 xl:mx-3 shrink">
          <div className="relative flex items-center w-full">
            <Search className="absolute left-3 w-3.5 h-3.5 text-brand-blue pointer-events-none" />
            <input
              id="main-search-input"
              type="text"
              value={filters.searchQuery || ''}
              onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
              placeholder="Search essentials (e.g. wipes, lotion)..."
              className="w-full bg-slate-100/80 hover:bg-white focus:bg-white border-2 border-slate-200/70 hover:border-brand-baby-blue/70 focus:border-brand-blue rounded-full pl-8 sm:pl-9 pr-8 py-1.5 text-xs text-slate-800 placeholder-slate-400 shadow-xs focus:outline-none focus:ring-2 focus:ring-brand-baby-blue/50 focus:shadow-[0_0_12px_rgba(22,137,216,0.25)] transition-all"
            />
            {filters.searchQuery && (
              <button
                onClick={() => onFilterChange({ searchQuery: '' })}
                aria-label="Clear search"
                className="absolute right-2 w-5 h-5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors flex items-center justify-center active:scale-95"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

