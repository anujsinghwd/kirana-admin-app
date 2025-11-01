import React, { createContext, useContext, useState, ReactNode } from 'react'
import { api } from '../api/api'
import { LoadingConfig } from './CategoryContext';

export interface Product {
  _id: string;
  name: string;
  description?: string;
  price: number;
  category: string | any;
  subcategory: string | any;
  images?: string[];
  stock?: number;
  sku?: string;
  unit?: string;
  discount?: number;
  offerPrice?: number;
}

type ProductContextType = {
  products: Product[]
  uploadProgress: number
  loadingConfig: LoadingConfig
  fetchProducts: () => Promise<void>
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
  const [loadingConfig, setLoadingConfig] = useState<LoadingConfig>({loading: false, text: ''})

  const fetchProducts = async () => {
    setLoadingConfig({...loadingConfig, loading: true, text: 'Getting Products...'});
    try {
      const res = await api.get('/products')
      setProducts(res.data)
    } catch (err: any) {
      console.error('Error fetching products:', err.message)
    }
    setLoadingConfig({...loadingConfig, loading: false, text: ''});
  }

  /**
   * 🔹 Create Product with upload progress tracking
   */
  const createProduct = async (payload: FormData | Partial<Product>) => {
    setLoadingConfig({...loadingConfig, loading: true, text: 'Adding Product...Please wait'});
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
    setLoadingConfig({...loadingConfig, loading: false, text: ''});
  }

  /**
   * 🔹 Update Product with progress
   */
  const updateProduct = async (id: string, payload: FormData | Partial<Product>) => {
    setLoadingConfig({...loadingConfig, loading: true, text: 'Update Product...Please wait'});
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
    setLoadingConfig({...loadingConfig, loading: false, text: ''});
  }

  const deleteProduct = async (id: string) => {
    setLoadingConfig({...loadingConfig, loading: true, text: 'Removing Product...Please wait'});
    try {
      await api.delete(`/products/${id}`)
      await fetchProducts()
    } catch (err: any) {
      console.error('Error deleting product:', err.message)
      throw err
    }
    setLoadingConfig({...loadingConfig, loading: false, text: ''});
  }

  return (
    <ProductContext.Provider
      value={{
        loadingConfig,
        products,
        uploadProgress,
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
