import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { adminAuthService } from '../services/adminAuthService';
import { LogOut, Store, ShieldCheck } from 'lucide-react';

export const AdminHeader: React.FC = () => {
  const navigate = useNavigate();
  const profile = adminAuthService.getProfile();

  const handleLogout = () => {
    adminAuthService.logout();
    navigate('/admin/login');
  };

  return (
    <header className="sticky top-0 z-50 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#EBE3DC] shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Brand & Admin Badge */}
        <div className="flex items-center gap-3">
          <Link to="/admin" className="flex items-center gap-2 group">
            <img
              src="/logo.png"
              alt="The Baby Step"
              className="h-8 w-auto object-contain rounded-md transition-transform group-hover:scale-105"
            />
            <div className="hidden sm:flex flex-col">
              <span className="text-xs font-extrabold text-[#1E293B] tracking-tight leading-none">
                The Baby Step
              </span>
              <span className="text-[10px] font-semibold text-brand-blue tracking-wider uppercase mt-0.5">
                Admin Console
              </span>
            </div>
          </Link>

          <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-brand-blue-light/70 text-brand-blue border border-brand-blue/20">
            <ShieldCheck className="w-3 h-3" />
            <span>Catalog Management</span>
          </span>
        </div>

        {/* Right: User pill & Actions */}
        <div className="flex items-center gap-2.5 sm:gap-4">
          {/* Admin User Status Pill */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 border border-[#E8DFD8] shadow-2xs text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-medium text-slate-700 max-w-[140px] truncate">
              {profile?.email || 'admin@thebabystep.com'}
            </span>
            <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
              {profile?.role || 'SuperAdmin'}
            </span>
          </div>

          {/* View Live Store */}
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-white border border-[#E8DFD8] text-slate-700 hover:text-brand-blue hover:border-brand-blue/40 shadow-2xs hover:shadow-xs transition-all duration-150"
            title="Open customer storefront in a new tab"
          >
            <Store className="w-3.5 h-3.5 text-brand-blue" />
            <span className="hidden min-[480px]:inline">View Store</span>
          </Link>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            type="button"
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200/70 transition-all duration-150 cursor-pointer shadow-2xs"
            title="Sign out of Admin Portal"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden min-[480px]:inline">Sign Out</span>
          </button>
        </div>
      </div>
    </header>
  );
};
