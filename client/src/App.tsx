import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar/Navbar';
import { Footer } from './components/Footer/Footer';
import { ScrollToTop } from './components/Common/ScrollToTop';
import { ProductsPage } from './pages/Products/ProductsPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicy/PrivacyPolicyPage';
import { ReturnPolicyPage } from './pages/ReturnPolicy/ReturnPolicyPage';
import { AdminLoginPage } from './admin/pages/AdminLoginPage';
import { AdminDashboardPage } from './admin/pages/AdminDashboardPage';
import { AdminProtectedRoute } from './admin/components/AdminProtectedRoute';

export const App: React.FC = () => {
  const [activeCategory, setActiveCategory] = React.useState('Home');
  const [searchQuery, setSearchQuery] = React.useState('');

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Customer Storefront with Navbar and Footer */}
        <Route
          path="/"
          element={
            <div className="flex flex-col min-h-screen bg-transparent text-slate-700">
              <Navbar
                activeCategory={activeCategory}
                onSelectCategory={setActiveCategory}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
              />
              <main className="flex-1 pb-20 md:pb-0">
                <ProductsPage
                  activeCategory={activeCategory}
                  onCategoryChange={setActiveCategory}
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                />
              </main>
              <Footer />
            </div>
          }
        />

        {/* Customer Privacy Policy */}
        <Route
          path="/privacy-policy"
          element={
            <div className="flex flex-col min-h-screen bg-transparent text-slate-700">
              <main className="flex-1">
                <PrivacyPolicyPage />
              </main>
              <Footer />
            </div>
          }
        />

        {/* Customer Return & Refund Policy */}
        <Route
          path="/return-policy"
          element={
            <div className="flex flex-col min-h-screen bg-transparent text-slate-700">
              <main className="flex-1">
                <ReturnPolicyPage />
              </main>
              <Footer />
            </div>
          }
        />
        <Route path="/return-and-refund-policy" element={<Navigate to="/return-policy" replace />} />

        {/* Dedicated Admin Portal Routes */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route
          path="/admin"
          element={
            <AdminProtectedRoute>
              <AdminDashboardPage />
            </AdminProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
