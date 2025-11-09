import React from "react";
import { Product } from "../../context/ProductContext";

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
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-4 hover:shadow-md transition-all relative">
      {/* ---------- Product Header ---------- */}
      <div className="flex justify-between items-start mb-2">
        <div>
          <h2 className="text-base font-semibold text-gray-900">{product.name}</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            {(typeof product.category === 'string' ? product.category : product.category?.name) || "Uncategorized"}{" "}
            {product?.subcategory && (
              <>› {typeof product.subcategory == 'string' ? product.subcategory : product.subcategory?.name}</>
            )}
          </p>
        </div>
      </div>

      {/* ---------- Description ---------- */}
      {product.description && (
        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
          {product.description}
        </p>
      )}

      {/* ---------- Images ---------- */}
      {product.images && product.images.length > 0 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {product.images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={product.name}
              className="w-16 h-16 object-cover rounded-md border border-gray-200 flex-shrink-0"
            />
          ))}
        </div>
      )}

      {/* ---------- Variant Table ---------- */}
      {product.variants && product.variants.length > 0 && (
        <div className="mt-3 border border-gray-100 rounded-lg overflow-hidden">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-700 font-medium">
              <tr>
                <th className="text-left px-3 py-2">Unit</th>
                <th className="text-left px-3 py-2">Price</th>
                <th className="text-left px-3 py-2">Stock</th>
                <th className="text-left px-3 py-2">Expiry</th>
              </tr>
            </thead>
            <tbody>
              {product.variants.map((variant, i) => (
                <tr
                  key={i}
                  className="border-t border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  {/* Unit */}
                  <td className="px-3 py-2">
                    {variant.unitValue} {variant.unitType}
                  </td>

                  {/* Price + Offer Price */}
                  <td className="px-3 py-2">
                    {variant.offerPrice && variant.offerPrice < variant.price ? (
                      <div className="flex flex-col">
                        <span className="text-red-600 font-semibold">
                          ₹{variant.offerPrice}
                        </span>
                        <span className="text-xs text-gray-400 line-through">
                          ₹{variant.price}
                        </span>
                      </div>
                    ) : (
                      <span className="text-gray-800 font-medium">
                        ₹{variant.price}
                      </span>
                    )}
                  </td>

                  {/* Stock */}
                  <td className="px-3 py-2 text-gray-700">
                    {variant.stock ?? 0}
                  </td>

                  {/* Expiry / Best Before */}
                  <td className="px-3 py-2 text-gray-600 text-xs">
                    {variant.shelfLife?.expiryDate
                      ? new Date(variant.shelfLife.expiryDate).toLocaleDateString()
                      : variant.shelfLife?.bestBefore || "--"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ---------- Footer Actions ---------- */}
      <div className="flex justify-end space-x-2 mt-4">
        <button
          onClick={() => onEdit(product)}
          className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded text-xs"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(product._id)}
          className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-xs"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
