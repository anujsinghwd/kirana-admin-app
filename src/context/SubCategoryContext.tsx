import React, { createContext, useContext, useState, ReactNode } from 'react';
import { api } from '../api/api';

// 🧩 Define interface for SubCategory
export interface SubCategory {
  _id: string;
  name: string;
  image: string;
  category: { _id: string; name: string }[];
}

export type LoadingConfig = {
  loading: boolean;
  text: string;
};

// 🧠 Define context type
type SubCategoryContextType = {
  subCategories: SubCategory[];
  loadingConfig: LoadingConfig;
  fetchSubCategories: () => Promise<void>;
  fetchSubCategoriesByCategory: (categoryId: string) => Promise<void>;
  createSubCategory: (payload: FormData | Partial<SubCategory>) => Promise<void>;
  updateSubCategory: (id: string, payload: FormData | Partial<SubCategory>) => Promise<void>;
  deleteSubCategory: (id: string) => Promise<void>;
  deleteSubCategoryImage: (data: { id: string; image: string }) => Promise<void>;
};

// 🪄 Create Context
const SubCategoryContext = createContext<SubCategoryContextType | undefined>(undefined);

// 🧩 Hook for easy access
export const useSubCategories = () => {
  const ctx = useContext(SubCategoryContext);
  if (!ctx) throw new Error('useSubCategories must be used within SubCategoryProvider');
  return ctx;
};

// 🏗️ Provider
export const SubCategoryProvider = ({ children }: { children: ReactNode }) => {
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [loadingConfig, setLoadingConfig] = useState<LoadingConfig>({ loading: false, text: '' });

  // 🔹 Fetch all subcategories
  const fetchSubCategories = async () => {
    setLoadingConfig({ loading: true, text: 'Getting Subcategories...' });
    try {
      const res = await api.get('/subcategories');
      setSubCategories(res.data);
    } finally {
      setLoadingConfig({ loading: false, text: '' });
    }
  };

  // 🔹 Create new subcategory
  const createSubCategory = async (payload: FormData | Partial<SubCategory>) => {
    setLoadingConfig({ loading: true, text: 'Adding Subcategory...Please Wait' });
    const headers =
      payload instanceof FormData
        ? { 'Content-Type': 'multipart/form-data' }
        : { 'Content-Type': 'application/json' };

    try {
      await api.post('/subcategories', payload, { headers });
      await fetchSubCategories();
    } finally {
      setLoadingConfig({ loading: false, text: '' });
    }
  };

  // 🔹 Update subcategory
  const updateSubCategory = async (id: string, payload: FormData | Partial<SubCategory>) => {
    setLoadingConfig({ loading: true, text: 'Updating Subcategory...Please Wait' });
    const headers =
      payload instanceof FormData
        ? { 'Content-Type': 'multipart/form-data' }
        : { 'Content-Type': 'application/json' };

    try {
      await api.put(`/subcategories/${id}`, payload, { headers });
      await fetchSubCategories();
    } finally {
      setLoadingConfig({ loading: false, text: '' });
    }
  };

  // 🔹 Delete subcategory
  const deleteSubCategory = async (id: string) => {
    setLoadingConfig({ loading: true, text: 'Removing Subcategory...Please Wait' });
    try {
      await api.delete(`/subcategories/${id}`);
      await fetchSubCategories();
    } finally {
      setLoadingConfig({ loading: false, text: '' });
    }
  };

  // 🔹 Delete subcategory image
  const deleteSubCategoryImage = async (data: { id: string; image: string }) => {
    setLoadingConfig({ loading: true, text: 'Removing Image...Please Wait' });
    try {
      await api.put(`/subcategories/remove/image`, data);
      await fetchSubCategories();
    } finally {
      setLoadingConfig({ loading: false, text: '' });
    }
  };

  // 🔹 Fetch Subcategories by Category ID
  const fetchSubCategoriesByCategory = async (categoryId: string) => {
    setLoadingConfig({ loading: true, text: 'Fetching Subcategories...Please Wait' });
    try {
      const res = await api.get(`/subcategories/category/${categoryId}`);
      setSubCategories(res.data);
    } finally {
      setLoadingConfig({ loading: false, text: '' });
    }
  };

  return (
    <SubCategoryContext.Provider
      value={{
        loadingConfig,
        subCategories,
        fetchSubCategories,
        createSubCategory,
        updateSubCategory,
        deleteSubCategory,
        deleteSubCategoryImage,
        fetchSubCategoriesByCategory
      }}
    >
      {children}
    </SubCategoryContext.Provider>
  );
};
