import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, LogOut, Sparkles } from 'lucide-react';

interface AdminNavbarProps {
  onLogout: () => void;
}

export const AdminNavbar: React.FC<AdminNavbarProps> = ({ onLogout }) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-brand-baby-blue/30 shadow-soft-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand & Portal Title */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center group py-1" title="Baby Step Home">
              <img
                src="/logo.png"
                alt="Baby Step Logo"
                className="h-10 sm:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </Link>
            <div className="h-6 w-px bg-slate-200 hidden sm:block" />
            <div className="flex items-center gap-1.5">
              <span className="text-xs sm:text-sm font-extrabold text-brand-navy tracking-tight uppercase">
                Admin Portal
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-pink/15 text-brand-pink border border-brand-pink/30">
                <Sparkles className="w-2.5 h-2.5" />
                Live Catalog
              </span>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Real-time Status Badge */}
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Storefront Sync Active</span>
            </div>

            {/* View Live Store Button */}
            <Link
              to="/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold text-brand-blue hover:text-white bg-brand-blue-light hover:bg-brand-blue transition-all border-2 border-brand-baby-blue/40 hover:border-brand-blue hover:ring-2 hover:ring-brand-baby-blue/50 hover:shadow-[0_0_12px_rgba(22,137,216,0.25)] shadow-soft-sm"
              title="Open customer storefront in a new tab"
            >
              <span>View Storefront</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            {/* Exit / Lock Session */}
            <button
              onClick={onLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-500 hover:text-rose-600 hover:bg-rose-50 border-2 border-transparent hover:border-rose-200 transition-all cursor-pointer"
              title="Lock Admin Session"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Lock Session</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
