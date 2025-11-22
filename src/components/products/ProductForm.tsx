import React, { useEffect, useState } from "react";
import ImageUploader from "../common/ImageUploader";
import VariantModal from "./VariantModal";
import VariantTable from "./VariantTable";
import { appendIfExists } from "../../utils/utils";
import { useSubCategories } from "../../context/SubCategoryContext";
import {
  FaPlus,
  FaBox,
  FaTag,
  FaImage,
  FaWeight,
  FaList,
  FaInfoCircle,
} from "react-icons/fa";
import type { IProductVariant } from "../../context/ProductContext";

/** ---------- Types ---------- */
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
    isLoose: false,
  });

  const [looseConfig, setLooseConfig] = useState({
    unitType: "kg",
    pricePerUnit: 0,
    availableQty: 0,
    minQtyAllowed: 100,
    stepQty: 50,
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
        isLoose: initialData.isLoose ?? false,
      });

      setLooseConfig(
        initialData.looseConfig || {
          unitType: "kg",
          pricePerUnit: 0,
          availableQty: 0,
          minQtyAllowed: 100,
          stepQty: 50,
        }
      );

      setVariants(initialData.variants || []);
      setExistingImages(initialData.images || []);
    }
  }, [initialData]);

  /** ✅ Fetch subcategories */
  useEffect(() => {
    if (form.category) fetchSubCategoriesByCategory(form.category);
  }, [form.category]);

  /** ✅ Image handling */
  const handleImageChange = (files: FileList | null) => setImages(files);
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
    formData.append("isLoose", String(form.isLoose));

    if (form.isLoose) {
      formData.append("looseConfig", JSON.stringify(looseConfig));
    } else {
      formData.append("variants", JSON.stringify(variants));
    }

    if (images) Array.from(images).forEach((img) => formData.append("images", img));
    if (deletedImages.length > 0)
      formData.append("deletedImages", JSON.stringify(deletedImages));

    try {
      await onSubmit(formData);
    } finally {
      setLoading(false);
    }
  };

  /** ---------- UI ---------- */
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-0 md:p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full h-full md:h-auto md:max-h-[95vh] md:max-w-5xl rounded-none md:rounded-xl shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Header */}
        <header className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center z-10 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <FaBox className="text-xl text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {initialData ? "Edit Product" : "Add New Product"}
              </h2>
              <p className="text-gray-500 text-sm">
                {initialData ? "Update product details" : "Create a new product"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="w-8 h-8 hover:bg-gray-100 rounded-lg flex items-center justify-center transition-colors text-gray-600 hover:text-gray-900"
          >
            ✕
          </button>
        </header>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 bg-gray-50">
          {/* ---------- Basic Info Section ---------- */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <FaInfoCircle className="text-blue-600" />
              <h3 className="font-semibold text-gray-900">Basic Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g., Organic Basmati Rice"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Subcategory */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subcategory
                </label>
                <select
                  value={form.subcategory}
                  onChange={(e) => setForm({ ...form, subcategory: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  disabled={!form.category}
                >
                  <option value="">Select Subcategory</option>
                  {subCategories.map((sub) => (
                    <option key={sub._id} value={sub._id}>
                      {sub.name}
                    </option>
                  ))}
                </select>
                {!form.category && (
                  <p className="text-xs text-gray-500 mt-1">Select a category first</p>
                )}
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Publication Status
                </label>
                <select
                  value={form.published ? "true" : "false"}
                  onChange={(e) =>
                    setForm({ ...form, published: e.target.value === "true" })
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="true">✅ Published (Visible to customers)</option>
                  <option value="false">📦 Unpublished (Hidden)</option>
                </select>
              </div>

              {/* Description - Full Width */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Describe your product features, benefits, and details..."
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* ---------- Product Type Toggle ---------- */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <FaWeight className="text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Loose Product</h3>
                  <p className="text-sm text-gray-500">
                    Sold by weight/volume (e.g., rice, flour)
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isLoose}
                  onChange={(e) => setForm({ ...form, isLoose: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>

          {/* ---------- Images Section ---------- */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <FaImage className="text-green-600" />
              <h3 className="font-semibold text-gray-900">Product Images</h3>
              <span className="text-xs text-gray-500">(Max 3 images)</span>
            </div>
            <ImageUploader
              maxCount={3}
              defaultImages={existingImages}
              onChange={handleImageChange}
            />
            {existingImages.length > 0 && (
              <div className="mt-4 flex gap-3 flex-wrap">
                {existingImages.map((url, i) => (
                  <div key={i} className="relative group">
                    <img
                      src={url}
                      alt="existing"
                      className="w-24 h-24 object-cover border-2 border-gray-200 rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(url)}
                      className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ---------- Conditional Sections ---------- */}
          {!form.isLoose ? (
            // ✅ Variant Section
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <FaList className="text-orange-600" />
                  <h3 className="font-semibold text-gray-900">Product Variants</h3>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                    {variants.length} variant{variants.length !== 1 ? "s" : ""}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEditingVariant(null);
                    setEditingIndex(null);
                    setVariantModalOpen(true);
                  }}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
                >
                  <FaPlus /> Add Variant
                </button>
              </div>

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
          ) : (
            // ⚖️ Loose Product Config
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-4">
                <FaWeight className="text-purple-600" />
                <h3 className="font-semibold text-gray-900">
                  Loose Product Configuration
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Unit Type
                  </label>
                  <select
                    value={looseConfig.unitType}
                    onChange={(e) =>
                      setLooseConfig({ ...looseConfig, unitType: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="kg">Kilogram (kg)</option>
                    <option value="gm">Gram (gm)</option>
                    <option value="ltr">Litre (ltr)</option>
                    <option value="ml">Millilitre (ml)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price per Unit (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={looseConfig.pricePerUnit}
                    onChange={(e) =>
                      setLooseConfig({ ...looseConfig, pricePerUnit: Number(e.target.value) })
                    }
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="₹ per unit"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Available Quantity
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={looseConfig.availableQty}
                    onChange={(e) =>
                      setLooseConfig({ ...looseConfig, availableQty: Number(e.target.value) })
                    }
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Total stock"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Quantity Allowed
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={looseConfig.minQtyAllowed}
                    onChange={(e) =>
                      setLooseConfig({ ...looseConfig, minQtyAllowed: Number(e.target.value) })
                    }
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">Minimum order quantity</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Step Quantity
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={looseConfig.stepQty}
                    onChange={(e) =>
                      setLooseConfig({ ...looseConfig, stepQty: Number(e.target.value) })
                    }
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">Increment step for quantity</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ---------- Footer ---------- */}
        <footer className="sticky bottom-0 bg-white border-t px-6 py-4 flex justify-end gap-3 shadow-lg">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || !form.name || !form.category}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Saving...
              </>
            ) : (
              <>
                <FaBox />
                {initialData ? "Update Product" : "Create Product"}
              </>
            )}
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
