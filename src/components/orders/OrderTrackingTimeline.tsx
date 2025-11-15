import React from "react";
import { FaCheckCircle } from "react-icons/fa";
import { IOrderTracking } from "../../pages/OrderPage";

const OrderTrackingTimeline = ({ tracking }: any) => {
  if (!tracking || tracking.length === 0)
    return (
      <p className="text-xs text-gray-500 bg-white p-2 rounded">
        No tracking updates yet.
      </p>
    );

  return (
    <div className="bg-white border rounded p-3">
      <h3 className="font-semibold text-sm mb-2">Order Timeline</h3>

      <div className="flex flex-col gap-3">
        {tracking.map((log: IOrderTracking, index: number) => (
          <div key={index} className="flex gap-2">
            <FaCheckCircle className="text-green-600 mt-0.5" />
            <div>
              <p className="font-medium text-gray-800">{log.status}</p>
              <p className="text-xs text-gray-500">
                {new Date(log.timestamp).toLocaleString()}
              </p>
              {log.note && (
                <p className="text-xs text-gray-600 mt-1">{log.note}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderTrackingTimeline;
