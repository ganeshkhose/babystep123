import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { store } from './app/store';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { Navbar } from './components/Navbar/Navbar';
import { Footer } from './components/Footer/Footer';
import { ToastContainer } from './components/Toast/ToastContainer';
import { AuthModal } from './components/AuthModal/AuthModal';

import { ProductsPage } from './pages/Products/ProductsPage';
import { ProductDetailsPage } from './pages/ProductDetails/ProductDetailsPage';
import { BagPage } from './pages/Bag/BagPage';
import { CheckoutPage } from './pages/Checkout/CheckoutPage';
import { AdminPage } from './pages/Admin';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Decoupled customer storefront layout wrapper
const CustomerStorefrontLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex flex-col min-h-screen bg-transparent text-slate-700">
    <Navbar />
    <main className="flex-1 pb-20 md:pb-0">{children}</main>
    <Footer />
  </div>
);

export const App: React.FC = () => {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ToastProvider>
            <BrowserRouter>
              <Routes>
                {/* Dedicated Admin Portal Route (Independent Layout for Future Extraction) */}
                <Route path="/admin" element={<AdminPage />} />

                {/* Customer Storefront Routes */}
                <Route
                  path="/*"
                  element={
                    <CustomerStorefrontLayout>
                      <Routes>
                        <Route path="/" element={<ProductsPage />} />
                        <Route path="/products/:productId" element={<ProductDetailsPage />} />
                        <Route path="/bag" element={<BagPage />} />
                        <Route path="/checkout" element={<CheckoutPage />} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                      </Routes>
                    </CustomerStorefrontLayout>
                  }
                />
              </Routes>

              <ToastContainer />
              <AuthModal />
            </BrowserRouter>
          </ToastProvider>
        </AuthProvider>
      </QueryClientProvider>
    </Provider>
  );
};

export default App;
