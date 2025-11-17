// src/App.tsx (example)
import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProductProvider } from './context/ProductContext';
import { CategoryProvider } from './context/CategoryContext';

import LoginPage from './pages/LoginPage';
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Loading from './components/common/Loading';
import SubCategoriesPage from './pages/SubCategoryPage';
import { SubCategoryProvider } from './context/SubCategoryContext';
import { OrderProvider } from "./context/OrderContext";

import AdminOrdersPage from './pages/OrderPage';
import InvoicePage from './pages/order/InvoicePage';
import OrderDetailPage from './pages/order/OrderDetail';

const Dashboard = React.lazy(() => import('./pages/dashboard/Dashboard'));
const CategoriesPage = React.lazy(() => import('./pages/CategoriesPage'));
const ProductsPage = React.lazy(() => import('./pages/ProductsPage'));

export default function App() {
  return (
    <AuthProvider>
      <ProductProvider>
        <CategoryProvider>
          <SubCategoryProvider>
            <OrderProvider>
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                  <Route index element={
                    <Suspense fallback={<Loading />}>
                      <Dashboard />
                    </Suspense>
                  } />
                  <Route path="dashboard" element={<Suspense fallback={<Loading />}><Dashboard /></Suspense>} />
                  <Route path="products" element={<Suspense fallback={<Loading />}><ProductsPage /></Suspense>} />
                  <Route path="categories" element={<Suspense fallback={<Loading />}><CategoriesPage /></Suspense>} />
                  <Route path="sub-categories" element={<Suspense fallback={<Loading />}><SubCategoriesPage /></Suspense>} />
                  <Route path="orders" element={<ProtectedRoute><AdminOrdersPage /></ProtectedRoute>} />
                  <Route path="/invoice/:orderId" element={<InvoicePage />} />
                  <Route path="/orders/:orderId" element={<OrderDetailPage />} />
                </Route>
              </Routes>
            </OrderProvider>
          </SubCategoryProvider>
        </CategoryProvider>
      </ProductProvider>
    </AuthProvider>
  );
}
