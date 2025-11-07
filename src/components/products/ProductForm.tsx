import React, { useState, useEffect } from 'react'
import { Product } from '../../context/ProductContext'
import { useProducts } from '../../context/ProductContext'
import { useSubCategories } from "../../context/SubCategoryContext";
import { appendIfExists } from '../../utils/utils'

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

  const { fetchSubCategoriesByCategory, subCategories } = useSubCategories();
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>("");

  const { uploadProgress } = useProducts()
  const empty = { name: '', description: '', price: 0, category: '', stock: 0, sku: '', subcategory: '' }
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
        sku: initialData.sku || '',
        unit: initialData.unit || 0,
        offerPrice: initialData.offerPrice || 0,
        discount: initialData.discount || 0
      })
      setExistingImages(initialData.images || [])
    } else {
      setForm(empty)
      setExistingImages([])
    }
  }, [initialData])

  // ✅ Fetch subcategories whenever category changes
  useEffect(() => {
    if (form.category) {
      fetchSubCategoriesByCategory(form.category).catch(console.error);
    }
  }, [form.category]);

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
    formData.append('price', String(form.price))
    formData.append('category', form.category)
    formData.append('subcategory', form.subcategory)

    appendIfExists(formData, 'description', form.description)
    appendIfExists(formData, 'stock', form.stock)
    appendIfExists(formData, 'unit', form.unit)
    appendIfExists(formData, 'offerPrice', form.offerPrice)
    appendIfExists(formData, 'sku', form.sku)
    appendIfExists(formData, 'discount', form.discount)

    if (newImages) Array.from(newImages).forEach(img => formData.append('images', img))

    if (deletedImages.length > 0)
      formData.append('deletedImages', JSON.stringify(deletedImages))
    // console.log(formData);return;
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
        className="
      bg-white 
      w-full 
      h-screen                 /* full viewport height on small screens */
      md:h-[90vh]              /* slightly smaller than viewport on desktop */
      md:max-w-3xl 
      md:rounded-lg 
      shadow-lg 
      flex flex-col
      overflow-hidden
      md:mx-auto
      transition-all duration-300
    "
        style={{ maxHeight: '100vh' }} /* extra safety */
      >
        {/* Header (sticky) */}
        <header className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center z-10">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
            {initialData ? 'Edit Product' : 'Add Product'}
          </h2>
          <button
            type="button"
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700 md:hidden"
          >
            ✕
          </button>
        </header>

        {/* Body: scrollable */}
        <div className="flex-1 min-h-0 overflow-y-auto px-4 sm:px-6 py-4">
          {/* Grid: 1 column mobile, 2 columns desktop */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Name (col 1) */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="Name"
                className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Price (col 2) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
              <input
                value={form.price}
                onChange={e => setForm({ ...form, price: +e.target.value })}
                type="number"
                placeholder="Price"
                className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Description (span 2) */}
            <div className="md:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                placeholder="Description"
                className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-2 focus:ring-blue-500"
                rows={4}
              />
            </div>

            {/* Category (col 1) */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>

              <button
                type="button"
                onClick={() => setForm({ ...form, showDropdown: !form.showDropdown })}
                className="w-full text-left border border-gray-300 rounded p-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 relative"
              >
                {categories.find(c => c._id === form.category)?.name || 'Select category'}
              </button>

              {form.showDropdown && (
                <ul
                  className="
        absolute left-0 w-full
        bg-white border border-gray-200 rounded-md shadow-md
        mt-1 max-h-48 overflow-auto z-50
      "
                >
                  {categories.map((c: any) => (
                    <li
                      key={c._id}
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                      onClick={() =>
                        setForm({
                          ...form,
                          category: c._id,
                          showDropdown: false,
                        })
                      }
                    >
                      {c.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Subcategory (col 2) */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subcategory
              </label>

              <button
                type="button"
                onClick={() => setForm({ ...form, showSubDropdown: !form.showSubDropdown })}
                className="w-full text-left border border-gray-300 rounded p-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 relative"
              >
                {subCategories.find((s) => s._id === selectedSubCategory)?.name ||
                  'Select subcategory'}
              </button>

              {form.showSubDropdown && (
                <ul
                  className="
        absolute left-0 w-full
        bg-white border border-gray-200 rounded-md shadow-md
        mt-1 max-h-48 overflow-auto z-50
      "
                >
                  {subCategories.map((s) => (
                    <li
                      key={s._id}
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                      onClick={() => {
                        setSelectedSubCategory(s._id);
                        setForm({
                          ...form,
                          subcategory: s._id,
                          showSubDropdown: false,
                        });
                      }}
                    >
                      {s.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>


            {/* Existing Images (span 2) */}
            <div className="md:col-span-2">
              {existingImages.length > 0 && (
                <>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Existing Images
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {existingImages.map((url, i) => (
                      <div key={i} className="relative">
                        <img
                          src={url}
                          alt="existing"
                          className="w-20 h-20 object-cover rounded border border-gray-200"
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
                </>
              )}
            </div>

            {/* File Upload (span 2) */}
            <div className="md:col-span-2">
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

            {/* Stock (col 1) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
              <input
                value={form.stock}
                onChange={e => setForm({ ...form, stock: +e.target.value })}
                type="text"
                placeholder="Stock"
                className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Offer Price (col 2) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Offer Price</label>
              <input
                value={form.offerPrice}
                onChange={e => setForm({ ...form, offerPrice: e.target.value })}
                name="offerPrice"
                placeholder="Offer Price"
                className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Discount (col 1) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Discount</label>
              <input
                value={form.discount}
                onChange={e => setForm({ ...form, discount: e.target.value })}
                placeholder="Discount"
                name="discount"
                className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Unit (col 2) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
              <input
                value={form.unit}
                onChange={e => setForm({ ...form, unit: e.target.value })}
                placeholder="Unit"
                className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* SKU (span 2) */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
              <input
                value={form.sku}
                onChange={e => setForm({ ...form, sku: e.target.value })}
                placeholder="SKU"
                className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="sticky bottom-0 bg-white border-t border-gray-200 p-3 flex justify-end gap-2 z-10">
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
        </footer>
      </form>
    </div>

  )
}

export default ProductForm;