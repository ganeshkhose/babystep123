import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar/Navbar';
import { Footer } from './components/Footer/Footer';
import { ProductsPage } from './pages/Products/ProductsPage';


export const App: React.FC = () => {
  const [activeCategory, setActiveCategory] = React.useState('Home');
  const [searchQuery, setSearchQuery] = React.useState('');

  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen bg-transparent text-slate-700">
        <Navbar
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        <main className="flex-1 pb-20 md:pb-0">
          <Routes>
            <Route
              path="/"
              element={
                <ProductsPage
                  activeCategory={activeCategory}
                  onCategoryChange={setActiveCategory}
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                />
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;
