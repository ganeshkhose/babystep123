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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export const App: React.FC = () => {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ToastProvider>
            <BrowserRouter>
              <div className="flex flex-col min-h-screen bg-[#F5ECF3] text-slate-700">
                <Navbar />

                <main className="flex-1 pb-20 md:pb-0">
                  <Routes>
                    <Route path="/" element={<ProductsPage />} />
                    <Route path="/products/:productId" element={<ProductDetailsPage />} />
                    <Route path="/bag" element={<BagPage />} />
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </main>

                <Footer />
                <ToastContainer />
                <AuthModal />
              </div>
            </BrowserRouter>
          </ToastProvider>
        </AuthProvider>
      </QueryClientProvider>
    </Provider>
  );
};

export default App;
