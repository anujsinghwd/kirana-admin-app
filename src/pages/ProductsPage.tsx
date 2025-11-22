import React, { useState, useEffect, useMemo } from "react";
import { useProducts } from "../context/ProductContext";
import { useCategories } from "../context/CategoryContext";
import ProductForm from "../components/products/ProductForm";
import ProductCard from "../components/products/ProductCard";
import {
  FaPlus,
  FaSearch,
  FaTimes,
  FaBox,
  FaFilter,
  FaSort,
  FaLayerGroup,
} from "react-icons/fa";

// Skeleton Loader Component
const ProductCardSkeleton = () => (
  <div className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse border border-gray-100">
    <div className="h-48 bg-gray-200"></div>
    <div className="p-4 space-y-3">
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      <div className="flex justify-between items-center pt-2">
        <div className="h-6 bg-gray-200 rounded w-20"></div>
        <div className="h-8 bg-gray-200 rounded w-8"></div>
      </div>
    </div>
  </div>
);

// Debounce hook
function useDebounce<T>(value: T, delay = 400) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

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
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [stockFilter, setStockFilter] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("name");
  const [showFilters, setShowFilters] = useState(false);

  const debouncedSearch = useDebounce(search, 400);

  // Fetch data on mount
  useEffect(() => {
    Promise.all([fetchProducts(), fetchCategories()]).catch(console.error);
  }, []);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Search filter
    if (debouncedSearch) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter((p) => {
        const catId = typeof p.category === "string" ? p.category : p.category?._id;
        return catId === selectedCategory;
      });
    }

    // Stock filter
    if (stockFilter === "in-stock") {
      filtered = filtered.filter((p) =>
        p.variants?.some((v) => (v.stock ?? 0) > 10)
      );
    } else if (stockFilter === "low-stock") {
      filtered = filtered.filter((p) =>
        p.variants?.some((v) => (v.stock ?? 0) > 0 && (v.stock ?? 0) <= 10)
      );
    } else if (stockFilter === "out-of-stock") {
      filtered = filtered.filter((p) =>
        p.variants?.every((v) => (v.stock ?? 0) === 0)
      );
    }

    // Sort
    if (sortBy === "name") {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "price-low") {
      filtered.sort((a, b) => {
        const priceA = a.variants?.[0]?.price ?? 0;
        const priceB = b.variants?.[0]?.price ?? 0;
        return priceA - priceB;
      });
    } else if (sortBy === "price-high") {
      filtered.sort((a, b) => {
        const priceA = a.variants?.[0]?.price ?? 0;
        const priceB = b.variants?.[0]?.price ?? 0;
        return priceB - priceA;
      });
    }

    return filtered;
  }, [products, debouncedSearch, selectedCategory, stockFilter, sortBy]);

  const activeFilterCount = [selectedCategory, stockFilter].filter(Boolean).length;

  const openCreate = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const openEdit = (product: any) => {
    setEditingProduct(product);
    setShowForm(true);
  };

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

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      await deleteProduct(id);
      await fetchProducts();
    }
  };

  const clearFilters = () => {
    setSearch("");
    setSelectedCategory("");
    setStockFilter("");
    setSortBy("name");
  };

  return (
    <div className="pb-24">
      {/* Header Section */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Products</h1>
            <p className="text-sm text-gray-500 mt-1">Manage your product inventory</p>
          </div>
          <button
            onClick={openCreate}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg font-medium transition-all shadow-sm hover:shadow-md"
          >
            <FaPlus /> Add Product
          </button>
        </div>

        {/* Stats & Search Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-6">
          {/* Stats Card */}
          <div className="md:col-span-3 bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center">
              <FaBox className="text-indigo-600 text-xl" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{filteredProducts.length}</p>
              <p className="text-sm text-gray-500">Total Products</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="md:col-span-6 relative">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search products by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white shadow-sm"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <FaTimes />
              </button>
            )}
          </div>

          {/* Filter Toggle */}
          <div className="md:col-span-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`w-full h-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all border ${showFilters || activeFilterCount > 0
                  ? "bg-indigo-50 border-indigo-200 text-indigo-700"
                  : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                }`}
            >
              <FaFilter />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className="bg-indigo-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Advanced Filters Panel */}
        {showFilters && (
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 mb-6 animate-fade-in-down">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stock Status
                </label>
                <select
                  value={stockFilter}
                  onChange={(e) => setStockFilter(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">All Stock Levels</option>
                  <option value="in-stock">In Stock (&gt;10)</option>
                  <option value="low-stock">Low Stock (1-10)</option>
                  <option value="out-of-stock">Out of Stock</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <FaSort /> Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="name">Name (A-Z)</option>
                  <option value="price-low">Price (Low to High)</option>
                  <option value="price-high">Price (High to Low)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end mt-4 pt-4 border-t border-gray-100">
              <button
                onClick={clearFilters}
                className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
              >
                <FaTimes /> Clear Filters
              </button>
            </div>
          </div>
        )}

        {/* Category Chips (Quick Filter) */}
        {!showFilters && (
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide mb-6">
            <button
              onClick={() => setSelectedCategory("")}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${selectedCategory === ""
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
            >
              All Categories
            </button>
            {categories.map((cat) => (
              <button
                key={cat._id}
                onClick={() => setSelectedCategory(cat._id)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${selectedCategory === cat._id
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                  : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Content */}
      <div>
        {/* Loading State */}
        {loadingConfig.loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loadingConfig.loading && filteredProducts.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center border-2 border-dashed border-gray-200">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaBox className="text-4xl text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {products.length === 0 ? "No products yet" : "No products found"}
            </h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              {products.length === 0
                ? "Get started by adding your first product to your inventory."
                : "We couldn't find any products matching your filters. Try adjusting them."}
            </p>
            {(activeFilterCount > 0 || search) && products.length > 0 ? (
              <button
                onClick={clearFilters}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors shadow-sm"
              >
                Clear Filters
              </button>
            ) : (
              <button
                onClick={openCreate}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg font-medium transition-colors shadow-sm flex items-center gap-2 mx-auto"
              >
                <FaPlus />
                Add Your First Product
              </button>
            )}
          </div>
        )}

        {/* Product Grid */}
        {!loadingConfig.loading && filteredProducts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredProducts.map((p) => (
              <ProductCard
                key={p._id}
                product={p}
                onEdit={openEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      {/* Floating Action Button (Mobile Only) */}
      <button
        onClick={openCreate}
        className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center z-20 active:scale-95"
        title="Add Product"
      >
        <FaPlus className="text-xl" />
      </button>

      {/* Product Form Modal */}
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
