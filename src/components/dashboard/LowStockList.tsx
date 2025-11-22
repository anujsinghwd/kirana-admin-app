// src/components/dashboard/LowStockList.tsx
import React from "react";
import { FaExclamationCircle, FaBox } from "react-icons/fa";

type LowItem = { _id: string; name: string; images?: string[]; totalStock: number };

const LowStockList: React.FC<{ items: LowItem[] }> = ({ items }) => {
  if (!items || items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-3">
          <FaBox className="text-green-600 text-2xl" />
        </div>
        <p className="text-sm font-medium text-gray-900">All Stocked Up!</p>
        <p className="text-xs text-gray-500 mt-1">No low stock items at the moment</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((p) => (
        <div
          key={p._id}
          className="flex items-center justify-between gap-3 p-3 bg-red-50 border border-red-100 rounded-lg hover:bg-red-100 transition-colors"
        >
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {p.images?.[0] ? (
              <img
                src={p.images[0]}
                alt={p.name}
                className="w-12 h-12 rounded-lg object-cover flex-shrink-0 border-2 border-white shadow-sm"
              />
            ) : (
              <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center flex-shrink-0">
                <FaBox className="text-gray-400" />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold text-gray-900 truncate">{p.name}</div>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-xs text-red-600 font-medium">Stock: {p.totalStock}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex-shrink-0">
            <FaExclamationCircle />
            <span>Low</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LowStockList;
