import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
// import { VariantForm } from "./ProductForm";
import { IProductVariant } from "../../context/ProductContext";

interface VariantTableProps {
  variants: IProductVariant[];
  onEdit: (variant: IProductVariant, index: number) => void;
  onDelete: (index: number) => void;
}

/** ✅ Table for displaying variants */
const VariantTable: React.FC<VariantTableProps> = ({ variants, onEdit, onDelete }) => {
  if (variants.length === 0)
    return <p className="text-gray-500 text-sm">No variants added yet.</p>;

  return (
    <div className="overflow-x-auto border rounded-md shadow-sm">
      <table className="w-full text-sm text-left border-collapse">
        <thead className="bg-gray-100 text-gray-700 font-medium">
          <tr>
            <th className="p-3 border-b">#</th>
            <th className="p-3 border-b">Unit</th>
            <th className="p-3 border-b">Price</th>
            {/* <th className="p-3 border-b">Offer</th> */}
            <th className="p-3 border-b">Stock</th>
            {/* <th className="p-3 border-b">Discount</th> */}
            {/* <th className="p-3 border-b">Expiry</th> */}
            <th className="p-3 border-b text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {variants.map((v, i) => (
            <tr
              key={i}
              className="border-t hover:bg-gray-50 transition-colors duration-150"
            >
              <td className="p-3">{i + 1}</td>
              <td className="p-3">{v.unitValue + " " + v.unitType}</td>
              <td className="p-3">₹{v.price}</td>
              {/* <td className="p-3">{v.offerPrice ? `₹${v.offerPrice}` : "-"}</td> */}
              <td className="p-3">{v.stock}</td>
              {/* <td className="p-3">{v.discount ? `${v.discount}%` : "-"}</td> */}
              {/* <td className="p-3">
                {v.shelfLife?.expiryDate
                  ? new Date(v.shelfLife.expiryDate).toLocaleDateString()
                  : "-"}
              </td> */}
              <td className="p-3 text-right flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => onEdit(v, i)}
                  className="text-blue-600 hover:text-blue-800"
                  title="Edit variant"
                >
                  <FaEdit />
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(i)}
                  className="text-red-600 hover:text-red-800"
                  title="Delete variant"
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VariantTable;
