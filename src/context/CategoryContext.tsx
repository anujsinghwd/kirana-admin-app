// src/context/CategoryContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { api } from '../api/api';

export interface Category { _id: string; name: string; description?: string; }

type CategoryContextType = {
    categories: Category[];
    fetchCategories: () => Promise<void>;
    createCategory: (payload: Partial<Category>) => Promise<void>;
    updateCategory: (id: string, payload: Partial<Category>) => Promise<void>;
    deleteCategory: (id: string) => Promise<void>;
};

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);
export const useCategories = () => {
    const ctx = useContext(CategoryContext);
    if (!ctx) throw new Error('useCategories must be used within CategoryProvider');
    return ctx;
};

export const CategoryProvider = ({ children }: { children: ReactNode }) => {
    const [categories, setCategories] = useState<Category[]>([]);

    const fetchCategories = async () => {
        const res = await api.get('/categories');
        setCategories(res.data);
    };

    const createCategory = async (payload: Partial<Category>) => {
        await api.post('/categories', payload);
        await fetchCategories();
    };

    const updateCategory = async (id: string, payload: Partial<Category>) => {
        await api.put(`/categories/${id}`, payload);
        await fetchCategories();
    };

    const deleteCategory = async (id: string) => {
        await api.delete(`/categories/${id}`);
        await fetchCategories();
    };

    return (
        <CategoryContext.Provider value={{ categories, fetchCategories, createCategory, updateCategory, deleteCategory }}>
            {children}
        </CategoryContext.Provider>
    );
};
