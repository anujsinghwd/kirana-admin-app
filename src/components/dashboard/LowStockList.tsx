// src/components/dashboard/LowStockList.tsx
import React from "react";

type LowItem = { _id: string; name: string; images?: string[]; totalStock: number };

const LowStockList: React.FC<{ items: LowItem[] }> = ({ items }) => {
  if (!items || items.length === 0) {
    return <div className="text-xs text-gray-400">All good — no low stock</div>;
  }

  return (
    <div className="space-y-2">
      {items.map((p) => (
        <div key={p._id} className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <img src={p.images?.[0]} alt={p.name} className="w-10 h-10 rounded object-cover flex-shrink-0" />
            <div className="min-w-0">
              <div className="text-sm truncate">{p.name}</div>
              <div className="text-xs text-gray-500">Stock: {p.totalStock}</div>
            </div>
          </div>
          <div className="text-xs text-red-600 font-semibold">Restock</div>
        </div>
      ))}
    </div>
  );
};

export default LowStockList;
