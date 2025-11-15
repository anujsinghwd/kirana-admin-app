import React, { useState, useEffect } from "react";
import { useProducts } from "../context/ProductContext";
import { useCategories } from "../context/CategoryContext";
import ProductForm from "../components/products/ProductForm";
import ProductCard from "../components/products/ProductCard";
import NoData from "../components/common/NoData";
import Loading from "../components/common/Loading";

const ProductsPage: React.FC = () => {
  const {
    loadingConfig,
    products,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
  } = useProducts();

  const { categories, fetchCategories } = useCategories();

  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  // ✅ Fetch data on mount
  useEffect(() => {
    Promise.all([fetchProducts(), fetchCategories()]).catch(console.error);
  }, []);

  /** ✅ Open Create Form */
  const openCreate = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  /** ✅ Open Edit Form */
  const openEdit = (product: any) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  /** ✅ Handle Form Submit (Create / Update) */
  const handleSubmit = async (formData: FormData) => {
    try {
      if (editingProduct) {
        await updateProduct(editingProduct._id, formData);
      } else {
        await createProduct(formData);
      }

      await fetchProducts();
      setShowForm(false);
      setEditingProduct(null);
    } catch (err: any) {
      alert(err.response?.data?.message || err.message);
    }
  };

  /** ✅ Handle Delete */
  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      await deleteProduct(id);
      await fetchProducts();
    }
  };

  return (
    <div className="p-4 md:p-6">
      {/* ---------- Header ---------- */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
          Products
        </h1>
        <button
          onClick={openCreate}
          className="w-full sm:w-auto px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-all"
        >
          + Add Product
        </button>
      </div>

      {/* ---------- Loading ---------- */}
      {loadingConfig.loading && (
        <Loading
          size={40}
          fullscreen={true}
          color="fill-blue-500"
          text={loadingConfig.text}
        />
      )}

      {/* ---------- Product Cards ---------- */}
      {products.length === 0 && !loadingConfig.loading ? (
        <NoData />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.map((p) => (
            <ProductCard
              key={p._id}
              product={p}
              onEdit={openEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* ---------- Product Form Modal ---------- */}
      {showForm && (
        <ProductForm
          initialData={editingProduct}
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingProduct(null);
          }}
          categories={categories}
        />
      )}
    </div>
  );
};

export default ProductsPage;
