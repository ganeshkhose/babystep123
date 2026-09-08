import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export interface DropdownOption<T = string | number> {
  value: T;
  label: string;
  icon?: React.ReactNode;
  badge?: string;
  disabled?: boolean;
}

export interface DropdownProps<T = string | number> {
  options: (DropdownOption<T> | T)[];
  value: T;
  onChange: (value: T) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  menuClassName?: string;
  id?: string;
  ariaLabel?: string;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export function Dropdown<T extends string | number = string>({
  options,
  value,
  onChange,
  label,
  placeholder = 'Select option...',
  disabled = false,
  className = '',
  menuClassName = '',
  id,
  ariaLabel,
  size = 'md',
  fullWidth = true,
}: DropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Normalize options to standard { value, label } format
  const normalizedOptions: DropdownOption<T>[] = options.map((opt) => {
    if (typeof opt === 'object' && opt !== null && 'value' in opt) {
      return opt as DropdownOption<T>;
    }
    return {
      value: opt as T,
      label: String(opt),
    };
  });

  const selectedOption = normalizedOptions.find((opt) => opt.value === value);

  // Close when clicking outside
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

  const handleSelect = (option: DropdownOption<T>) => {
    if (option.disabled) return;
    onChange(option.value);
    setIsOpen(false);
  };

  // Size styling variants
  const sizeClasses = {
    sm: 'py-2.5 px-3.5 text-xs rounded-xl min-h-[40px]',
    md: 'py-2.5 px-4 text-xs sm:text-sm rounded-2xl min-h-[44px]',
    lg: 'py-3.5 px-5 text-sm sm:text-base rounded-2xl min-h-[48px]',
  }[size];

  const itemSizeClasses = {
    sm: 'py-2 sm:py-2.5 px-3 sm:px-3.5 text-xs min-h-[38px]',
    md: 'py-2.5 sm:py-3 px-3.5 sm:px-4 text-xs sm:text-sm min-h-[42px]',
    lg: 'py-3.5 px-4 text-sm sm:text-base min-h-[46px]',
  }[size];

  return (
    <div
      ref={dropdownRef}
      className={`relative ${fullWidth ? 'w-full' : 'inline-block'} ${className}`}
    >
      {label && (
        <label
          htmlFor={id}
          className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 select-none"
        >
          {label}
        </label>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        id={id}
        aria-label={ariaLabel || label || 'Select dropdown option'}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        disabled={disabled}
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        className={`w-full bg-white flex items-center justify-between gap-2.5 border transition-all duration-200 select-none text-left font-semibold ${sizeClasses} ${
          isOpen
            ? 'border-brand-blue ring-2 ring-brand-blue/25 shadow-sm'
            : 'border-slate-200/90 hover:border-slate-300 shadow-soft-sm'
        } ${disabled ? 'opacity-60 cursor-not-allowed bg-slate-50' : 'cursor-pointer'}`}
      >
        <div className="flex items-center gap-2 truncate">
          {selectedOption?.icon && (
            <span className="shrink-0 text-brand-blue">{selectedOption.icon}</span>
          )}
          <span
            className={`truncate ${
              selectedOption ? 'text-brand-navy font-bold' : 'text-slate-400 font-normal'
            }`}
          >
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          {selectedOption?.badge && (
            <span className="shrink-0 text-[10px] font-extrabold bg-brand-peach-light text-brand-navy px-1.5 py-0.5 rounded-md">
              {selectedOption.badge}
            </span>
          )}
        </div>

        <ChevronDown
          className={`w-4 h-4 shrink-0 text-slate-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-brand-blue' : ''
          }`}
        />
      </button>

      {/* Floating Dropdown Menu Panel with viewport boundary clamp */}
      {isOpen && (
        <div
          role="listbox"
          aria-label={ariaLabel || label || 'Dropdown options'}
          className={`absolute left-0 top-full mt-2 w-full min-w-[190px] max-w-[calc(100vw-2rem)] bg-white rounded-[24px] sm:rounded-[28px] border border-slate-100/90 p-2 sm:p-2.5 shadow-[0_16px_42px_-6px_rgba(22,137,216,0.14),0_8px_24px_-4px_rgba(0,0,0,0.06)] z-50 animate-in fade-in zoom-in-95 duration-150 max-h-64 overflow-y-auto space-y-1 ${menuClassName}`}
        >
          {normalizedOptions.length === 0 ? (
            <div className="py-3 px-4 text-xs text-slate-400 text-center font-medium">
              No options available
            </div>
          ) : (
            normalizedOptions.map((opt) => {
              const isSelected = opt.value === value;

              return (
                <div
                  key={String(opt.value)}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(opt)}
                  className={`flex items-center justify-between gap-3 rounded-2xl cursor-pointer transition-all duration-150 ${itemSizeClasses} ${
                    opt.disabled
                      ? 'opacity-40 cursor-not-allowed'
                      : isSelected
                      ? 'bg-brand-blue-light/70 text-brand-blue font-bold shadow-xs'
                      : 'text-brand-navy font-bold hover:bg-slate-50/90 hover:text-brand-blue'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    {opt.icon && (
                      <span className={`shrink-0 ${isSelected ? 'text-brand-blue' : 'text-slate-400'}`}>
                        {opt.icon}
                      </span>
                    )}
                    <span className="truncate">{opt.label}</span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {opt.badge && (
                      <span className="text-[10px] font-extrabold bg-brand-peach-light text-brand-navy px-1.5 py-0.5 rounded-md">
                        {opt.badge}
                      </span>
                    )}
                    {isSelected && <Check className="w-4 h-4 text-brand-blue shrink-0" />}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

export default Dropdown;
