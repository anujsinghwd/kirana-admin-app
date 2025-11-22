import React, { createContext, useContext, useState, ReactNode } from 'react'
import { api } from '../api/api'
import { LoadingConfig } from './CategoryContext';

export interface IShelfLife {
  duration?: number;
  unit?: "days" | "months" | "years";
  manufacturingDate?: string; // ISO date string for frontend
  expiryDate?: string;        // ISO date string for frontend
  bestBefore?: string;
}

export interface IProductVariant {
  unitValue: number;
  unitType: "gm" | "kg" | "ml" | "ltr" | "piece" | "packet" | "box";
  price: number;
  offerPrice?: number;
  discount?: number;
  stock: number;
  sku?: string;
  shelfLife?: IShelfLife;
}

export interface LooseConfig {
  unitType: string;
  pricePerUnit: number;
  availableQty: number;
  minQtyAllowed: number;
  stepQty: number;
}

export interface Product {
  _id: string;
  name: string;
  description?: string;
  category: string | { _id: string; name: string };
  subcategory: string | { _id: string; name: string };
  images: string[];
  variants: IProductVariant[];
  published: boolean;
  isLoose?: boolean;
  looseConfig?: LooseConfig;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

type ProductContextType = {
  products: Product[]
  uploadProgress: number
  loadingConfig: LoadingConfig
  pagination: PaginationData
  fetchProducts: (page?: number, limit?: number, category?: string, search?: string) => Promise<void>
  createProduct: (payload: FormData | Partial<Product>) => Promise<void>
  updateProduct: (id: string, payload: FormData | Partial<Product>) => Promise<void>
  deleteProduct: (id: string) => Promise<void>
}

const ProductContext = createContext<ProductContextType | undefined>(undefined)

export const useProducts = () => {
  const ctx = useContext(ProductContext)
  if (!ctx) throw new Error('useProducts must be used within ProductProvider')
  return ctx
}

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([])
  const [uploadProgress, setUploadProgress] = useState<number>(0)
  const [loadingConfig, setLoadingConfig] = useState<LoadingConfig>({ loading: false, text: '' })
  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  })

  const fetchProducts = async (page: number = 1, limit: number = 10, category?: string, search?: string) => {
    setLoadingConfig({ ...loadingConfig, loading: true, text: 'Getting Products...' });
    try {
      const params: any = { page, limit };
      if (category) {
        params.category = category;
      }
      if (search) {
        params.q = search;
      }

      const res = await api.get('/products', { params })
      setProducts(res.data.data)

      // Update pagination data if provided by backend
      if (res.data.pagination) {
        setPagination(res.data.pagination)
      } else {
        // Fallback if backend doesn't return pagination data
        setPagination({
          currentPage: page,
          totalPages: 1,
          totalItems: res.data.data.length,
          itemsPerPage: limit
        })
      }
    } catch (err: any) {
      console.error('Error fetching products:', err.message)
    }
    setLoadingConfig({ ...loadingConfig, loading: false, text: '' });
  }

  /**
   * 🔹 Create Product with upload progress tracking
   */
  const createProduct = async (payload: FormData | Partial<Product>) => {
    setLoadingConfig({ ...loadingConfig, loading: true, text: 'Adding Product...Please wait' });
    try {
      const headers =
        payload instanceof FormData
          ? { 'Content-Type': 'multipart/form-data' }
          : { 'Content-Type': 'application/json' }

      setUploadProgress(0)

      await api.post('/products', payload, {
        headers,
        onUploadProgress: (progressEvent) => {
          const total = progressEvent.total || 1
          const percent = Math.round((progressEvent.loaded * 100) / total)
          setUploadProgress(percent)
        },
      })

      await fetchProducts()
      setUploadProgress(0)
    } catch (err: any) {
      console.error('Error creating product:', err.message)
      setUploadProgress(0)
      throw err
    }
    setLoadingConfig({ ...loadingConfig, loading: false, text: '' });
  }

  /**
   * 🔹 Update Product with progress
   */
  const updateProduct = async (id: string, payload: FormData | Partial<Product>) => {
    setLoadingConfig({ ...loadingConfig, loading: true, text: 'Update Product...Please wait' });
    try {
      const headers =
        payload instanceof FormData
          ? { 'Content-Type': 'multipart/form-data' }
          : { 'Content-Type': 'application/json' }

      setUploadProgress(0)

      await api.put(`/products/${id}`, payload, {
        headers,
        onUploadProgress: (progressEvent) => {
          const total = progressEvent.total || 1
          const percent = Math.round((progressEvent.loaded * 100) / total)
          setUploadProgress(percent)
        },
      })

      await fetchProducts()
      setUploadProgress(0)
    } catch (err: any) {
      console.error('Error updating product:', err.message)
      setUploadProgress(0)
      throw err
    }
    setLoadingConfig({ ...loadingConfig, loading: false, text: '' });
  }

  const deleteProduct = async (id: string) => {
    setLoadingConfig({ ...loadingConfig, loading: true, text: 'Removing Product...Please wait' });
    try {
      await api.delete(`/products/${id}`)
      await fetchProducts()
    } catch (err: any) {
      console.error('Error deleting product:', err.message)
      throw err
    }
    setLoadingConfig({ ...loadingConfig, loading: false, text: '' });
  }

  return (
    <ProductContext.Provider
      value={{
        loadingConfig,
        products,
        uploadProgress,
        pagination,
        fetchProducts,
        createProduct,
        updateProduct,
        deleteProduct,
      }}
    >
      {children}
    </ProductContext.Provider>
  )
}
