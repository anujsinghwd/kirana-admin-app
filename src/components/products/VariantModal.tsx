import React, { useState, useEffect } from "react";
import { IProductVariant } from "../../context/ProductContext";

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

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center md:py-8">
      <div
        className="
          bg-white rounded-t-2xl md:rounded-lg shadow-lg 
          w-full h-full md:h-auto 
          md:max-w-2xl 
          overflow-y-auto 
          flex flex-col
          animate-slideUp
        "
      >
        {/* ---------- Header ---------- */}
        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center z-10">
          <h2 className="font-semibold text-lg text-gray-800">
            {initialData ? "Edit Variant" : "Add Variant"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800 text-xl font-bold"
          >
            ×
          </button>
        </div>

        {/* ---------- Body ---------- */}
        <div className="p-4 flex-1 overflow-y-auto space-y-4">
          {/* Variant Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Unit Value
              </label>
              <input
                type="number"
                min="0"
                placeholder="Enter unit value"
                value={variant.unitValue || ""}
                onChange={(e) =>
                  handleChange("unitValue", Number(e.target.value))
                }
                className="border rounded p-2 text-sm w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Unit Type
              </label>
              <select
                value={variant.unitType}
                onChange={(e) => handleChange("unitType", e.target.value)}
                className="border rounded p-2 text-sm w-full"
              >
                <option value="gm">gm</option>
                <option value="kg">kg</option>
                <option value="ml">ml</option>
                <option value="ltr">ltr</option>
                <option value="piece">piece</option>
                <option value="packet">packet</option>
                <option value="box">box</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price (₹)
              </label>
              <input
                type="number"
                min="0"
                placeholder="Enter price"
                value={variant.price || ""}
                onChange={(e) => handleChange("price", Number(e.target.value))}
                className="border rounded p-2 text-sm w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Offer Price (₹)
              </label>
              <input
                type="number"
                min="0"
                placeholder="Enter offer price"
                value={variant.offerPrice || ""}
                onChange={(e) =>
                  handleChange("offerPrice", Number(e.target.value))
                }
                className="border rounded p-2 text-sm w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Discount (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                placeholder="Enter discount"
                value={variant.discount || ""}
                onChange={(e) =>
                  handleChange("discount", Number(e.target.value))
                }
                className="border rounded p-2 text-sm w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stock
              </label>
              <input
                type="number"
                min="0"
                placeholder="Enter stock quantity"
                value={variant.stock || ""}
                onChange={(e) => handleChange("stock", Number(e.target.value))}
                className="border rounded p-2 text-sm w-full"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SKU
              </label>
              <input
                type="text"
                placeholder="Enter SKU code"
                value={variant.sku || ""}
                onChange={(e) => handleChange("sku", e.target.value)}
                className="border rounded p-2 text-sm w-full"
              />
            </div>
          </div>

          {/* ---------- Shelf Life ---------- */}
          <div className="mt-4 border-t pt-3">
            <h3 className="font-medium text-gray-700 mb-2 text-sm">Shelf Life</h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="Enter duration"
                  value={variant.shelfLife?.duration || ""}
                  onChange={(e) =>
                    handleShelfLifeChange("duration", Number(e.target.value))
                  }
                  className="border rounded p-2 text-sm w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration Unit
                </label>
                <select
                  value={variant.shelfLife?.unit || "months"}
                  onChange={(e) => handleShelfLifeChange("unit", e.target.value)}
                  className="border rounded p-2 text-sm w-full"
                >
                  <option value="days">days</option>
                  <option value="months">months</option>
                  <option value="years">years</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Manufacturing Date
                </label>
                <input
                  type="date"
                  value={variant.shelfLife?.manufacturingDate || ""}
                  onChange={(e) =>
                    handleShelfLifeChange("manufacturingDate", e.target.value)
                  }
                  className="border rounded p-2 text-sm w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expiry Date
                </label>
                <input
                  type="date"
                  value={variant.shelfLife?.expiryDate || ""}
                  onChange={(e) =>
                    handleShelfLifeChange("expiryDate", e.target.value)
                  }
                  className="border rounded p-2 text-sm w-full"
                />
              </div>
            </div>

            <div className="mt-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Best Before
              </label>
              <input
                type="text"
                placeholder="e.g. Best before 6 months from MFD"
                value={variant.shelfLife?.bestBefore || ""}
                onChange={(e) =>
                  handleShelfLifeChange("bestBefore", e.target.value)
                }
                className="border rounded p-2 text-sm w-full"
              />
            </div>
          </div>
        </div>

        {/* ---------- Footer ---------- */}
        <div className="sticky bottom-0 bg-white border-t p-3 flex justify-end gap-3 z-10">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onSave(variant);
              onClose();
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save Variant
          </button>
        </div>
      </div>
    </div>
  );
};

export default VariantModal;
