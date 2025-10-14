import React, { useState, useEffect } from 'react'
import { useProducts } from '../context/ProductContext'

const ProductsPage = () => {
  const { products, fetchProducts, createProduct, updateProduct, deleteProduct } = useProducts()
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<any>(null)

  const empty = { name: '', description: '', price: 0, category: '', images: [], stock: 0, sku: '' }
  const [form, setForm] = useState<any>(empty)

  useEffect(() => {
    fetchProducts().catch(console.error)
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const payload = {
      ...form,
      images:
        typeof form.images === 'string'
          ? form.images.split(',').map((s: string) => s.trim()).filter(Boolean)
          : form.images,
    }
    try {
      if (editing) await updateProduct(editing._id, payload)
      else await createProduct(payload)
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

      {/* Product Cards */}
      {products.length === 0 ? (
        <div className="text-center text-gray-500 mt-8">No products available.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((p) => (
            <div
              key={p._id}
              className="bg-white border border-gray-100 rounded-xl shadow-sm p-4 relative hover:shadow-md transition-all"
            >
              <div className="font-semibold text-gray-900 text-base">{p.name}</div>
              <div className="text-sm text-gray-500 mt-1 line-clamp-2">{p.description}</div>

              <div className="mt-2 flex justify-between items-center">
                <span className="text-gray-800 font-medium">₹{p.price}</span>
                <span className="text-xs text-gray-400">Stock: {p.stock}</span>
              </div>

              <div className="flex justify-end space-x-2 mt-3">
                <button
                  onClick={() => openEdit(p)}
                  className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded text-xs"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteProduct(p._id)}
                  className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-xs"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-[90%] max-w-md mx-auto"
          >
            <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800">
              {editing ? 'Edit Product' : 'Add Product'}
            </h2>

            {/* Inputs */}
            <div className="space-y-3">
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Name"
                className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-2 focus:ring-blue-500"
              />
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Description"
                className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-2 focus:ring-blue-500"
              />
              <input
                value={form.price}
                onChange={(e) => setForm({ ...form, price: +e.target.value })}
                type="number"
                placeholder="Price"
                className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-2 focus:ring-blue-500"
              />
              <input
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                placeholder="Category ID"
                className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-2 focus:ring-blue-500"
              />
              <input
                value={form.images}
                onChange={(e) => setForm({ ...form, images: e.target.value })}
                placeholder="Images (comma separated)"
                className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-2 focus:ring-blue-500"
              />
              <input
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: +e.target.value })}
                type="number"
                placeholder="Stock"
                className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-2 focus:ring-blue-500"
              />
              <input
                value={form.sku}
                onChange={(e) => setForm({ ...form, sku: e.target.value })}
                placeholder="SKU"
                className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-2 mt-5">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-gray-700 border rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

export default ProductsPage
