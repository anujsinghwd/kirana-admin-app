// src/context/CategoryContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { api } from '../api/api';

export interface Category { _id: string; name: string; description?: string; image?: string }

export type LoadingConfig  = {
    loading: boolean;
    text: string;
}

type CategoryContextType = {
    categories: Category[];
    loadingConfig: LoadingConfig;
    fetchCategories: () => Promise<void>;
    createCategory: (payload: FormData | Partial<Category>) => Promise<void>;
    updateCategory: (id: string, payload: FormData | Partial<Category>) => Promise<void>;
    deleteCategory: (id: string) => Promise<void>;
    deleteCategoryImage: (data: {id: string, image: string}) => void;
};

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);
export const useCategories = () => {
    const ctx = useContext(CategoryContext);
    if (!ctx) throw new Error('useCategories must be used within CategoryProvider');
    return ctx;
};

export const CategoryProvider = ({ children }: { children: ReactNode }) => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loadingConfig , setLoadingConfig] = useState<LoadingConfig>({loading: false, text: ''});

    const fetchCategories = async () => {
        setLoadingConfig({...loadingConfig, loading: true, text: 'Getting Categories...'});
        const res = await api.get('/categories');
        setCategories(res.data);
        setLoadingConfig({...loadingConfig, loading: false, text: ''});
    };

    const createCategory = async (payload: FormData | Partial<Category>) => {
        setLoadingConfig({...loadingConfig, loading: true, text: 'Adding Category...Please Wait'});
        const headers =
            payload instanceof FormData
                ? { 'Content-Type': 'multipart/form-data' }
                : { 'Content-Type': 'application/json' }

        await api.post('/categories', payload, {
            headers,
            onUploadProgress: (progressEvent) => {
                const total = progressEvent.total || 1
                const percent = Math.round((progressEvent.loaded * 100) / total)
            },
        })
        setLoadingConfig({...loadingConfig, loading: false, text: ''});
        await fetchCategories();
    };

    const updateCategory = async (id: string, payload: FormData | Partial<Category>) => {
        setLoadingConfig({...loadingConfig, loading: true, text: 'Updating Category...Please Wait'});
        const headers =
            payload instanceof FormData
                ? { 'Content-Type': 'multipart/form-data' }
                : { 'Content-Type': 'application/json' }

        await api.put(`/categories/${id}`, payload, {
            headers
        })

        setLoadingConfig({...loadingConfig, loading: false, text: ''});
        await fetchCategories();
    };

    const deleteCategory = async (id: string) => {
        setLoadingConfig({...loadingConfig, loading: true, text: 'Removing Category...Please Wait'});
        await api.delete(`/categories/${id}`);
        setLoadingConfig({...loadingConfig, loading: false, text: ''});
        await fetchCategories();
    };

    const deleteCategoryImage = async (data: { id: string, image: string }) => {
        setLoadingConfig({...loadingConfig, loading: true, text: 'Removing Image...Please Wait'});
        await api.put(`/categories/remove/image`, data);
        setLoadingConfig({...loadingConfig, loading: false, text: ''});
    };

    return (
        <CategoryContext.Provider value={{loadingConfig, categories, fetchCategories, createCategory, updateCategory, deleteCategory, deleteCategoryImage }}>
            {children}
        </CategoryContext.Provider>
    );
};
