import React, { useState } from "react";
import { Product } from "../../context/ProductContext";
import { FaEdit, FaTrash, FaEye, FaBox } from "react-icons/fa";

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onEdit,
  onDelete,
}) => {
  const [showActions, setShowActions] = useState(false);

  // Get first variant for display
  const firstVariant = product.variants?.[0];

  // Price logic
  let displayPrice: number | undefined;
  let originalPrice: number | null = null;
  let unitDisplay: string = "";
  let hasOffer = false;

  if (product.isLoose && product.looseConfig) {
    displayPrice = product.looseConfig.pricePerUnit;
    unitDisplay = `per ${product.looseConfig.unitType}`;
  } else if (firstVariant) {
    hasOffer = !!(firstVariant.offerPrice && firstVariant.offerPrice < firstVariant.price);
    displayPrice = hasOffer ? firstVariant.offerPrice : firstVariant.price;
    originalPrice = hasOffer ? firstVariant.price : null;
    unitDisplay = `${firstVariant.unitValue} ${firstVariant.unitType}`;
  }

  // Calculate total stock
  const totalStock = product.isLoose
    ? product.looseConfig?.availableQty ?? 0
    : product.variants?.reduce((sum, v) => sum + (v.stock ?? 0), 0) ?? 0;

  // Determine stock status
  const getStockStatus = () => {
    if (totalStock === 0) return { label: "Out of Stock", color: "bg-red-100 text-red-700", dotColor: "bg-red-500" };
    if (totalStock <= 10) return { label: "Low Stock", color: "bg-yellow-100 text-yellow-700", dotColor: "bg-yellow-500" };
    return { label: "In Stock", color: "bg-green-100 text-green-700", dotColor: "bg-green-500" };
  };

  const stockStatus = getStockStatus();

  // Get category name
  const categoryName = typeof product.category === "string"
    ? product.category
    : product.category?.name || "Uncategorized";

  // Get first image or placeholder
  const productImage = product.images?.[0] || "https://via.placeholder.com/300x300?text=No+Image";

  return (
    <div
      className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group relative"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Product Image */}
      <div className="relative h-48 bg-gray-100 overflow-hidden">
        <img
          src={productImage}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />

        {/* Stock Badge */}
        <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold ${stockStatus.color} backdrop-blur-sm flex items-center gap-1.5`}>
          <span className={`w-2 h-2 rounded-full ${stockStatus.dotColor} animate-pulse`}></span>
          {stockStatus.label}
        </div>

        {/* Offer Badge */}
        {hasOffer && (
          <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold bg-red-600 text-white backdrop-blur-sm">
            SALE
          </div>
        )}

        {/* Quick Actions Overlay */}
        <div
          className={`absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center gap-3 transition-opacity duration-300 ${showActions ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
        >
          <button
            onClick={() => onEdit(product)}
            className="w-10 h-10 bg-white hover:bg-blue-600 text-blue-600 hover:text-white rounded-full flex items-center justify-center transition-all shadow-lg transform hover:scale-110"
            title="Edit Product"
          >
            <FaEdit />
          </button>
          <button
            onClick={() => onDelete(product._id)}
            className="w-10 h-10 bg-white hover:bg-red-600 text-red-600 hover:text-white rounded-full flex items-center justify-center transition-all shadow-lg transform hover:scale-110"
            title="Delete Product"
          >
            <FaTrash />
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Category Badge */}
        <div className="flex items-center gap-2 mb-2">
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-medium">
            <FaBox className="text-xs" />
            {categoryName}
          </span>
          {product.variants && product.variants.length > 1 && (
            <span className="text-xs text-gray-500">
              {product.variants.length} variants
            </span>
          )}
        </div>

        {/* Product Name */}
        <h3 className="font-bold text-gray-900 text-base mb-1 line-clamp-2 min-h-[2.5rem]">
          {product.name}
        </h3>

        {/* Description */}
        {product.description && (
          <p className="text-sm text-gray-600 line-clamp-2 mb-3 min-h-[2.5rem]">
            {product.description}
          </p>
        )}

        {/* Price and Stock */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
          <div>
            {displayPrice !== undefined && (
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-green-600">
                  ₹{displayPrice}
                </span>
                {originalPrice && (
                  <span className="text-sm text-gray-400 line-through">
                    ₹{originalPrice}
                  </span>
                )}
              </div>
            )}
            {unitDisplay && (
              <p className="text-xs text-gray-500 mt-1">
                {unitDisplay}
              </p>
            )}
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-gray-700">
              Stock: {totalStock}
            </p>
            {firstVariant?.shelfLife?.expiryDate && (
              <p className="text-xs text-gray-500 mt-1">
                Exp: {new Date(firstVariant.shelfLife.expiryDate).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short"
                })}
              </p>
            )}
          </div>
        </div>

        {/* Variants Preview (if multiple) */}
        {product.variants && product.variants.length > 1 && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-500 mb-2">Available Variants:</p>
            <div className="flex flex-wrap gap-1">
              {product.variants.slice(0, 3).map((variant, i) => (
                <span
                  key={i}
                  className="inline-block px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                >
                  {variant.unitValue}{variant.unitType}
                </span>
              ))}
              {product.variants.length > 3 && (
                <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                  +{product.variants.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Mobile Actions (visible on mobile, hidden on desktop) */}
        <div className="flex gap-2 mt-4 md:hidden">
          <button
            onClick={() => onEdit(product)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg font-medium transition-colors text-sm"
          >
            <FaEdit />
            Edit
          </button>
          <button
            onClick={() => onDelete(product._id)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg font-medium transition-colors text-sm"
          >
            <FaTrash />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
