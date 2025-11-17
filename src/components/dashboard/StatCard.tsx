// src/components/dashboard/StatCard.tsx
import React from "react";

const StatCard: React.FC<{
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  className?: string;
}> = ({ title, value, icon, className }) => (
  <div className={`bg-white rounded-lg p-3 shadow-sm flex items-center gap-3 ${className || ""}`}>
    <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center text-green-700 text-lg">
      {icon}
    </div>
    <div>
      <div className="text-xs text-gray-500">{title}</div>
      <div className="font-semibold text-lg text-gray-800">{value}</div>
    </div>
  </div>
);

export default StatCard;
