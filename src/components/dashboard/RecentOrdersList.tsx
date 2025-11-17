// src/components/dashboard/RecentOrdersList.tsx
import React from "react";

type RecentOrderItem = {
  _id: string;
  orderId: string;
  totalAmt: number;
  order_status: string;
  createdAt: string;
};

const RecentOrdersList: React.FC<{ orders: RecentOrderItem[] }> = ({ orders }) => {
  if (!orders || orders.length === 0) return <div className="text-xs text-gray-400">No recent orders</div>;

  return (
    <div className="space-y-2">
      {orders.map((o) => (
        <div key={o._id} className="bg-white rounded-lg p-3 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-sm font-medium">#{o.orderId}</div>
            <div className="text-xs text-gray-500">{new Date(o.createdAt).toLocaleString()}</div>
          </div>
          <div className="text-right">
            <div className="text-sm font-semibold">₹{o.totalAmt.toFixed(2)}</div>
            <div className="text-xs text-gray-500">{o.order_status}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentOrdersList;
