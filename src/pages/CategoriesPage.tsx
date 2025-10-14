import React, { useState, useEffect } from 'react'
import { useCategories } from '../context/CategoryContext'

const CategoriesPage = () => {
  const { categories, fetchCategories, createCategory, updateCategory, deleteCategory } = useCategories()
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [name, setName] = useState('')
  const [desc, setDesc] = useState('')

  useEffect(() => {
    fetchCategories().catch(console.error)
  }, [])

  const openCreate = () => {
    setEditing(null)
    setName('')
    setDesc('')
    setShowForm(true)
  }

  const openEdit = (c: any) => {
    setEditing(c)
    setName(c.name)
    setDesc(c.description || '')
    setShowForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editing) await updateCategory(editing._id, { name, description: desc })
      else await createCategory({ name, description: desc })
      setShowForm(false)
    } catch (err: any) {
      alert(err.response?.data?.message || err.message)
    }
  }

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Categories</h1>
        <button
          onClick={openCreate}
          className="w-full sm:w-auto px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-all"
        >
          Add Category
        </button>
      </div>

      {/* Category Cards */}
      {categories.length === 0 ? (
        <div className="text-center text-gray-500 mt-8">No categories available.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((c) => (
            <div
              key={c._id}
              className="bg-white border border-gray-100 rounded-xl shadow-sm p-4 relative hover:shadow-md transition-all"
            >
              <div className="font-semibold text-gray-900 text-base">{c.name}</div>
              <div className="text-sm text-gray-500 mt-1 line-clamp-2">{c.description}</div>

              <div className="flex justify-end space-x-2 mt-3">
                <button
                  onClick={() => openEdit(c)}
                  className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded text-xs"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteCategory(c._id)}
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
              {editing ? 'Edit Category' : 'Add Category'}
            </h2>

            <div className="space-y-3">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
                className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-2 focus:ring-blue-500"
              />
              <textarea
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="Description"
                className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>

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

export default CategoriesPage
