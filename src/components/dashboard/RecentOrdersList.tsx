// src/components/dashboard/RecentOrdersList.tsx
import React from "react";
import { FaShoppingCart, FaClock } from "react-icons/fa";

type RecentOrderItem = {
  _id: string;
  orderId: string;
  totalAmt: number;
  order_status: string;
  createdAt: string;
};

const RecentOrdersList: React.FC<{ orders: RecentOrderItem[] }> = ({ orders }) => {
  if (!orders || orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
          <FaShoppingCart className="text-gray-400 text-2xl" />
        </div>
        <p className="text-sm font-medium text-gray-900">No Recent Orders</p>
        <p className="text-xs text-gray-500 mt-1">Orders will appear here as they come in</p>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower.includes("delivered")) return "bg-green-100 text-green-700 border-green-200";
    if (statusLower.includes("cancelled") || statusLower.includes("rejected")) return "bg-red-100 text-red-700 border-red-200";
    if (statusLower.includes("confirmed") || statusLower.includes("preparing")) return "bg-blue-100 text-blue-700 border-blue-200";
    if (statusLower.includes("out for delivery") || statusLower.includes("ready")) return "bg-purple-100 text-purple-700 border-purple-200";
    return "bg-yellow-100 text-yellow-700 border-yellow-200";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-3">
      {orders.map((o) => (
        <div
          key={o._id}
          className="bg-gradient-to-r from-white to-gray-50 border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all"
        >
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <FaShoppingCart className="text-indigo-600" />
              </div>
              <div>
                <div className="text-sm font-bold text-gray-900">#{o.orderId}</div>
                <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
                  <FaClock className="text-[10px]" />
                  <span>{formatDate(o.createdAt)}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-gray-900">₹{o.totalAmt.toFixed(2)}</div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${getStatusColor(o.order_status)}`}>
              {o.order_status}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentOrdersList;
