// src/components/dashboard/MiniRevenueSparkline.tsx
import React from "react";
import { RevenueDay } from "../../context/DashboardContext";
import { FaChartLine } from "react-icons/fa";

const MiniRevenueSparkline: React.FC<{ data: RevenueDay }> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
          <FaChartLine className="text-gray-400 text-2xl" />
        </div>
        <p className="text-sm font-medium text-gray-900">No Data Available</p>
        <p className="text-xs text-gray-500 mt-1">Revenue data will appear here</p>
      </div>
    );
  }

  const revenues = data.map((d) => Number(d.revenue) || 0);
  const max = Math.max(...revenues, 1);
  const allZero = revenues.every((r) => r === 0);

  if (allZero) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-3">
          <FaChartLine className="text-blue-600 text-2xl" />
        </div>
        <p className="text-sm font-medium text-gray-900">No Revenue Yet</p>
        <p className="text-xs text-gray-500 mt-1">Revenue will be tracked here</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Chart */}
      <div className="relative bg-gradient-to-b from-blue-50 to-transparent rounded-lg p-4 border border-blue-100">
        <div className="flex items-end justify-between gap-1 h-32">
          {data.map((d, idx) => {
            const rev = Number(d.revenue) || 0;
            const heightPercent = Math.max((rev / max) * 100, 2);
            const isHighest = rev === max;

            return (
              <div
                key={d._id ?? idx}
                className="flex-1 flex flex-col items-center gap-1 group cursor-pointer"
              >
                {/* Tooltip on hover */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-12 bg-gray-900 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap pointer-events-none">
                  ₹{rev.toFixed(2)}
                </div>

                {/* Bar */}
                <div className="w-full flex items-end justify-center" style={{ height: '100%' }}>
                  <div
                    role="img"
                    aria-label={`${d._id}: ₹${rev.toFixed(2)}`}
                    title={`${d._id}: ₹${rev.toFixed(2)}`}
                    className={`w-full rounded-t-lg transition-all duration-300 group-hover:opacity-80 ${isHighest ? 'shadow-lg' : ''
                      }`}
                    style={{
                      height: `${heightPercent}%`,
                      background: isHighest
                        ? "linear-gradient(180deg, #3b82f6, #6366f1)"
                        : "linear-gradient(180deg, #60a5fa, #818cf8)",
                      minHeight: "4px",
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-3 border border-blue-100">
          <p className="text-xs text-gray-600 mb-1">Total</p>
          <p className="text-sm font-bold text-gray-900">
            ₹{revenues.reduce((a, b) => a + b, 0).toFixed(2)}
          </p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-3 border border-green-100">
          <p className="text-xs text-gray-600 mb-1">Average</p>
          <p className="text-sm font-bold text-gray-900">
            ₹{(revenues.reduce((a, b) => a + b, 0) / revenues.length).toFixed(2)}
          </p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-3 border border-purple-100">
          <p className="text-xs text-gray-600 mb-1">Peak</p>
          <p className="text-sm font-bold text-gray-900">₹{max.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default MiniRevenueSparkline;
