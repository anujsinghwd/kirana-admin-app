// src/App.tsx (example)
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProductProvider } from './context/ProductContext';
import { CategoryProvider } from './context/CategoryContext';

import LoginPage from './pages/LoginPage';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';
import ProductsPage from './pages/ProductsPage';
import CategoriesPage from './pages/CategoriesPage';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <AuthProvider>
      <ProductProvider>
        <CategoryProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
              <Route index element={<Dashboard />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="products" element={<ProductsPage />} />
              <Route path="categories" element={<CategoriesPage />} />
            </Route>
          </Routes>
        </CategoryProvider>
      </ProductProvider>
    </AuthProvider>
  );
}
