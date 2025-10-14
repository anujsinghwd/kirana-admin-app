// src/context/ProductContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { api } from '../api/api';

export interface Product {
    _id: string;
    name: string;
    description?: string;
    price: number;
    category: string | any;
    images?: string[];
    stock?: number;
    sku?: string;
}

type ProductContextType = {
    products: Product[];
    fetchProducts: () => Promise<void>;
    createProduct: (payload: Partial<Product>) => Promise<void>;
    updateProduct: (id: string, payload: Partial<Product>) => Promise<void>;
    deleteProduct: (id: string) => Promise<void>;
};

const ProductContext = createContext<ProductContextType | undefined>(undefined);
export const useProducts = () => {
    const ctx = useContext(ProductContext);
    if (!ctx) throw new Error('useProducts must be used within ProductProvider');
    return ctx;
};

export const ProductProvider = ({ children }: { children: ReactNode }) => {
    const [products, setProducts] = useState<Product[]>([]);

    const fetchProducts = async () => {
        const res = await api.get('/products');
        setProducts(res.data);
    };

    const createProduct = async (payload: Partial<Product>) => {
        await api.post('/products', payload);
        await fetchProducts();
    };

    const updateProduct = async (id: string, payload: Partial<Product>) => {
        await api.put(`/products/${id}`, payload);
        await fetchProducts();
    };

    const deleteProduct = async (id: string) => {
        await api.delete(`/products/${id}`);
        await fetchProducts();
    };

    return (
        <ProductContext.Provider value={{ products, fetchProducts, createProduct, updateProduct, deleteProduct }}>
            {children}
        </ProductContext.Provider>
    );
};
