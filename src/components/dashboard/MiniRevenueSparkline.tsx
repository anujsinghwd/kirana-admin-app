// src/components/dashboard/MiniRevenueSparkline.tsx
import React from "react";
import { RevenueDay } from "../../context/DashboardContext";

const MiniRevenueSparkline: React.FC<{ data: RevenueDay }> = ({ data }) => {
  if (!data || data.length === 0) {
    return <div className="text-xs text-gray-400">No data</div>;
  }

  const revenues = data.map((d) => Number(d.revenue) || 0);
  const max = Math.max(...revenues, 1);
  const allZero = revenues.every((r) => r === 0);

  if (allZero) {
    return <div className="text-xs text-gray-400">No revenue in selected period</div>;
  }

  return (
    <div className="flex items-end gap-1 h-16">
      {data.map((d, idx) => {
        const rev = Number(d.revenue) || 0;
        const heightPercent = Math.round((rev / max) * 100);
        return (
          <div key={d._id ?? idx} className="flex-1 flex items-end">
            <div
              role="img"
              aria-label={`${d._id}: ₹${rev.toFixed(2)}`}
              title={`${d._id}: ₹${rev.toFixed(2)}`}
              className="w-full rounded-t"
              style={{
                height: `${heightPercent}%`,
                background: "linear-gradient(180deg,#34d399,#10b981)",
                transition: "height 300ms ease",
                minHeight: "2px",
              }}
            />
          </div>
        );
      })}
    </div>
  );
};

export default MiniRevenueSparkline;
