import React, { useState, useEffect } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useSubCategories } from "../context/SubCategoryContext";
import { useCategories } from "../context/CategoryContext";
import NoData from "../components/common/NoData";
import Loading from "../components/common/Loading";

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

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
          Subcategories
        </h1>
        <button
          onClick={openCreate}
          className="w-full sm:w-auto px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-all"
        >
          Add Subcategory
        </button>
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
      {subCategories.length === 0 ? (
        <NoData />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {subCategories.map((sc) => (
            <div
              key={sc._id}
              className="flex items-center gap-4 bg-white border border-gray-100 rounded-xl shadow-sm p-4 hover:shadow-md transition-all"
            >
              {/* Image Section */}
              <div className="flex-shrink-0">
                {sc?.image ? (
                  <img
                    src={sc.image}
                    alt={sc.name}
                    className="w-30 h-30 object-scale-down rounded-lg border border-gray-200"
                  />
                ) : (
                  <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-xs">
                    No Image
                  </div>
                )}
              </div>

              {/* Info Section */}
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-gray-900 text-base truncate">
                  {sc.name}
                </div>

                {/* Categories */}
                <div className="flex flex-wrap gap-1 mt-1">
                  {sc.category.map((c) => (
                    <span
                      key={c._id}
                      className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-md shadow-sm"
                    >
                      {c.name}
                    </span>
                  ))}
                </div>

                {/* Buttons */}
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => openEdit(sc)}
                    className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded text-xs"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteSubCategory(sc._id)}
                    className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-xs"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[99]">
          <form
            onSubmit={onSubmit}
            className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-[90%] max-w-md mx-auto"
          >
            <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800">
              {editing ? "Edit Subcategory" : "Add Subcategory"}
            </h2>

            <div className="space-y-3">
              {/* Name */}
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
                className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-2 focus:ring-blue-500"
              />

              {/* Category Selector */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">
                  Select Category
                </p>
                <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto border border-gray-300 rounded p-2">
                  {categories.map((cat) => (
                    <label
                      key={cat._id}
                      className="flex items-center gap-1 text-sm cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(cat._id)}
                        onChange={() => handleCategorySelection(cat._id)}
                      />
                      {cat.name}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Image Upload */}
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-md p-4 mt-3">
              {image ? (
                <div className="relative w-32 h-32">
                  <img
                    src={image}
                    alt="Uploaded"
                    className="w-full h-full object-scale-down rounded-md"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow hover:bg-gray-200"
                  >
                    <MdDelete className="text-red-500 text-lg" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center cursor-pointer">
                  <FaCloudUploadAlt className="text-3xl text-gray-500" />
                  <span className="text-sm text-gray-500 mt-1">
                    Upload Image
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-2 mt-5">
              <button
                type="button"
                onClick={handleCancelClick}
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
  );
};

export default SubCategoriesPage;
