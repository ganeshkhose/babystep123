import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBag, Search, User, Menu, X } from 'lucide-react';
import { useAppSelector } from '../../app/hooks';
import { selectBasketItemCount } from '../../features/basket/basketSelectors';
import { useAuth } from '../../context/AuthContext';

interface NavbarProps {
  onOpenSearch?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSearch }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const itemCount = useAppSelector(selectBasketItemCount);
  const { user, openAuthModal, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const isProductsActive = location.pathname === '/' || location.pathname.startsWith('/products');
  const isBagActive = location.pathname === '/bag';

  const handleSearchClick = () => {
    if (onOpenSearch) {
      onOpenSearch();
    } else {
      navigate('/?search=true');
      const searchInput = document.getElementById('main-search-input');
      if (searchInput) {
        searchInput.focus();
      }
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-gradient-to-r from-brand-baby-blue/15 via-[#F5ECF3]/90 to-brand-pink/15 backdrop-blur-md border-b border-brand-baby-blue/25 shadow-[0_4px_20px_-4px_rgba(22,137,216,0.06)] transition-all duration-200">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
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
            <nav className="hidden md:flex items-center gap-1.5 bg-white/90 backdrop-blur-md p-1.5 rounded-full border border-brand-baby-blue/40 shadow-soft-sm">
              <Link
                to="/"
                id="nav-tab-products"
                className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-200 ${
                  isProductsActive
                    ? 'bg-gradient-to-r from-brand-blue to-brand-blue-soft text-white shadow-soft scale-[1.02]'
                    : 'text-brand-navy/80 hover:text-brand-navy hover:bg-white/80'
                }`}
              >
                Products
              </Link>

              <Link
                to="/bag"
                id="nav-tab-add-to-bag"
                className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold transition-all duration-200 ${
                  isBagActive
                    ? 'bg-gradient-to-r from-brand-blue to-brand-blue-soft text-white shadow-soft scale-[1.02]'
                    : 'text-brand-navy/80 hover:text-brand-navy hover:bg-white/80'
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
            <div className="hidden md:flex items-center gap-3">
              {/* Search Icon */}
              <button
                onClick={handleSearchClick}
                id="desktop-search-btn"
                aria-label="Search Products"
                className="p-2.5 text-brand-navy hover:text-brand-blue bg-white/90 hover:bg-white border border-brand-baby-blue/35 rounded-full transition-all shadow-soft-sm hover:scale-105 active:scale-95"
                title="Search products"
              >
                <Search className="w-4.5 h-4.5" />
              </button>

              {/* Account / Guest Profile */}
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  id="user-account-btn"
                  aria-label="User Account"
                  className="flex items-center gap-2 py-2 px-4 text-brand-navy hover:text-brand-blue bg-white/90 hover:bg-white rounded-full transition-all border border-brand-baby-blue/35 text-sm font-bold shadow-soft-sm hover:scale-102"
                >
                  <div className="w-6 h-6 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue">
                    <User className="w-3.5 h-3.5" />
                  </div>
                  <span>{user?.isGuest ? 'Guest Parent' : user?.displayName || 'My Account'}</span>
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
                        {user?.displayName || 'Guest Parent'}
                      </p>
                      {user?.isGuest ? (
                        <p className="text-[11px] text-emerald-600 font-medium mt-0.5">
                          ✓ Shopping as guest (No login needed)
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

            {/* Mobile Right Controls */}
            <div className="flex items-center gap-1.5 sm:gap-2 md:hidden">
              <button
                onClick={handleSearchClick}
                aria-label="Search"
                className="w-10 h-10 flex items-center justify-center text-brand-navy hover:text-brand-blue bg-white/85 hover:bg-white border border-brand-baby-blue/35 rounded-full transition-all shadow-soft-sm active:scale-95"
              >
                <Search className="w-4.5 h-4.5" />
              </button>

              <Link
                to="/bag"
                aria-label="Shopping Bag"
                className="relative w-10 h-10 flex items-center justify-center text-brand-navy hover:text-brand-blue bg-white/85 hover:bg-white border border-brand-baby-blue/35 rounded-full transition-all shadow-soft-sm active:scale-95"
              >
                <ShoppingBag className="w-4.5 h-4.5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-4 h-4 px-1 text-[10px] font-bold text-white bg-brand-pink rounded-full shadow-xs">
                    {itemCount}
                  </span>
                )}
              </Link>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle Menu"
                className="w-10 h-10 flex items-center justify-center text-brand-navy hover:text-brand-blue bg-white/85 hover:bg-white border border-brand-baby-blue/35 rounded-xl transition-all shadow-soft-sm active:scale-95"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-brand-baby-blue/20 bg-[#F5ECF3]/98 backdrop-blur-xl px-4 pt-3 pb-6 space-y-3 shadow-xl animate-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col gap-2">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-3.5 rounded-2xl text-base font-semibold flex items-center justify-between transition-colors ${
                  isProductsActive ? 'bg-brand-blue-light text-brand-blue' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>Products</span>
                <span className="text-xs text-slate-400 font-normal">Explore Catalog</span>
              </Link>

              <Link
                to="/bag"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-3.5 rounded-2xl text-base font-semibold flex items-center justify-between transition-colors ${
                  isBagActive ? 'bg-brand-pink-light text-brand-navy font-bold' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <ShoppingBag className="w-5 h-5 text-brand-blue" />
                  <span>Shopping Bag</span>
                </div>
                <span className="text-xs font-bold bg-brand-blue text-white px-2.5 py-1 rounded-full shadow-sm">
                  {itemCount} {itemCount === 1 ? 'item' : 'items'}
                </span>
              </Link>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <User className="w-4 h-4 text-brand-blue" />
                <span className="font-medium truncate max-w-[140px]">
                  {user?.isGuest ? 'Guest Parent' : user?.displayName || 'Parent'}
                </span>
                {user?.isGuest && (
                  <span className="text-[10px] bg-emerald-50 text-emerald-600 font-bold px-2 py-0.5 rounded-full">
                    Guest
                  </span>
                )}
              </div>
              {user && !user.isGuest ? (
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-xs font-semibold text-rose-600 px-3 py-2 rounded-lg hover:bg-rose-50 min-h-[40px] flex items-center"
                >
                  Switch to Guest
                </button>
              ) : (
                <button
                  onClick={() => {
                    openAuthModal();
                    setMobileMenuOpen(false);
                  }}
                  className="text-xs font-semibold text-brand-blue bg-brand-blue-light px-4 py-2 rounded-full hover:bg-brand-blue hover:text-white transition-colors min-h-[40px] flex items-center"
                >
                  Sign In / Register
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Persistent Mobile Bottom Navigation Bar (md:hidden) */}
      <nav
        aria-label="Mobile Navigation"
        className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200/80 shadow-[0_-4px_24px_rgba(0,0,0,0.07)] pb-safe md:hidden transition-transform duration-200"
      >
        <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
          {/* Shop tab */}
          <Link
            to="/"
            className={`flex-1 flex flex-col items-center justify-center py-1 rounded-xl transition-all duration-150 active:scale-95 ${
              isProductsActive
                ? 'text-brand-blue font-bold'
                : 'text-slate-500 hover:text-brand-navy'
            }`}
          >
            <div className={`p-1 rounded-full ${isProductsActive ? 'bg-brand-blue-light/60' : ''}`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <span className="text-[11px] mt-0.5 tracking-tight">Shop</span>
          </Link>

          {/* Search tab */}
          <button
            onClick={handleSearchClick}
            aria-label="Search"
            className="flex-1 flex flex-col items-center justify-center py-1 rounded-xl text-slate-500 hover:text-brand-navy transition-all duration-150 active:scale-95"
          >
            <div className="p-1 rounded-full">
              <Search className="w-5 h-5" />
            </div>
            <span className="text-[11px] mt-0.5 tracking-tight">Search</span>
          </button>

          {/* Bag tab with badge */}
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

          {/* Account tab */}
          <button
            onClick={() => {
              if (user && !user.isGuest) {
                logout();
              } else {
                openAuthModal();
              }
            }}
            aria-label="Account"
            className="flex-1 flex flex-col items-center justify-center py-1 rounded-xl text-slate-500 hover:text-brand-navy transition-all duration-150 active:scale-95"
          >
            <div className="p-1 rounded-full">
              <User className="w-5 h-5" />
            </div>
            <span className="text-[11px] mt-0.5 tracking-tight truncate max-w-[64px]">
              {user?.isGuest ? 'Guest' : 'Account'}
            </span>
          </button>
        </div>
      </nav>
    </>
  );
};
