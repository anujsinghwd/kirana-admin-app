import React, { useState, useEffect, useMemo } from "react";
import { FaCloudUploadAlt, FaPlus, FaEdit, FaTrash, FaSearch, FaImage, FaInfoCircle, FaTags, FaFilter, FaTimes } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useSubCategories } from "../context/SubCategoryContext";
import { useCategories } from "../context/CategoryContext";
import NoData from "../components/common/NoData";
import Loading from "../components/common/Loading";
import { useLockBodyScroll } from "../hooks/useLockBodyScroll";

const SubCategoriesPage = () => {
  const {
    loadingConfig,
    subCategories,
    fetchSubCategories,
    createSubCategory,
    updateSubCategory,
    deleteSubCategory,
    deleteSubCategoryImage,
  } = useSubCategories();

  const { categories, fetchCategories } = useCategories();

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [name, setName] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [image, setImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [categorySearch, setCategorySearch] = useState('');

  // Lock body scroll when modal is open
  useLockBodyScroll(showForm);

  useEffect(() => {
    fetchSubCategories().catch(console.error);
    fetchCategories().catch(console.error);
  }, []);

  const openCreate = () => {
    resetState();
    setShowForm(true);
  };

  const resetState = () => {
    setEditing(null);
    setName("");
    setSelectedCategories([]);
    setImage(null);
    setFile(null);
    setCategorySearch('');
  };

  const openEdit = (sc: any) => {
    setEditing(sc);
    setName(sc.name);
    setSelectedCategories(sc.category.map((c: any) => c._id));
    setImage(sc.image || null);
    setShowForm(true);
  };

  const handleSubmit = async (data: FormData) => {
    try {
      if (editing) await updateSubCategory(editing._id, data);
      else await createSubCategory(data);
      setShowForm(false);
      resetState();
    } catch (err: any) {
      resetState();
      alert(err.response?.data?.message || err.message);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const selected = files[0];
    if (selected) {
      setFile(selected);
      setImage(URL.createObjectURL(selected));
    }
  };

  const handleCategorySelection = (id: string) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id]
    );
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    selectedCategories.forEach((id) => formData.append("category", id));
    if (file) formData.append("image", file);

    handleSubmit(formData);
  };

  const handleRemoveImage = async () => {
    if (editing?._id && editing?.image) {
      const toRemoveImage = {
        id: editing._id,
        image: editing.image,
      };
      await deleteSubCategoryImage(toRemoveImage);
    }
    setImage(null);
    setFile(null);
  };

  const handleCancelClick = () => {
    setShowForm(false);
    resetState();
  };

  // Filter subcategories
  const filteredSubCategories = useMemo(() => {
    let filtered = [...subCategories];

    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(sc =>
        sc.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (filterCategory) {
      filtered = filtered.filter(sc =>
        sc.category.some((c: any) => c._id === filterCategory)
      );
    }

    return filtered;
  }, [subCategories, searchQuery, filterCategory]);

  // Filter categories in modal
  const filteredModalCategories = useMemo(() => {
    if (!categorySearch.trim()) return categories;
    return categories.filter(c =>
      c.name.toLowerCase().includes(categorySearch.toLowerCase())
    );
  }, [categories, categorySearch]);

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Subcategories</h1>
            <p className="text-sm text-gray-500 mt-1">Manage your product subcategories</p>
          </div>
          <button
            onClick={openCreate}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all shadow-sm"
          >
            <FaPlus /> Add Subcategory
          </button>
        </div>

        {/* Stats, Search & Filter */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Stats Card */}
          <div className="md:col-span-3 bg-white rounded-lg p-4 shadow-sm border border-gray-100 flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center">
              <FaTags className="text-indigo-600 text-xl" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{subCategories.length}</p>
              <p className="text-sm text-gray-500">Subcategories</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="md:col-span-5 relative h-full">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search subcategories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-full pl-11 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
            />
          </div>

          {/* Category Filter */}
          <div className="md:col-span-4 relative h-full">
            <FaFilter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full h-full pl-11 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm appearance-none"
            >
              <option value="">All Categories</option>
              {categories.map(c => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
            {filterCategory && (
              <button
                onClick={() => setFilterCategory('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <FaTimes />
              </button>
            )}
          </div>
        </div>
      </div>

      {loadingConfig.loading && (
        <Loading
          size={40}
          color="fill-blue-500"
          fullscreen={true}
          text={loadingConfig.text}
        />
      )}

      {/* SubCategory Cards */}
      {filteredSubCategories.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center border-2 border-dashed border-gray-300">
          <FaTags className="text-6xl text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 font-medium text-lg">
            {searchQuery || filterCategory ? 'No subcategories found' : 'No subcategories yet'}
          </p>
          <p className="text-sm text-gray-400 mt-2">
            {searchQuery || filterCategory ? 'Try adjusting your filters' : 'Click "Add Subcategory" to create your first subcategory'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredSubCategories.map((sc) => (
            <div
              key={sc._id}
              className="bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden group"
            >
              {/* Image Section */}
              <div className="relative h-48 bg-gray-100 overflow-hidden">
                {sc?.image ? (
                  <img
                    src={sc.image}
                    alt={sc.name}
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
                    onClick={() => openEdit(sc)}
                    className="p-3 bg-white hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit subcategory"
                  >
                    <FaEdit className="text-blue-600" />
                  </button>
                  <button
                    onClick={() => deleteSubCategory(sc._id)}
                    className="p-3 bg-white hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete subcategory"
                  >
                    <FaTrash className="text-red-600" />
                  </button>
                </div>
              </div>

              {/* Info Section */}
              <div className="p-4">
                <h3 className="font-bold text-gray-900 text-lg mb-2 truncate">{sc.name}</h3>

                {/* Category Chips */}
                <div className="flex flex-wrap gap-1.5 mb-3 min-h-[28px]">
                  {sc.category.map((c) => (
                    <span
                      key={c._id}
                      className="bg-gradient-to-r from-blue-100 to-indigo-100 text-indigo-700 text-xs px-2.5 py-1 rounded-full font-medium shadow-sm"
                    >
                      {c.name}
                    </span>
                  ))}
                </div>

                {/* Mobile Actions */}
                <div className="flex gap-2 sm:hidden">
                  <button
                    onClick={() => openEdit(sc)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-sm font-medium transition-colors"
                  >
                    <FaEdit /> Edit
                  </button>
                  <button
                    onClick={() => deleteSubCategory(sc._id)}
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
                  <FaTags className="text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-lg text-gray-900">
                    {editing ? "Edit Subcategory" : "Add Subcategory"}
                  </h2>
                  <p className="text-gray-500 text-sm">
                    {editing ? 'Update subcategory details' : 'Create a new subcategory'}
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
                  <FaInfoCircle className="text-indigo-600" />
                  <h3 className="font-semibold text-gray-900">Basic Information</h3>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subcategory Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Rice, Wheat, Pulses"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Parent Categories Section */}
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-4">
                  <FaTags className="text-indigo-600" />
                  <h3 className="font-semibold text-gray-900">Parent Categories</h3>
                  <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">
                    {selectedCategories.length} selected
                  </span>
                </div>

                {/* Search Categories */}
                <div className="relative mb-3">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                  <input
                    type="text"
                    placeholder="Search categories..."
                    value={categorySearch}
                    onChange={(e) => setCategorySearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                {/* Category Chips */}
                <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3 bg-gray-50">
                  {filteredModalCategories.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-4">No categories found</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {filteredModalCategories.map((cat) => {
                        const isSelected = selectedCategories.includes(cat._id);
                        return (
                          <button
                            key={cat._id}
                            type="button"
                            onClick={() => handleCategorySelection(cat._id)}
                            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${isSelected
                              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                              : 'bg-white border border-gray-300 text-gray-700 hover:border-indigo-400'
                              }`}
                          >
                            {cat.name}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Click to select/deselect categories
                </p>
              </div>

              {/* Image Section */}
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-4">
                  <FaImage className="text-green-600" />
                  <h3 className="font-semibold text-gray-900">Subcategory Image</h3>
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
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 group-hover:from-blue-200 group-hover:to-indigo-200 rounded-full flex items-center justify-center mb-3 transition-colors">
                        <FaCloudUploadAlt className="text-3xl text-indigo-600" />
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
                disabled={!name.trim() || selectedCategories.length === 0}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm flex items-center gap-2"
              >
                <FaTags />
                {editing ? 'Update Subcategory' : 'Create Subcategory'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default SubCategoriesPage;
