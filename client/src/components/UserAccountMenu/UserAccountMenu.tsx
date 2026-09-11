import React, { useState, useRef, useEffect } from 'react';
import { User } from 'lucide-react';

interface UserAccountMenuProps {
  id?: string;
  size?: 'sm' | 'md';
}

export const UserAccountMenu: React.FC<UserAccountMenuProps> = ({
  id = 'user-account-btn',
  size = 'md',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const isSmall = size === 'sm';

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        id={id}
        type="button"
        aria-label="User Account"
        aria-expanded={isOpen}
        className={`flex items-center gap-1.5 sm:gap-2 transition-all border-2 border-slate-200/70 hover:border-brand-blue hover:ring-2 hover:ring-brand-baby-blue/50 hover:shadow-[0_0_12px_rgba(22,137,216,0.25)] hover:scale-105 active:scale-95 cursor-pointer font-bold focus:outline-none focus:bg-white focus:text-brand-blue focus:border-brand-blue focus:ring-2 focus:ring-brand-baby-blue/60 focus:shadow-[0_0_12px_rgba(22,137,216,0.25)] ${
          isSmall
            ? 'py-1.5 px-3.5 text-xs text-brand-navy hover:text-brand-blue bg-slate-100/90 hover:bg-white rounded-full'
            : 'py-2 px-4 text-sm text-brand-navy hover:text-brand-blue bg-white/90 hover:bg-white rounded-full shadow-soft-sm'
        }`}
      >
        <div
          className={`rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue shrink-0 ${
            isSmall ? 'w-4.5 h-4.5' : 'w-6 h-6'
          }`}
        >
          <User className={isSmall ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
        </div>
        <span className="truncate">My Account</span>
        <span className="w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-white shrink-0" title="Active Mode" />
      </button>

      {isOpen && (
        <div
          className={`absolute right-0 mt-2 w-60 bg-white border border-brand-baby-blue/25 py-3 z-50 animate-in fade-in zoom-in-95 duration-150 ${
            isSmall
              ? 'rounded-2xl shadow-[0_12px_36px_-6px_rgba(22,137,216,0.18),0_6px_20px_-3px_rgba(0,0,0,0.08)]'
              : 'rounded-3xl shadow-[0_12px_36px_-6px_rgba(22,137,216,0.15),0_6px_20px_-3px_rgba(0,0,0,0.06)]'
          }`}
        >
          <div className="px-4 pb-2.5 border-b border-slate-100">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Active Session
            </p>
            <p className="text-sm font-bold text-brand-navy truncate">
              Guest Parent
            </p>
            <p className="text-[11px] text-emerald-600 font-medium mt-0.5">
              ✓ Browsing storefront
            </p>
          </div>

          <div className="pt-2 px-2 space-y-1">
            <button
              onClick={() => setIsOpen(false)}
              type="button"
              className="w-full text-left px-3.5 py-2.5 text-xs font-bold text-brand-navy hover:text-brand-blue hover:bg-slate-50/90 rounded-xl transition-colors flex items-center justify-between cursor-pointer"
            >
              <span>Sign in or Register</span>
              <span className="text-[10px] text-slate-400 font-normal">UI Demo</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserAccountMenu;
