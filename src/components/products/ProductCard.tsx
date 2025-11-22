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
      className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group relative border border-gray-100"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Mobile Layout - Horizontal */}
      <div className="flex sm:hidden">
        {/* Product Image - Left Side */}
        <div className="relative w-32 h-32 flex-shrink-0 bg-gray-100 overflow-hidden">
          <img
            src={productImage}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />

          {/* Stock Badge */}
          <div className={`absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-semibold ${stockStatus.color} backdrop-blur-sm flex items-center gap-1`}>
            <span className={`w-1.5 h-1.5 rounded-full ${stockStatus.dotColor} animate-pulse`}></span>
            {stockStatus.label}
          </div>

          {/* Offer Badge */}
          {hasOffer && (
            <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-600 text-white backdrop-blur-sm">
              SALE
            </div>
          )}
        </div>

        {/* Product Info - Right Side (Mobile) */}
        <div className="flex-1 p-3 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded-md text-[10px] font-medium">
              <FaBox className="text-[10px]" />
              {categoryName}
            </span>
            {product.variants && product.variants.length > 1 && (
              <span className="text-[10px] text-gray-500">
                {product.variants.length} variants
              </span>
            )}
          </div>

          <h3 className="font-bold text-gray-900 text-sm mb-1 line-clamp-1">
            {product.name}
          </h3>

          {product.description && (
            <p className="text-xs text-gray-600 line-clamp-2 mb-2">
              {product.description}
            </p>
          )}

          <div className="flex items-center justify-between mt-2">
            <div>
              {displayPrice !== undefined && (
                <div className="flex items-baseline gap-1.5">
                  <span className="text-lg font-bold text-green-600">
                    ₹{displayPrice}
                  </span>
                  {originalPrice && (
                    <span className="text-xs text-gray-400 line-through">
                      ₹{originalPrice}
                    </span>
                  )}
                </div>
              )}
              {unitDisplay && (
                <p className="text-xs text-gray-500">
                  {unitDisplay}
                </p>
              )}
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold text-gray-700">
                Stock: {totalStock}
              </p>
            </div>
          </div>

          {/* Mobile Actions */}
          <div className="flex gap-2 mt-3">
            <button
              onClick={() => onEdit(product)}
              className="flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg font-medium transition-colors text-xs"
            >
              <FaEdit className="text-xs" />
              Edit
            </button>
            <button
              onClick={() => onDelete(product._id)}
              className="flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg font-medium transition-colors text-xs"
            >
              <FaTrash className="text-xs" />
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Layout - Grid */}
      <div className="hidden sm:grid sm:grid-cols-[112px_1fr] sm:gap-3 p-3">
        {/* Left Column: Image + Price Below */}
        <div className="space-y-2">
          {/* Product Image */}
          <div className="relative w-28 h-28 bg-gray-100 overflow-hidden rounded-lg">
            <img
              src={productImage}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />

            {/* Stock Badge */}
            <div className={`absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-semibold ${stockStatus.color} backdrop-blur-sm flex items-center gap-1`}>
              <span className={`w-1.5 h-1.5 rounded-full ${stockStatus.dotColor} animate-pulse`}></span>
              {stockStatus.label}
            </div>

            {/* Offer Badge */}
            {hasOffer && (
              <div className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-red-600 text-white backdrop-blur-sm">
                SALE
              </div>
            )}

            {/* Quick Actions Overlay */}
            <div
              className={`absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center gap-2 transition-opacity duration-300 ${showActions ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
            >
              <button
                onClick={() => onEdit(product)}
                className="w-7 h-7 bg-white hover:bg-blue-600 text-blue-600 hover:text-white rounded-full flex items-center justify-center transition-all shadow-lg transform hover:scale-110"
                title="Edit Product"
              >
                <FaEdit className="text-xs" />
              </button>
              <button
                onClick={() => onDelete(product._id)}
                className="w-7 h-7 bg-white hover:bg-red-600 text-red-600 hover:text-white rounded-full flex items-center justify-center transition-all shadow-lg transform hover:scale-110"
                title="Delete Product"
              >
                <FaTrash className="text-xs" />
              </button>
            </div>
          </div>

          {/* Price & Unit Below Image */}
          <div className="space-y-0.5">
            {displayPrice !== undefined && (
              <div className="flex flex-col">
                <div className="flex items-baseline gap-1">
                  <span className="text-base font-bold text-green-600">
                    ₹{displayPrice}
                  </span>
                  {originalPrice && (
                    <span className="text-[10px] text-gray-400 line-through">
                      ₹{originalPrice}
                    </span>
                  )}
                </div>
                {unitDisplay && (
                  <p className="text-[10px] text-gray-500">
                    {unitDisplay}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Main Info + Stock + Variants */}
        <div className="min-w-0 space-y-2">
          {/* Category Badge and Variants Count */}
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded-md text-[10px] font-medium">
              <FaBox className="text-[10px]" />
              {categoryName}
            </span>
            {product.variants && product.variants.length > 1 && (
              <span className="text-[10px] text-gray-500">
                {product.variants.length} variants
              </span>
            )}
          </div>

          {/* Product Name */}
          <h3 className="font-bold text-gray-900 text-sm line-clamp-2">
            {product.name}
          </h3>

          {/* Description */}
          {product.description && (
            <p className="text-xs text-gray-600 line-clamp-2">
              {product.description}
            </p>
          )}

          {/* Stock & Expiry */}
          <div className="flex items-center gap-3 text-xs">
            <p className="font-semibold text-gray-700">
              Stock: {totalStock}
            </p>
            {firstVariant?.shelfLife?.expiryDate && (
              <p className="text-gray-500">
                Exp: {new Date(firstVariant.shelfLife.expiryDate).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short"
                })}
              </p>
            )}
          </div>

          {/* Variants */}
          {product.variants && product.variants.length > 1 && (
            <div className="flex flex-wrap gap-1">
              {product.variants.slice(0, 3).map((variant, i) => (
                <span
                  key={i}
                  className="inline-block px-1.5 py-0.5 bg-gray-100 text-gray-700 rounded text-[10px]"
                >
                  {variant.unitValue}{variant.unitType}
                </span>
              ))}
              {product.variants.length > 3 && (
                <span className="inline-block px-1.5 py-0.5 bg-gray-100 text-gray-700 rounded text-[10px]">
                  +{product.variants.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
