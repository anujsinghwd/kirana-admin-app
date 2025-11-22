// src/components/dashboard/TopProductsList.tsx
import React from "react";
import { FaTrophy, FaBox, FaArrowUp } from "react-icons/fa";

type TopProductItem = {
  _id: string;
  name: string;
  image?: string;
  quantitySold: number;
  revenue: number;
};

const TopProductsList: React.FC<{ products: TopProductItem[] }> = ({ products }) => {
  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
          <FaTrophy className="text-gray-400 text-2xl" />
        </div>
        <p className="text-sm font-medium text-gray-900">No Sales Yet</p>
        <p className="text-xs text-gray-500 mt-1">Top products will appear here</p>
      </div>
    );
  }

  const getMedalColor = (index: number) => {
    if (index === 0) return "from-yellow-400 to-yellow-600";
    if (index === 1) return "from-gray-300 to-gray-500";
    if (index === 2) return "from-orange-400 to-orange-600";
    return "from-blue-100 to-indigo-100";
  };

  const getMedalIcon = (index: number) => {
    if (index < 3) return <FaTrophy className="text-white text-xs" />;
    return <span className="text-xs font-bold text-indigo-600">{index + 1}</span>;
  };

  return (
    <div className="space-y-3">
      {products.map((p, index) => (
        <div
          key={p._id}
          className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 border border-blue-100 rounded-lg hover:shadow-sm transition-all"
        >
          {/* Rank Badge */}
          <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${getMedalColor(index)} flex items-center justify-center flex-shrink-0 shadow-sm`}>
            {getMedalIcon(index)}
          </div>

          {/* Product Image */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {p.image ? (
              <img
                src={p.image}
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
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-gray-500">Sold: {p.quantitySold}</span>
                <span className="text-gray-300">•</span>
                <span className="text-xs font-semibold text-green-600 flex items-center gap-1">
                  <FaArrowUp className="text-[8px]" />
                  ₹{p.revenue.toFixed(0)}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TopProductsList;
