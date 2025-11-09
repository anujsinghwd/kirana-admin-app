import React, { useEffect, useState } from "react";
import ImageUploader from "../common/ImageUploader";
import VariantModal from "./VariantModal";
import { appendIfExists } from "../../utils/utils";
import { useSubCategories } from "../../context/SubCategoryContext";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { IProductVariant } from "../../context/ProductContext";
import VariantTable from "./VariantTable";

/** ---------- Types ---------- */
export interface VariantForm {
  unitValue: number;
  unitType: string;
  price: number;
  offerPrice?: number;
  discount?: number;
  stock: number;
  sku?: string;
  shelfLife?: {
    duration?: number;
    unit?: "days" | "months" | "years";
    manufacturingDate?: string;
    expiryDate?: string;
    bestBefore?: string;
  };
}

interface Category {
  _id: string;
  name: string;
}

interface ProductFormProps {
  initialData?: any | null;
  onSubmit: (data: FormData) => Promise<void>;
  onCancel: () => void;
  categories: Category[];
}

/** ---------- Component ---------- */
const ProductForm: React.FC<ProductFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  categories,
}) => {
  const { fetchSubCategoriesByCategory, subCategories } = useSubCategories();

  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    subcategory: "",
    published: true,
  });

  const [variants, setVariants] = useState<IProductVariant[]>([]);
  const [images, setImages] = useState<FileList | null>(null);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [deletedImages, setDeletedImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // variant modal
  const [variantModalOpen, setVariantModalOpen] = useState(false);
  const [editingVariant, setEditingVariant] = useState<IProductVariant | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  /** ✅ Load initial data */
  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name,
        description: initialData.description || "",
        category:
          typeof initialData.category === "string"
            ? initialData.category
            : initialData.category?._id || "",
        subcategory:
          typeof initialData.subcategory === "string"
            ? initialData.subcategory
            : initialData.subcategory?._id || "",
        published: initialData.published ?? true,
      });
      setVariants(initialData.variants || []);
      setExistingImages(initialData.images || []);
    }
  }, [initialData]);

  /** ✅ Fetch subcategories */
  useEffect(() => {
    if (form.category) fetchSubCategoriesByCategory(form.category);
  }, [form.category]);

  /** ✅ Image handling */
  const handleImageChange = (files: FileList | null) => {
    setImages(files);
  };

  const removeExistingImage = (url: string) => {
    setDeletedImages((prev) => [...prev, url]);
    setExistingImages((prev) => prev.filter((img) => img !== url));
  };

  /** ✅ Variant modal handlers */
  const handleSaveVariant = (variant: IProductVariant) => {
    if (editingIndex !== null) {
      const updated = [...variants];
      updated[editingIndex] = variant;
      setVariants(updated);
    } else {
      setVariants([...variants, variant]);
    }
    setEditingIndex(null);
    setEditingVariant(null);
  };

  /** ✅ Submit form */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("name", form.name);
    appendIfExists(formData, "description", form.description);
    formData.append("category", form.category);
    formData.append("subcategory", form.subcategory);
    formData.append("published", String(form.published));
    formData.append("variants", JSON.stringify(variants));

    if (images) Array.from(images).forEach((img) => formData.append("images", img));
    if (deletedImages.length > 0)
      formData.append("deletedImages", JSON.stringify(deletedImages));

    console.log(formData);
    try {
      await onSubmit(formData);
    } finally {
      setLoading(false);
    }
  };

  /** ---------- UI ---------- */
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full h-screen md:h-[90vh] md:max-w-5xl md:rounded-lg shadow-lg flex flex-col overflow-hidden"
      >
        {/* Header */}
        <header className="sticky top-0 bg-white border-b p-4 flex justify-between items-center z-10">
          <h2 className="text-lg font-semibold text-gray-800">
            {initialData ? "Edit Product" : "Add Product"}
          </h2>
          <button
            type="button"
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700 md:hidden"
          >
            ✕
          </button>
        </header>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-6">
          {/* ---------- Basic Info ---------- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Product Name"
                className="w-full border rounded p-2 text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full border rounded p-2 text-sm focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Subcategory</label>
              <select
                value={form.subcategory}
                onChange={(e) => setForm({ ...form, subcategory: e.target.value })}
                className="w-full border rounded p-2 text-sm focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select</option>
                {subCategories.map((sub) => (
                  <option key={sub._id} value={sub._id}>
                    {sub.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select
                value={form.published ? "true" : "false"}
                onChange={(e) =>
                  setForm({ ...form, published: e.target.value === "true" })
                }
                className="w-full border rounded p-2 text-sm"
              >
                <option value="true">Published</option>
                <option value="false">Unpublished</option>
              </select>
            </div>
          </div>

          {/* ---------- Description ---------- */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Product Description"
              className="w-full border rounded p-2 text-sm focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>

          {/* ---------- Images ---------- */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Images
            </label>
            <ImageUploader
              maxCount={3}
              defaultImages={existingImages}
              onChange={handleImageChange}
            />
            {existingImages.length > 0 && (
              <div className="mt-3 flex gap-2 flex-wrap">
                {existingImages.map((url, i) => (
                  <div key={i} className="relative">
                    <img
                      src={url}
                      alt="existing"
                      className="w-20 h-20 object-cover border rounded"
                    />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(url)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ---------- Variants ---------- */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-medium text-gray-700 text-base">Variants</h3>
              <button
                type="button"
                onClick={() => {
                  setEditingVariant(null);
                  setEditingIndex(null);
                  setVariantModalOpen(true);
                }}
                className="flex items-center gap-2 bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
              >
                <FaPlus /> Add Variant
              </button>
            </div>

            {/* ✅ Reusable Variant Table */}
            <VariantTable
              variants={variants}
              onEdit={(v, i) => {
                setEditingVariant(v);
                setEditingIndex(i);
                setVariantModalOpen(true);
              }}
              onDelete={(i) => setVariants(variants.filter((_, idx) => idx !== i))}
            />
          </div>
        </div>

        {/* ---------- Footer ---------- */}
        <footer className="sticky bottom-0 bg-white border-t p-3 flex justify-end gap-2">
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
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </footer>
      </form>

      {/* ---------- Variant Modal ---------- */}
      <VariantModal
        open={variantModalOpen}
        onClose={() => setVariantModalOpen(false)}
        onSave={handleSaveVariant}
        initialData={editingVariant}
      />
    </div>
  );
};

export default ProductForm;
