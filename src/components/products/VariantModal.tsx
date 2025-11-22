import React, { useState, useEffect } from "react";
import { IProductVariant } from "../../context/ProductContext";
import {
  FaRulerCombined,
  FaMoneyBillWave,
  FaBox,
  FaCalendarAlt,
  FaPercentage,
  FaBarcode,
  FaInfoCircle,
} from "react-icons/fa";
import { useLockBodyScroll } from "../../hooks/useLockBodyScroll";

interface VariantModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (variant: IProductVariant) => void;
  initialData?: IProductVariant | null;
}

const VariantModal: React.FC<VariantModalProps> = ({
  open,
  onClose,
  onSave,
  initialData,
}) => {
  const [variant, setVariant] = useState<IProductVariant>({
    unitValue: 0,
    unitType: "gm",
    price: 0,
    offerPrice: 0,
    discount: 0,
    stock: 0,
    sku: "",
    shelfLife: {
      duration: 0,
      unit: "months",
      manufacturingDate: "",
      expiryDate: "",
      bestBefore: "",
    },
  });

  // Lock body scroll
  useLockBodyScroll(open);

  useEffect(() => {
    if (initialData) setVariant(initialData);
  }, [initialData]);

  const handleChange = (key: keyof IProductVariant, value: any) => {
    // prevent negatives
    if (typeof value === "number" && value < 0) value = 0;
    setVariant({ ...variant, [key]: value });
  };

  const handleShelfLifeChange = (key: string, value: any) => {
    if (typeof value === "number" && value < 0) value = 0;
    setVariant({
      ...variant,
      shelfLife: { ...variant.shelfLife, [key]: value },
    });
  };

  // Calculate savings
  const hasOffer = variant.offerPrice && variant.offerPrice < variant.price;
  const savings = hasOffer ? variant.price - (variant.offerPrice || 0) : 0;
  const savingsPercent = hasOffer ? Math.round((savings / variant.price) * 100) : 0;

  // Stock status
  const getStockStatus = () => {
    const stock = variant.stock ?? 0;
    if (stock === 0) return { label: "Out of Stock", color: "text-red-600", bgColor: "bg-red-50" };
    if (stock <= 9) return { label: "Low Stock", color: "text-orange-600", bgColor: "bg-orange-50" };
    if (stock <= 20) return { label: "Medium Stock", color: "text-yellow-600", bgColor: "bg-yellow-50" };
    return { label: "Good Stock", color: "text-green-600", bgColor: "bg-green-50" };
  };

  const stockStatus = getStockStatus();

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-0 md:p-4">
      <div className="bg-white rounded-none md:rounded-xl shadow-2xl w-full h-full md:h-auto md:max-w-3xl md:max-h-[90vh] overflow-y-auto flex flex-col">
        {/* ---------- Header ---------- */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center z-10 rounded-t-none md:rounded-t-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <FaBox className="text-white" />
            </div>
            <div>
              <h2 className="font-bold text-lg text-gray-900">
                {initialData ? "Edit Variant" : "Add New Variant"}
              </h2>
              <p className="text-gray-500 text-sm">
                Configure product variant details
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 hover:bg-gray-100 rounded-lg flex items-center justify-center transition-colors text-gray-600 hover:text-gray-900"
          >
            ×
          </button>
        </div>

        {/* ---------- Body ---------- */}
        <div className="p-6 flex-1 space-y-6">
          {/* Unit & Pricing Section */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <FaRulerCombined className="text-blue-600" />
              <h3 className="font-semibold text-gray-900">Unit & Pricing</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Unit Value <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  placeholder="e.g., 500"
                  value={variant.unitValue || ""}
                  onChange={(e) =>
                    handleChange("unitValue", Number(e.target.value))
                  }
                  className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Unit Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={variant.unitType}
                  onChange={(e) => handleChange("unitType", e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="gm">Gram (gm)</option>
                  <option value="kg">Kilogram (kg)</option>
                  <option value="ml">Millilitre (ml)</option>
                  <option value="ltr">Litre (ltr)</option>
                  <option value="piece">Piece</option>
                  <option value="packet">Packet</option>
                  <option value="box">Box</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Regular Price (₹) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FaMoneyBillWave className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    placeholder="0.00"
                    value={variant.price || ""}
                    onChange={(e) => handleChange("price", Number(e.target.value))}
                    className="border border-gray-300 rounded-lg pl-10 pr-4 py-2.5 text-sm w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Offer Price (₹)
                </label>
                <div className="relative">
                  <FaMoneyBillWave className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-500" />
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={variant.offerPrice || ""}
                    onChange={(e) =>
                      handleChange("offerPrice", Number(e.target.value))
                    }
                    className="border border-gray-300 rounded-lg pl-10 pr-4 py-2.5 text-sm w-full focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                {hasOffer && (
                  <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                    <FaInfoCircle />
                    Customers save ₹{savings.toFixed(2)} ({savingsPercent}%)
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Discount (%)
                </label>
                <div className="relative">
                  <FaPercentage className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="number"
                    min="0"
                    max="100"
                    placeholder="0"
                    value={variant.discount || ""}
                    onChange={(e) =>
                      handleChange("discount", Number(e.target.value))
                    }
                    className="border border-gray-300 rounded-lg pl-10 pr-4 py-2.5 text-sm w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SKU Code
                </label>
                <div className="relative">
                  <FaBarcode className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="e.g., RICE-500GM-001"
                    value={variant.sku || ""}
                    onChange={(e) => handleChange("sku", e.target.value)}
                    className="border border-gray-300 rounded-lg pl-10 pr-4 py-2.5 text-sm w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Stock Section */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <FaBox className="text-purple-600" />
              <h3 className="font-semibold text-gray-900">Stock Management</h3>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stock Quantity <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                required
                placeholder="0"
                value={variant.stock || ""}
                onChange={(e) => handleChange("stock", Number(e.target.value))}
                className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className={`mt-2 px-3 py-2 rounded-lg ${stockStatus.bgColor}`}>
                <p className={`text-sm font-medium ${stockStatus.color}`}>
                  Status: {stockStatus.label}
                </p>
              </div>
            </div>
          </div>

          {/* Shelf Life Section */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <FaCalendarAlt className="text-orange-600" />
              <h3 className="font-semibold text-gray-900">Shelf Life & Expiry</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="12"
                  value={variant.shelfLife?.duration || ""}
                  onChange={(e) =>
                    handleShelfLifeChange("duration", Number(e.target.value))
                  }
                  className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Unit
                </label>
                <select
                  value={variant.shelfLife?.unit || "months"}
                  onChange={(e) => handleShelfLifeChange("unit", e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="days">Days</option>
                  <option value="months">Months</option>
                  <option value="years">Years</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Manufacturing Date
                </label>
                <input
                  type="date"
                  value={variant.shelfLife?.manufacturingDate || ""}
                  onChange={(e) =>
                    handleShelfLifeChange("manufacturingDate", e.target.value)
                  }
                  className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiry Date
                </label>
                <input
                  type="date"
                  value={variant.shelfLife?.expiryDate || ""}
                  onChange={(e) =>
                    handleShelfLifeChange("expiryDate", e.target.value)
                  }
                  className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Best Before
              </label>
              <input
                type="text"
                placeholder="e.g., Best before 6 months from MFD"
                value={variant.shelfLife?.bestBefore || ""}
                onChange={(e) =>
                  handleShelfLifeChange("bestBefore", e.target.value)
                }
                className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* ---------- Footer ---------- */}
        <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex justify-end gap-3 rounded-b-xl shadow-lg">
          <button
            onClick={onClose}
            className="px-6 py-2.5 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 rounded-lg font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onSave(variant);
              onClose();
            }}
            disabled={!variant.unitValue || !variant.price}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm flex items-center gap-2"
          >
            <FaBox />
            Save Variant
          </button>
        </div>
      </div>
    </div>
  );
};

export default VariantModal;
