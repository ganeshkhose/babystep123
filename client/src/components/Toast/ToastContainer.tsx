import React from 'react';
import { useToast } from '../../context/ToastContext';
import { ShoppingBag, CheckCircle2, Heart, Trash2, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0"
    >
      {toasts.map((toast) => {
        let IconComponent = ShoppingBag;
        let iconBg = 'bg-brand-blue-light text-brand-blue';

        if (toast.iconType === 'heart') {
          IconComponent = Heart;
          iconBg = 'bg-brand-pink-light text-brand-pink';
        } else if (toast.iconType === 'check') {
          IconComponent = CheckCircle2;
          iconBg = 'bg-emerald-50 text-emerald-600';
        } else if (toast.iconType === 'trash') {
          IconComponent = Trash2;
          iconBg = 'bg-rose-50 text-rose-500';
        }

        return (
          <div
            key={toast.id}
            role="status"
            className="pointer-events-auto flex items-center justify-between gap-3 p-3.5 bg-white/95 backdrop-blur-md rounded-2xl shadow-soft border border-slate-100 text-brand-navy transition-all duration-300 transform translate-y-0"
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl ${iconBg}`}>
                <IconComponent className="w-4 h-4" />
              </div>
              <span className="text-sm font-semibold tracking-tight text-brand-navy">{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              aria-label="Dismiss notification"
              className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
