import React, { createContext, useContext, useState, useCallback } from 'react';

export interface ToastItem {
  id: string;
  message: string;
  type?: 'success' | 'info' | 'error';
  iconType?: 'bag' | 'heart' | 'check' | 'trash';
}

interface ToastContextValue {
  showToast: (message: string, type?: 'success' | 'info' | 'error', iconType?: 'bag' | 'heart' | 'check' | 'trash') => void;
  removeToast: (id: string) => void;
  toasts: ToastItem[];
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: 'success' | 'info' | 'error' = 'success', iconType: 'bag' | 'heart' | 'check' | 'trash' = 'bag') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast: ToastItem = { id, message, type, iconType };

    setToasts(prev => [...prev.slice(-3), newToast]); // keep at most 4 visible

    setTimeout(() => {
      removeToast(id);
    }, 3200);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ showToast, removeToast, toasts }}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
