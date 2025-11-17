// src/components/dashboard/TopProductsList.tsx
import React from "react";

type TopProductItem = {
  _id: string;
  name: string;
  image?: string;
  quantitySold: number;
  revenue: number;
};

const TopProductsList: React.FC<{ products: TopProductItem[] }> = ({ products }) => {
  if (!products || products.length === 0) {
    return <div className="text-xs text-gray-400">No top products</div>;
  }

  return (
    <div className="space-y-2">
      {products.map((p) => (
        <div key={p._id} className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <img src={p.image} alt={p.name} className="w-10 h-10 rounded object-cover flex-shrink-0" />
            <div className="min-w-0">
              <div className="text-sm font-medium truncate">{p.name}</div>
              <div className="text-xs text-gray-500">Sold: {p.quantitySold}</div>
            </div>
          </div>
          <div className="text-sm font-semibold">₹{p.revenue.toFixed(0)}</div>
        </div>
      ))}
    </div>
  );
};

export default TopProductsList;
