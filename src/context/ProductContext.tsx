import React, { createContext, useContext, useState, ReactNode } from 'react'
import { api } from '../api/api'

export interface Product {
  _id: string
  name: string
  description?: string
  price: number
  category: string | any
  images?: string[]
  stock?: number
  sku?: string
}

type ProductContextType = {
  products: Product[]
  uploadProgress: number
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

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products')
      setProducts(res.data)
    } catch (err: any) {
      console.error('Error fetching products:', err.message)
    }
  }

  /**
   * 🔹 Create Product with upload progress tracking
   */
  const createProduct = async (payload: FormData | Partial<Product>) => {
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
  }

  /**
   * 🔹 Update Product with progress
   */
  const updateProduct = async (id: string, payload: FormData | Partial<Product>) => {
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
  }

  const deleteProduct = async (id: string) => {
    try {
      await api.delete(`/products/${id}`)
      await fetchProducts()
    } catch (err: any) {
      console.error('Error deleting product:', err.message)
      throw err
    }
  }

  return (
    <ProductContext.Provider
      value={{
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
