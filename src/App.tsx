// src/App.tsx (example)
import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProductProvider } from './context/ProductContext';
import { CategoryProvider } from './context/CategoryContext';

import LoginPage from './pages/LoginPage';
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/ProtectedRoute';

const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const CategoriesPage = React.lazy(() => import('./pages/CategoriesPage'));
const ProductsPage = React.lazy(() => import('./pages/ProductsPage'));

export default function App() {
  return (
    <AuthProvider>
      <ProductProvider>
        <CategoryProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
              <Route index element={
                <Suspense fallback={<p>Loading...</p>}>
                  <Dashboard />
                </Suspense>
              } />
              <Route path="dashboard" element={<Suspense fallback={<p>Loading...</p>}><Dashboard /></Suspense>} />
              <Route path="products" element={<Suspense fallback={<p>Loading...</p>}><ProductsPage /></Suspense>} />
              <Route path="categories" element={<Suspense fallback={<p>Loading...</p>}><CategoriesPage /></Suspense>} />
            </Route>
          </Routes>
        </CategoryProvider>
      </ProductProvider>
    </AuthProvider>
  );
}
