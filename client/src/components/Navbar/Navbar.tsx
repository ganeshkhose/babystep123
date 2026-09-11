import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { ShoppingBag, User, Search, X, LayoutGrid, ChevronRight } from 'lucide-react';
import { useAppSelector } from '../../app/hooks';
import { selectBasketItemCount } from '../../features/basket/basketSelectors';
import { useAuth } from '../../context/AuthContext';

const MOBILE_CATEGORIES = [
  { name: 'All Products', label: 'All Products', icon: '🏠', desc: 'Explore all baby essentials' },
  { name: 'Baby Care', label: 'Baby Care', icon: '🍼', desc: 'Diapers, wipes, lotions & oils' },
  { name: 'Bath & Body', label: 'Bath & Body', icon: '🛁', desc: 'Gentle washes, shampoos & soaps' },
  { name: 'Mom & Baby', label: 'Mom & Baby', icon: '🤱', desc: 'Nursing, feeding & maternal care' },
];

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const itemCount = useAppSelector(selectBasketItemCount);
  const { user, openAuthModal, logout } = useAuth();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [categorySheetOpen, setCategorySheetOpen] = useState(false);
  const [navSearchQuery, setNavSearchQuery] = useState(() => searchParams.get('q') || '');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isProductsActive = location.pathname === '/' || location.pathname.startsWith('/products');
  const isBagActive = location.pathname === '/bag';
  const isHomePage = location.pathname === '/';
  const activeCategoryParam = searchParams.get('category');

  useEffect(() => {
    setNavSearchQuery(searchParams.get('q') || '');
  }, [searchParams]);

  const handleCategoryClick = (catName: string) => {
    setCategorySheetOpen(false);
    if (catName === 'All Products' || catName === 'Home') {
      navigate('/');
    } else {
      navigate(`/?category=${encodeURIComponent(catName)}`);
    }
    if (location.pathname === '/') {
      setTimeout(() => {
        const section = document.getElementById('products-section');
        if (section) {
          section.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  const handleMobileSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (navSearchQuery.trim()) {
      navigate(`/?q=${encodeURIComponent(navSearchQuery.trim())}`);
    } else {
      navigate('/');
    }
  };

  const handleClearSearch = () => {
    setNavSearchQuery('');
    if (searchParams.get('q')) {
      navigate('/');
    }
  };

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
        setCategorySheetOpen(false);
      }
    };

    if (userDropdownOpen || categorySheetOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [userDropdownOpen, categorySheetOpen]);

  // Close menus on route change
  useEffect(() => {
    setUserDropdownOpen(false);
    setCategorySheetOpen(false);
  }, [location.pathname]);

  return (
    <>
      <header className={`sticky top-0 z-40 bg-gradient-to-r from-brand-baby-blue/15 via-[#F5ECF3]/90 to-brand-pink/15 backdrop-blur-md border-b border-brand-baby-blue/25 shadow-[0_4px_20px_-4px_rgba(22,137,216,0.06)] transition-all duration-200 ${isHomePage ? 'hidden' : ''}`}>
        {/* Mobile View: Logo + Seamless Search Capsule (matching Home page mobile top bar) */}
        <div className="md:hidden py-1.5 px-2.5">
          <div className="w-full bg-white/95 backdrop-blur-md rounded-2xl px-2.5 py-1 border border-brand-baby-blue/30 shadow-[0_6px_24px_rgb(0,0,0,0.06)] flex items-center gap-2.5">
            {/* Logo */}
            <Link to="/" className="flex items-center shrink-0" title="The Baby Step - Home">
              <img
                src="/logo.png"
                alt="The Baby Step - Baby Care Products"
                className="h-7 w-auto object-contain transition-transform duration-300 group-hover:scale-105 filter drop-shadow-xs"
              />
            </Link>

            {/* Search Bar - Seamless White (No inner circular box) */}
            <form onSubmit={handleMobileSearchSubmit} className="relative flex items-center flex-1 ml-0.5">
              <Search className="absolute left-2.5 w-4 h-4 text-brand-blue pointer-events-none" />
              <input
                id="mobile-subpage-search"
                type="text"
                value={navSearchQuery}
                onChange={(e) => setNavSearchQuery(e.target.value)}
                placeholder="Search essentials (e.g. wipes, lotion)..."
                className="w-full bg-transparent border-0 outline-none pl-8 pr-7 py-1 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-0"
              />
              {navSearchQuery && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  aria-label="Clear search"
                  className="absolute right-1.5 w-5 h-5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors flex items-center justify-center active:scale-95 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </form>
          </div>
        </div>

        {/* Desktop View (Visible on md+) */}
        <div className="hidden md:block max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Brand Logo */}
            <Link to="/" className="flex items-center group py-1" title="The Baby Step - Home">
              <img
                src="/logo.png"
                alt="The Baby Step - Baby Care Products"
                className="h-12 sm:h-16 md:h-[66px] w-auto object-contain transition-transform duration-300 group-hover:scale-105 filter drop-shadow-sm"
              />
            </Link>

            {/* Desktop Navigation - Glassmorphic Pill Tab matching Hero aesthetic */}
            <nav className="flex items-center gap-1.5 bg-white/90 backdrop-blur-md p-1.5 rounded-full border border-brand-baby-blue/40 shadow-soft-sm">
              <Link
                to="/"
                id="nav-tab-home"
                className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-200 border-2 focus:outline-none ${
                  isProductsActive
                    ? 'bg-gradient-to-r from-brand-blue to-brand-blue-soft text-white border-brand-blue shadow-[0_4px_14px_rgba(22,137,216,0.35)] ring-2 ring-brand-baby-blue/50 hover:shadow-[0_0_18px_rgba(22,137,216,0.55),0_4px_16px_rgba(22,137,216,0.35)] hover:border-white hover:ring-2 hover:ring-brand-blue/80 scale-[1.02]'
                    : 'bg-slate-100/90 text-slate-700 border-slate-200/70 hover:bg-white hover:text-brand-blue hover:border-brand-blue hover:ring-2 hover:ring-brand-baby-blue/60 hover:shadow-[0_0_14px_rgba(22,137,216,0.3),0_2px_8px_rgba(22,137,216,0.12)] hover:scale-105 focus:bg-white focus:text-brand-blue focus:border-brand-blue focus:ring-2 focus:ring-brand-baby-blue/70 focus:shadow-[0_0_16px_rgba(22,137,216,0.35)]'
                }`}
              >
                Home
              </Link>

              <Link
                to="/bag"
                id="nav-tab-add-to-bag"
                className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold transition-all duration-200 border-2 focus:outline-none ${
                  isBagActive
                    ? 'bg-gradient-to-r from-brand-blue to-brand-blue-soft text-white border-brand-blue shadow-[0_4px_14px_rgba(22,137,216,0.35)] ring-2 ring-brand-baby-blue/50 hover:shadow-[0_0_18px_rgba(22,137,216,0.55),0_4px_16px_rgba(22,137,216,0.35)] hover:border-white hover:ring-2 hover:ring-brand-blue/80 scale-[1.02]'
                    : 'bg-slate-100/90 text-slate-700 border-slate-200/70 hover:bg-white hover:text-brand-blue hover:border-brand-blue hover:ring-2 hover:ring-brand-baby-blue/60 hover:shadow-[0_0_14px_rgba(22,137,216,0.3),0_2px_8px_rgba(22,137,216,0.12)] hover:scale-105 focus:bg-white focus:text-brand-blue focus:border-brand-blue focus:ring-2 focus:ring-brand-baby-blue/70 focus:shadow-[0_0_16px_rgba(22,137,216,0.35)]'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Bag</span>
                {itemCount > 0 ? (
                  <span className={`inline-flex items-center justify-center min-w-5 h-5 px-1.5 text-xs font-bold rounded-full shadow-xs ${
                    isBagActive ? 'bg-white text-brand-blue' : 'bg-brand-pink text-white'
                  }`}>
                    {itemCount}
                  </span>
                ) : (
                  <span className={`text-xs font-medium ${isBagActive ? 'text-white/80' : 'text-slate-400'}`}>(0)</span>
                )}
              </Link>
            </nav>

            {/* Desktop Utility Actions */}
            <div className="flex items-center gap-3">
              {/* Account / Guest Profile */}
              <div ref={dropdownRef} className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  id="user-account-btn"
                  aria-label="User Account"
                  className="flex items-center gap-2 py-2 px-4 text-brand-navy hover:text-brand-blue bg-white/90 hover:bg-white rounded-full transition-all border-2 border-slate-200/70 hover:border-brand-blue hover:ring-2 hover:ring-brand-baby-blue/50 hover:shadow-[0_0_12px_rgba(22,137,216,0.25)] text-sm font-bold shadow-soft-sm hover:scale-105 active:scale-95 focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-baby-blue/60 focus:shadow-[0_0_12px_rgba(22,137,216,0.25)] cursor-pointer"
                >
                  <div className="w-6 h-6 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue">
                    <User className="w-3.5 h-3.5" />
                  </div>
                  <span>{user?.isGuest ? 'Guest' : user?.displayName || 'My Account'}</span>
                  {user?.isGuest && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-white" title="Active Guest Mode" />
                  )}
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-60 bg-white rounded-3xl shadow-[0_12px_36px_-6px_rgba(22,137,216,0.15),0_6px_20px_-3px_rgba(0,0,0,0.06)] border border-brand-baby-blue/25 py-3 z-50 animate-in fade-in zoom-in-95 duration-150">
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
                          className="w-full text-left px-3.5 py-2.5 text-xs font-bold text-brand-navy hover:text-brand-blue hover:bg-slate-50/90 rounded-xl transition-colors flex items-center justify-between"
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
                          className="w-full text-left px-3.5 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                        >
                          Log out (Switch to Guest)
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Persistent Mobile Bottom Navigation Bar (md:hidden) */}
      <nav
        aria-label="Mobile Navigation"
        className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200/80 shadow-[0_-4px_24px_rgba(0,0,0,0.07)] pb-safe md:hidden transition-transform duration-200"
      >
        <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
          {/* 1. Home Tab */}
          <Link
            to="/"
            onClick={() => {
              if (location.pathname === '/') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            className={`flex-1 flex flex-col items-center justify-center py-1 rounded-xl transition-all duration-150 active:scale-95 ${
              isHomePage && !activeCategoryParam
                ? 'text-brand-blue font-bold'
                : 'text-slate-500 hover:text-brand-navy'
            }`}
          >
            <div className={`p-1 rounded-full ${isHomePage && !activeCategoryParam ? 'bg-brand-blue-light/60' : ''}`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <span className="text-[11px] mt-0.5 tracking-tight">Home</span>
          </Link>

          {/* 2. Categories Tab */}
          <button
            onClick={() => setCategorySheetOpen(true)}
            aria-label="Shop by Category"
            className={`flex-1 flex flex-col items-center justify-center py-1 rounded-xl transition-all duration-150 active:scale-95 cursor-pointer ${
              categorySheetOpen || Boolean(activeCategoryParam)
                ? 'text-brand-blue font-bold'
                : 'text-slate-500 hover:text-brand-navy'
            }`}
          >
            <div className={`p-1 rounded-full ${categorySheetOpen || Boolean(activeCategoryParam) ? 'bg-brand-blue-light/60' : ''}`}>
              <LayoutGrid className="w-5 h-5" />
            </div>
            <span className="text-[11px] mt-0.5 tracking-tight truncate max-w-[68px]">
              {activeCategoryParam || 'Categories'}
            </span>
          </button>

          {/* 3. Bag Tab */}
          <Link
            to="/bag"
            className={`flex-1 flex flex-col items-center justify-center py-1 rounded-xl transition-all duration-150 active:scale-95 relative ${
              isBagActive
                ? 'text-brand-navy font-bold'
                : 'text-slate-500 hover:text-brand-navy'
            }`}
          >
            <div className={`p-1 rounded-full relative ${isBagActive ? 'bg-brand-pink-light' : ''}`}>
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-brand-blue rounded-full shadow-sm">
                  {itemCount}
                </span>
              )}
            </div>
            <span className="text-[11px] mt-0.5 tracking-tight">Bag</span>
          </Link>

          {/* 4. Account / Guest Tab */}
          <button
            onClick={() => {
              if (user && !user.isGuest) {
                logout();
              } else {
                openAuthModal();
              }
            }}
            aria-label="Account"
            className="flex-1 flex flex-col items-center justify-center py-1 rounded-xl text-slate-500 hover:text-brand-navy transition-all duration-150 active:scale-95 cursor-pointer"
          >
            <div className="p-1 rounded-full">
              <User className="w-5 h-5" />
            </div>
            <span className="text-[11px] mt-0.5 tracking-tight truncate max-w-[64px]">
              {user?.isGuest ? 'Guest' : user?.displayName || 'Account'}
            </span>
          </button>
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
                  (cat.name === 'All Products' && (!activeCategoryParam || activeCategoryParam === 'Home')) ||
                  activeCategoryParam === cat.name;

                return (
                  <button
                    key={cat.name}
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
