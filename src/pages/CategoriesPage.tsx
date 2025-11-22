import React, { useState, useEffect, useMemo } from 'react'
import { FaCloudUploadAlt, FaPlus, FaEdit, FaTrash, FaSearch, FaImage, FaInfoCircle, FaFolder } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

import { useCategories } from '../context/CategoryContext'
import NoData from '../components/common/NoData'
import Loading from '../components/common/Loading'
import { useLockBodyScroll } from '../hooks/useLockBodyScroll'

const CategoriesPage = () => {
  const { loadingConfig, categories, fetchCategories, createCategory, updateCategory, deleteCategory, deleteCategoryImage } = useCategories()
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [name, setName] = useState('')
  const [desc, setDesc] = useState('')
  const [image, setImage] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Lock body scroll when modal is open
  useLockBodyScroll(showForm);

  useEffect(() => {
    fetchCategories().catch(console.error)
  }, [])

  const openCreate = () => {
    resetState()
    setShowForm(true)
  }

  const resetState = () => {
    setEditing(null)
    setName('')
    setDesc('')
    setFile(null);
    setImage(null);
  }

  const openEdit = (c: any) => {
    setEditing(c)
    setName(c.name)
    setDesc(c.description || '')
    setImage(c?.image || '')
    setShowForm(true)
  }

  const handleSubmit = async (data: FormData) => {
    try {
      if (editing) await updateCategory(editing._id, data);
      else await createCategory(data);
      setShowForm(false)
      resetState();
    } catch (err: any) {
      resetState();
      alert(err.response?.data?.message || err.message)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const selected = files[0];
    if (selected) {
      setFile(selected);
      setImage(URL.createObjectURL(selected));
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Create form data if image needs to be uploaded
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", desc);
    if (file) formData.append("image", file);
    handleSubmit(formData);
  }

  const handleRemoveImage = async () => {
    if (editing?._id && editing?.image) {
      const toRemoveImage = {
        id: editing._id,
        image: editing.image
      }

      await deleteCategoryImage(toRemoveImage);
    }
    setImage(null);
    setFile(null);
  };

  const handleCancelClick = () => {
    setShowForm(false);
    resetState();
  }

  // Filter categories based on search
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories;
    return categories.filter(c =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [categories, searchQuery]);

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Categories</h1>
            <p className="text-sm text-gray-500 mt-1">Manage your product categories</p>
          </div>
          <button
            onClick={openCreate}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all shadow-sm"
          >
            <FaPlus /> Add Category
          </button>
        </div>

        {/* Stats & Search Bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Stats Card */}
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FaFolder className="text-blue-600 text-xl" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
              <p className="text-sm text-gray-500">Total Categories</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 relative">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
            />
          </div>
        </div>
      </div>

      {loadingConfig.loading && (<Loading size={40} color="fill-blue-500" fullscreen={true} text={loadingConfig.text} />)}

      {/* Category Cards */}
      {filteredCategories.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center border-2 border-dashed border-gray-300">
          <FaFolder className="text-6xl text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 font-medium text-lg">
            {searchQuery ? 'No categories found' : 'No categories yet'}
          </p>
          <p className="text-sm text-gray-400 mt-2">
            {searchQuery ? 'Try a different search term' : 'Click "Add Category" to create your first category'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredCategories.map((c) => (
            <div
              key={c._id}
              className="bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden group"
            >
              {/* Image Section */}
              <div className="relative h-48 bg-gray-100 overflow-hidden">
                {c?.image ? (
                  <img
                    src={c.image}
                    alt={c.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                    <FaImage className="text-4xl mb-2" />
                    <span className="text-sm">No Image</span>
                  </div>
                )}

                {/* Quick Actions Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-3">
                  <button
                    onClick={() => openEdit(c)}
                    className="p-3 bg-white hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit category"
                  >
                    <FaEdit className="text-blue-600" />
                  </button>
                  <button
                    onClick={() => deleteCategory(c._id)}
                    className="p-3 bg-white hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete category"
                  >
                    <FaTrash className="text-red-600" />
                  </button>
                </div>
              </div>

              {/* Info Section */}
              <div className="p-4">
                <h3 className="font-bold text-gray-900 text-lg mb-1 truncate">{c.name}</h3>
                <p className="text-sm text-gray-500 line-clamp-2 min-h-[40px]">
                  {c.description || 'No description'}
                </p>

                {/* Mobile Actions */}
                <div className="flex gap-2 mt-4 sm:hidden">
                  <button
                    onClick={() => openEdit(c)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-sm font-medium transition-colors"
                  >
                    <FaEdit /> Edit
                  </button>
                  <button
                    onClick={() => deleteCategory(c._id)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg text-sm font-medium transition-colors"
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-0 md:p-4">
          <form
            onSubmit={onSubmit}
            className="bg-white w-full h-full md:h-auto md:max-h-[90vh] md:max-w-2xl rounded-none md:rounded-xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <FaFolder className="text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-lg text-gray-900">
                    {editing ? 'Edit Category' : 'Add Category'}
                  </h2>
                  <p className="text-gray-500 text-sm">
                    {editing ? 'Update category details' : 'Create a new category'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleCancelClick}
                className="w-8 h-8 hover:bg-gray-100 rounded-lg flex items-center justify-center transition-colors text-gray-600 hover:text-gray-900"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50">
              {/* Basic Info Section */}
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-4">
                  <FaInfoCircle className="text-blue-600" />
                  <h3 className="font-semibold text-gray-900">Basic Information</h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g., Groceries, Electronics"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={desc}
                      onChange={(e) => setDesc(e.target.value)}
                      placeholder="Describe this category..."
                      rows={3}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Image Section */}
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-4">
                  <FaImage className="text-green-600" />
                  <h3 className="font-semibold text-gray-900">Category Image</h3>
                </div>

                <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50">
                  {image ? (
                    <div className="relative">
                      <img
                        src={image}
                        alt="Preview"
                        className="w-48 h-48 object-cover rounded-lg border-2 border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-lg transition-colors"
                      >
                        <MdDelete className="text-lg" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center cursor-pointer group">
                      <div className="w-20 h-20 bg-blue-100 group-hover:bg-blue-200 rounded-full flex items-center justify-center mb-3 transition-colors">
                        <FaCloudUploadAlt className="text-3xl text-blue-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-700 mb-1">Upload Image</span>
                      <span className="text-xs text-gray-500">PNG, JPG up to 5MB</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex justify-end gap-3 shadow-lg">
              <button
                type="button"
                onClick={handleCancelClick}
                className="px-6 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!name.trim()}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm flex items-center gap-2"
              >
                <FaFolder />
                {editing ? 'Update Category' : 'Create Category'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

export default CategoriesPage
