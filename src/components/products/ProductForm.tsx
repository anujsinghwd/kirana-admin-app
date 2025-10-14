import React, { useState, useEffect } from 'react'
import { Product } from '../../context/ProductContext'
import { useProducts } from '../../context/ProductContext'

interface Category {
  _id: string
  name: string
}

interface ProductFormProps {
  initialData?: Product | null
  onSubmit: (data: FormData) => Promise<void>
  onCancel: () => void
  editing?: boolean
  categories?: Category[]
}

const ProductForm: React.FC<ProductFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  categories = []
}) => {
  const { uploadProgress } = useProducts()
  const empty = { name: '', description: '', price: 0, category: '', stock: 0, sku: '' }
  const [form, setForm] = useState<any>(empty)
  const [newImages, setNewImages] = useState<FileList | null>(null)
  const [previewUrls, setPreviewUrls] = useState<string[]>([])
  const [existingImages, setExistingImages] = useState<string[]>([])
  const [deletedImages, setDeletedImages] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  // ✅ Load initial data for editing
  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name,
        description: initialData.description || '',
        price: initialData.price,
        category: initialData.category?._id || initialData.category || '',
        stock: initialData.stock || 0,
        sku: initialData.sku || ''
      })
      setExistingImages(initialData.images || [])
    } else {
      setForm(empty)
      setExistingImages([])
    }
  }, [initialData])

  // ✅ Handle new file uploads
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      if (files.length > 3) {
        alert('You can upload a maximum of 3 images')
        return
      }
      setNewImages(files)
      const urls = Array.from(files).map(file => URL.createObjectURL(file))
      setPreviewUrls(urls)
    }
  }

  // ✅ Remove existing Cloudinary image
  const removeExistingImage = (url: string) => {
    setDeletedImages(prev => [...prev, url])
    setExistingImages(prev => prev.filter(img => img !== url))
  }

  // ✅ Remove newly uploaded (local) image
  const removeNewImage = (index: number) => {
    if (!newImages) return
    const filesArray = Array.from(newImages)
    filesArray.splice(index, 1)
    const dt = new DataTransfer()
    filesArray.forEach(f => dt.items.add(f))
    setNewImages(dt.files)
    setPreviewUrls(prev => prev.filter((_, i) => i !== index))
  }

  // ✅ Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData()
    formData.append('name', form.name)
    formData.append('description', form.description)
    formData.append('price', String(form.price))
    formData.append('category', form.category)
    formData.append('stock', String(form.stock))
    formData.append('sku', form.sku)

    if (newImages) Array.from(newImages).forEach(img => formData.append('images', img))

    if (deletedImages.length > 0)
      formData.append('deletedImages', JSON.stringify(deletedImages))

    try {
      await onSubmit(formData)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-[90%] max-w-md mx-auto"
      >
        <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800">
          {initialData ? 'Edit Product' : 'Add Product'}
        </h2>

        <div className="space-y-3">
          {/* Name */}
          <input
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            placeholder="Name"
            className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-2 focus:ring-blue-500"
          />

          {/* Description */}
          <textarea
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            placeholder="Description"
            className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-2 focus:ring-blue-500"
          />

          {/* Price */}
          <input
            value={form.price}
            onChange={e => setForm({ ...form, price: +e.target.value })}
            type="number"
            placeholder="Price"
            className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-2 focus:ring-blue-500"
          />

          {/* ✅ Category Selector */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>

            <button
              type="button"
              onClick={() => setForm({ ...form, showDropdown: !form.showDropdown })}
              className="w-full text-left border border-gray-300 rounded p-2 text-sm bg-white focus:ring-2 focus:ring-blue-500"
            >
              {categories.find(c => c._id === form.category)?.name || 'Select category'}
            </button>
            {form.showDropdown && (
              <ul className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded shadow mt-1 max-h-40 overflow-auto z-50">
                {categories.map((c: any) => (
                  <li
                    key={c._id}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                    onClick={() => setForm({ ...form, category: c._id, showDropdown: false })}
                  >
                    {c.name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Existing Images */}
          {existingImages.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Existing Images
              </label>
              <div className="flex gap-2">
                {existingImages.map((url, i) => (
                  <div key={i} className="relative">
                    <img
                      src={url}
                      alt="existing"
                      className="w-16 h-20 object-cover rounded border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(url)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* New Uploads */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload New Images (Max 3)
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-2 focus:ring-blue-500"
            />
            {previewUrls.length > 0 && (
              <div className="flex gap-2 mt-3 overflow-x-auto">
                {previewUrls.map((url, i) => (
                  <div key={i} className="relative">
                    <img
                      src={url}
                      alt="preview"
                      className="w-16 h-16 object-cover rounded border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => removeNewImage(i)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Stock */}
          <input
            value={form.stock}
            onChange={e => setForm({ ...form, stock: +e.target.value })}
            type="number"
            placeholder="Stock"
            className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-2 focus:ring-blue-500"
          />

          {/* SKU */}
          <input
            value={form.sku}
            onChange={e => setForm({ ...form, sku: e.target.value })}
            placeholder="SKU"
            className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Upload Progress Bar */}
        {uploadProgress > 0 && (
          <div className="w-full mt-3 bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-blue-600 h-2 transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        )}

        <div className="flex justify-end gap-2 mt-5">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 border rounded hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default ProductForm;