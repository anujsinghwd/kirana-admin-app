import React from "react";
import { FaEdit, FaTrash, FaBox, FaExclamationTriangle } from "react-icons/fa";
import { IProductVariant } from "../../context/ProductContext";

interface VariantTableProps {
  variants: IProductVariant[];
  onEdit: (variant: IProductVariant, index: number) => void;
  onDelete: (index: number) => void;
}

/** ✅ Table for displaying variants */
const VariantTable: React.FC<VariantTableProps> = ({ variants, onEdit, onDelete }) => {
  if (variants.length === 0)
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <FaBox className="text-4xl text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500 font-medium">No variants added yet</p>
        <p className="text-sm text-gray-400 mt-1">Click "Add Variant" to create your first variant</p>
      </div>
    );

  // Get stock status
  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: "Out of Stock", color: "bg-red-100 text-red-700", dotColor: "bg-red-500" };
    if (stock <= 9) return { label: "Low Stock", color: "bg-orange-100 text-orange-700", dotColor: "bg-orange-500" };
    if (stock <= 20) return { label: "Medium", color: "bg-yellow-100 text-yellow-700", dotColor: "bg-yellow-500" };
    return { label: "In Stock", color: "bg-green-100 text-green-700", dotColor: "bg-green-500" };
  };

  // Check if expiry is soon (within 30 days)
  const isExpiringSoon = (expiryDate?: string) => {
    if (!expiryDate) return false;
    const expiry = new Date(expiryDate);
    const now = new Date();
    const diffDays = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays > 0 && diffDays <= 30;
  };

  const isExpired = (expiryDate?: string) => {
    if (!expiryDate) return false;
    return new Date(expiryDate) < new Date();
  };

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 font-semibold">
            <tr>
              <th className="p-3 text-left border-b">#</th>
              <th className="p-3 text-left border-b">Unit</th>
              <th className="p-3 text-left border-b">Price</th>
              <th className="p-3 text-left border-b">Offer</th>
              <th className="p-3 text-left border-b">Stock</th>
              <th className="p-3 text-left border-b">Expiry</th>
              <th className="p-3 text-right border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {variants.map((v, i) => {
              const stockStatus = getStockStatus(v.stock ?? 0);
              const hasOffer = v.offerPrice && v.offerPrice < v.price;
              const savings = hasOffer ? v.price - (v.offerPrice || 0) : 0;
              const savingsPercent = hasOffer ? Math.round((savings / v.price) * 100) : 0;
              const expiringSoon = isExpiringSoon(v.shelfLife?.expiryDate);
              const expired = isExpired(v.shelfLife?.expiryDate);

              return (
                <tr
                  key={i}
                  className="border-b border-gray-100 hover:bg-blue-50 transition-colors duration-150"
                >
                  <td className="p-3 font-medium text-gray-700">{i + 1}</td>
                  <td className="p-3">
                    <span className="font-semibold text-gray-900">
                      {v.unitValue} {v.unitType}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-900">₹{v.price}</span>
                      {v?.discount && v?.discount > 0 && (
                        <span className="text-xs text-gray-500">{v.discount}% disc</span>
                      )}
                    </div>
                  </td>
                  <td className="p-3">
                    {hasOffer ? (
                      <div className="flex flex-col">
                        <span className="font-bold text-green-600">₹{v.offerPrice}</span>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full inline-block w-fit">
                          Save {savingsPercent}%
                        </span>
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${stockStatus.color} flex items-center gap-1.5`}>
                        <span className={`w-2 h-2 rounded-full ${stockStatus.dotColor}`}></span>
                        {v.stock ?? 0}
                      </span>
                    </div>
                  </td>
                  <td className="p-3">
                    {v.shelfLife?.expiryDate ? (
                      <div className="flex items-center gap-1">
                        {expired && <FaExclamationTriangle className="text-red-500" />}
                        {expiringSoon && !expired && <FaExclamationTriangle className="text-orange-500" />}
                        <span className={expired ? "text-red-600 font-medium" : expiringSoon ? "text-orange-600" : "text-gray-700"}>
                          {new Date(v.shelfLife.expiryDate).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="p-3">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => onEdit(v, i)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                        title="Edit variant"
                      >
                        <FaEdit />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(i)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                        title="Delete variant"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {variants.map((v, i) => {
          const stockStatus = getStockStatus(v.stock ?? 0);
          const hasOffer = v.offerPrice && v.offerPrice < v.price;
          const savings = hasOffer ? v.price - (v.offerPrice || 0) : 0;
          const savingsPercent = hasOffer ? Math.round((savings / v.price) * 100) : 0;
          const expiringSoon = isExpiringSoon(v.shelfLife?.expiryDate);
          const expired = isExpired(v.shelfLife?.expiryDate);

          return (
            <div
              key={i}
              className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-bold">
                    {i + 1}
                  </span>
                  <span className="font-bold text-gray-900 text-lg">
                    {v.unitValue} {v.unitType}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => onEdit(v, i)}
                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                  >
                    <FaEdit />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(i)}
                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>

              {/* Price Info */}
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Regular Price</p>
                  <p className="font-bold text-gray-900">₹{v.price}</p>
                </div>
                {hasOffer && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Offer Price</p>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-green-600">₹{v.offerPrice}</p>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                        -{savingsPercent}%
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Stock Status */}
              <div className="mb-3">
                <p className="text-xs text-gray-500 mb-1">Stock Status</p>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${stockStatus.color}`}>
                  <span className={`w-2 h-2 rounded-full ${stockStatus.dotColor}`}></span>
                  {v.stock ?? 0} units - {stockStatus.label}
                </span>
              </div>

              {/* Expiry */}
              {v.shelfLife?.expiryDate && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Expiry Date</p>
                  <div className="flex items-center gap-1">
                    {expired && <FaExclamationTriangle className="text-red-500" />}
                    {expiringSoon && !expired && <FaExclamationTriangle className="text-orange-500" />}
                    <span className={expired ? "text-red-600 font-medium" : expiringSoon ? "text-orange-600 font-medium" : "text-gray-700"}>
                      {new Date(v.shelfLife.expiryDate).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                    {expired && <span className="text-xs text-red-600 ml-2">(Expired)</span>}
                    {expiringSoon && !expired && <span className="text-xs text-orange-600 ml-2">(Expiring Soon)</span>}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default VariantTable;
