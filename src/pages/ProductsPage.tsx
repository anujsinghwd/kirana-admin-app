import React, { useState, useEffect, useCallback } from 'react';
import { useProducts } from '../context/ProductContext';
import { useCategories } from '../context/CategoryContext';
import ProductForm from '../components/products/ProductForm';
import ProductCard from '../components/products/ProductCard';
import ProductCardAdmin from '../components/products/Card';
import NoData from '../components/common/NoData';
import Loading from '../components/common/Loading';

const ProductsPage = () => {
  const { loadingConfig, products, fetchProducts, createProduct, updateProduct, deleteProduct } = useProducts()
  const { categories, fetchCategories } = useCategories()
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<any>(null)

  const empty = { name: '', description: '', price: 0, category: '', images: [], stock: 0, sku: '' }
  const [form, setForm] = useState<any>(empty)

  useEffect(() => {
    fetchProducts().catch(console.error)
    fetchCategories().catch(console.error)
  }, [])

  const openCreate = () => {
    setEditing(null)
    setForm(empty)
    setShowForm(true)
  }

  const openEdit = (p: any) => {
    setEditing(p)
    setForm({ ...p, images: p.images?.join(', ') || '' })
    setShowForm(true)
  }

  const handleSubmit = async (formData: FormData) => {
    try {
      if (editing) {
        await updateProduct(editing._id, formData);
      } else {
        await createProduct(formData)
      }
      setShowForm(false)
    } catch (err: any) {
      alert(err.response?.data?.message || err.message)
    }
  }

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Products</h1>
        <button
          onClick={openCreate}
          className="w-full sm:w-auto px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-all"
        >
          Add Product
        </button>
      </div>
      {loadingConfig.loading && (<Loading size={40} fullscreen={true} color="fill-blue-500" text={loadingConfig.text} />)}
      {/* Product Cards */}
      {products.length === 0 ? (
        <NoData />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((p) => (
            <ProductCard
              key={p._id}
              product={p}
              onEdit={openEdit}
              onDelete={deleteProduct}
            />
          ))}
        </div>
      )}

      {/* Modal Form */}
      {showForm && (
        <ProductForm
          initialData={editing}
          onSubmit={handleSubmit}
          onCancel={() => setShowForm(false)}
          categories={categories}
        />
      )}
    </div>
  )
}

export default ProductsPage
