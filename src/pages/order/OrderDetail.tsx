// src/pages/AdminOrderDetail.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaChevronLeft,
  FaUserAlt,
  FaMapMarkerAlt,
  FaCircle,
  FaFileInvoice,
  FaCheckCircle,
  FaTruck,
  FaClock,
  FaBox,
  FaPhone,
} from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import dayjs from "dayjs";
import { useOrders } from "../../context/OrderContext";
import toast from "react-hot-toast";

type StaffPayload = {
  name: string;
  contact?: string;
  role?: "Delivery" | "Picker" | "Manager" | "Cashier" | string;
};

// Status configuration with icons and colors
const statusConfig: Record<string, { icon: any; color: string; bg: string; text: string }> = {
  Pending: { icon: FaClock, color: "gray", bg: "bg-gray-100", text: "text-gray-700" },
  Confirmed: { icon: FaCheckCircle, color: "blue", bg: "bg-blue-100", text: "text-blue-700" },
  Preparing: { icon: FaBox, color: "yellow", bg: "bg-yellow-100", text: "text-yellow-700" },
  Ready: { icon: FaCheckCircle, color: "purple", bg: "bg-purple-100", text: "text-purple-700" },
  "Out for Delivery": { icon: FaTruck, color: "orange", bg: "bg-orange-100", text: "text-orange-700" },
  Delivered: { icon: FaCheckCircle, color: "green", bg: "bg-green-100", text: "text-green-700" },
  Cancelled: { icon: MdCancel, color: "red", bg: "bg-red-100", text: "text-red-700" },
  Rejected: { icon: MdCancel, color: "red", bg: "bg-red-100", text: "text-red-700" },
};

const OrderDetailPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();

  const {
    fetchOrderById,
    order,
    singleOrder,
    loadingConfig,
    updateOrderStatus,
    assignPersonnel,
    fetchOrders,
  } = useOrders() as any;

  const [localOrder, setLocalOrder] = useState<any | null>(singleOrder);
  const [assignVisible, setAssignVisible] = useState(false);
  const [staff, setStaff] = useState<StaffPayload>({ name: "", contact: "", role: "Delivery" });

  useEffect(() => { setLocalOrder(singleOrder) }, [singleOrder]);

  useEffect(() => {
    if (!orderId) return;
    (async () => {
      try {
        await fetchOrderById(orderId);
      } catch (err) {
        toast.error("Failed to load order");
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  useEffect(() => {
    // if (order && order.orderId === orderId) setLocalOrder(order);
  }, [order, orderId]);

  if (!localOrder && loadingConfig?.loading) {
    return (
      <div className="min-h-screen p-4 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">{loadingConfig.text || "Loading order..."}</p>
        </div>
      </div>
    );
  }

  if (!localOrder) {
    return (
      <div className="min-h-screen p-4 bg-gray-50">
        <div className="mb-4">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900">
            <FaChevronLeft /> Back
          </button>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <p className="text-gray-400 text-lg">Order not found</p>
        </div>
      </div>
    );
  }

  const {
    _id,
    orderId: oid,
    createdAt,
    totalAmt,
    subTotalAmt,
    totalDiscount,
    order_status,
    orderType,
    payment_status,
    payment_method,
    delivery_address,
    items,
    tracking = [],
    assigned_personnel = [],
  } = localOrder;

  const handleStatusUpdate = async (newStatus: string) => {
    try {
      await updateOrderStatus(oid || _id || localOrder._id, newStatus);
      toast.success(`Order updated to ${newStatus}`);
      fetchOrders();
      const refreshed = await fetchOrderById(orderId);
      setLocalOrder(refreshed?.data ?? refreshed ?? localOrder);
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const handleCancel = async () => {
    try {
      await updateOrderStatus(oid || _id || localOrder._id, "Cancelled");
      toast.success("Order cancelled");
      fetchOrders();
      const refreshed = await fetchOrderById(orderId);
      setLocalOrder(refreshed?.data ?? refreshed ?? localOrder);
    } catch {
      toast.error("Failed to cancel");
    }
  };

  const handleAssign = async () => {
    if (!staff.name?.trim()) {
      toast.error("Please enter staff name");
      return;
    }
    try {
      await assignPersonnel(oid || _id || localOrder._id, staff);
      toast.success("Personnel assigned");
      setStaff({ name: "", contact: "", role: "Delivery" });
      setAssignVisible(false);
      await fetchOrderById(orderId);
    } catch (err) {
      toast.error("Failed to assign");
    }
  };

  const handleDownloadInvoice = async () => {
    navigate(`/invoice/${orderId}`);
  };

  const currentStatusConfig = statusConfig[order_status] || statusConfig.Pending;
  const StatusIcon = currentStatusConfig.icon;

  // Order progress steps
  const progressSteps = ["Pending", "Confirmed", "Preparing", "Ready", "Out for Delivery", "Delivered"];
  const currentStepIndex = progressSteps.indexOf(order_status);
  const isCancelled = order_status === "Cancelled" || order_status === "Rejected";

  return (
    <div className="min-h-screen bg-gray-50 pb-24 md:pb-8">
      {/* Enhanced Header */}
      <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Go back"
              >
                <FaChevronLeft className="text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">#{oid}</h1>
                <p className="text-sm text-gray-500 mt-0.5">
                  {dayjs(createdAt).format("DD MMM, YYYY • h:mm A")}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleDownloadInvoice}
                className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
                title="View invoice"
              >
                <FaFileInvoice /> Invoice
              </button>
              <div className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium ${currentStatusConfig.bg} ${currentStatusConfig.text}`}>
                <StatusIcon className="text-base" />
                <span className="hidden sm:inline">{order_status}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Order Progress Indicator */}
        {!isCancelled && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Order Progress</h3>
            <div className="relative">
              {/* Progress bar background */}
              <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 rounded-full"></div>
              {/* Progress bar fill */}
              <div
                className="absolute top-5 left-0 h-1 bg-blue-600 rounded-full transition-all duration-500"
                style={{ width: `${(currentStepIndex / (progressSteps.length - 1)) * 100}%` }}
              ></div>

              {/* Steps */}
              <div className="relative flex justify-between">
                {progressSteps.map((step, index) => {
                  const isCompleted = index <= currentStepIndex;
                  const isCurrent = index === currentStepIndex;
                  const stepConfig = statusConfig[step];
                  const StepIcon = stepConfig?.icon || FaCircle;

                  return (
                    <div key={step} className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${isCompleted
                          ? 'bg-blue-600 text-white shadow-lg'
                          : 'bg-gray-200 text-gray-400'
                          } ${isCurrent ? 'ring-4 ring-blue-200' : ''}`}
                      >
                        <StepIcon className="text-sm" />
                      </div>
                      <span className={`text-xs mt-2 font-medium text-center max-w-[80px] ${isCompleted ? 'text-gray-900' : 'text-gray-400'
                        }`}>
                        {step}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Cancelled/Rejected Alert */}
        {isCancelled && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center gap-3">
            <MdCancel className="text-red-600 text-2xl flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-red-900">Order {order_status}</h3>
              <p className="text-sm text-red-700">This order has been {order_status.toLowerCase()}.</p>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="text-sm text-gray-500 mb-1">Order Type</div>
            <div className="font-semibold text-gray-900">{orderType}</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="text-sm text-gray-500 mb-1">Payment</div>
            <div className="font-semibold text-gray-900">{payment_method}</div>
            <div className="text-xs text-gray-500">{payment_status}</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 col-span-2">
            <div className="text-sm text-gray-500 mb-1">Total Amount</div>
            <div className="text-2xl font-bold text-green-600">₹{totalAmt?.toFixed(2)}</div>
          </div>
        </div>

        {/* Customer & Delivery Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <FaUserAlt className="text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Customer Details</h3>
            </div>
            <div className="space-y-2">
              <div>
                <div className="text-sm text-gray-500">Name</div>
                <div className="font-medium text-gray-900">{localOrder.customer_name?.name || "N/A"}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Contact</div>
                <div className="font-medium text-gray-900 flex items-center gap-2">
                  <FaPhone className="text-xs text-gray-400" />
                  {localOrder.customer_name?.mobile || "N/A"}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <FaMapMarkerAlt className="text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Delivery Address</h3>
            </div>
            {delivery_address ? (
              <div className="space-y-1">
                <div className="font-medium text-gray-900">
                  {delivery_address?.name || delivery_address?.address_line || ""}
                </div>
                <div className="text-sm text-gray-600">
                  {delivery_address?.addressLine1 || ""} {delivery_address?.state || ""}
                </div>
                <div className="text-sm text-gray-600">
                  {delivery_address?.city || ""} - {delivery_address?.pincode || ""}
                </div>
              </div>
            ) : (
              <div className="text-sm text-gray-500">No delivery address (Takeout)</div>
            )}
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-lg shadow-sm p-5 mb-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FaBox className="text-blue-600" />
            Order Items ({items.length})
          </h3>
          <div className="space-y-3">
            {items.map((it: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-4 flex-1">
                  <img
                    src={it.image}
                    alt={it.name}
                    className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{it.name}</div>
                    <div className="text-sm text-gray-500 mt-1">
                      Qty: {it.quantity} × {it.unit ?? it.unitType ?? "unit"}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      ₹{it.price?.toFixed(2)} each
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-900 text-lg">₹{it.subTotal?.toFixed(2)}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="mt-6 pt-4 border-t border-gray-200 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium text-gray-900">₹{subTotalAmt?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Discount</span>
              <span className="font-medium text-green-600">- ₹{totalDiscount?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
              <span className="text-gray-900">Grand Total</span>
              <span className="text-green-600">₹{totalAmt?.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Tracking Timeline */}
        <div className="bg-white rounded-lg shadow-sm p-5 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <FaClock className="text-blue-600" />
              Order Timeline
            </h3>
          </div>

          <div className="space-y-4">
            {tracking && tracking.length > 0 ? (
              tracking.map((t: any, i: number) => {
                const trackingConfig = statusConfig[t.status] || statusConfig.Pending;
                const TrackingIcon = trackingConfig.icon;
                const isLast = i === tracking.length - 1;

                return (
                  <div key={i} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${trackingConfig.bg}`}>
                        <TrackingIcon className={`text-sm ${trackingConfig.text}`} />
                      </div>
                      {!isLast && <div className="w-0.5 h-full bg-gray-200 mt-2"></div>}
                    </div>
                    <div className="flex-1 pb-6">
                      <div className="font-semibold text-gray-900">{t.status}</div>
                      {t.note && <div className="text-sm text-gray-600 mt-1">{t.note}</div>}
                      <div className="text-xs text-gray-400 mt-2">
                        {dayjs(t.timestamp).format("DD MMM, YYYY • h:mm A")}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-gray-400">
                <FaClock className="text-4xl mx-auto mb-2 opacity-50" />
                <p className="text-sm">No tracking updates yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Assigned Personnel */}
        {assigned_personnel && assigned_personnel.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-5 mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">Assigned Personnel</h3>
            <div className="space-y-3">
              {assigned_personnel.map((p: any, i: number) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <FaUserAlt className="text-blue-600 text-sm" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {p.name} <span className="text-xs text-gray-500">({p.role})</span>
                      </div>
                      {p.contact && (
                        <div className="text-sm text-gray-600 flex items-center gap-1 mt-0.5">
                          <FaPhone className="text-xs" /> {p.contact}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-xs text-gray-400">
                    {dayjs(p.assignedAt).format("DD MMM, h:mm A")}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sticky Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 md:hidden z-20">
        <div className="flex gap-2 max-w-6xl mx-auto">
          {!isCancelled && (
            <>
              <button
                onClick={() => handleStatusUpdate("Confirmed")}
                className="flex-1 px-4 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
              >
                Confirm
              </button>
              <button
                onClick={() => handleStatusUpdate("Preparing")}
                className="flex-1 px-4 py-3 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white font-medium transition-colors"
              >
                Prepare
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-3 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 font-medium transition-colors"
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>

      {/* Desktop Actions */}
      <div className="hidden md:block max-w-6xl mx-auto px-4 pb-6">
        <div className="bg-white rounded-lg shadow-sm p-5">
          <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="flex flex-wrap gap-3">
            {!isCancelled && (
              <>
                <button
                  onClick={() => handleStatusUpdate("Confirmed")}
                  className="px-4 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium transition-colors flex items-center gap-2"
                >
                  <FaCheckCircle /> Confirm Order
                </button>
                <button
                  onClick={() => handleStatusUpdate("Preparing")}
                  className="px-4 py-2 rounded-lg bg-yellow-50 hover:bg-yellow-100 text-yellow-700 font-medium transition-colors flex items-center gap-2"
                >
                  <FaBox /> Start Preparing
                </button>
                <button
                  onClick={() => handleStatusUpdate("Ready")}
                  className="px-4 py-2 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 font-medium transition-colors flex items-center gap-2"
                >
                  <FaCheckCircle /> Mark Ready
                </button>
                <button
                  onClick={() => handleStatusUpdate("Out for Delivery")}
                  className="px-4 py-2 rounded-lg bg-orange-50 hover:bg-orange-100 text-orange-700 font-medium transition-colors flex items-center gap-2"
                >
                  <FaTruck /> Out for Delivery
                </button>
                <button
                  onClick={() => handleStatusUpdate("Delivered")}
                  className="px-4 py-2 rounded-lg bg-green-50 hover:bg-green-100 text-green-700 font-medium transition-colors flex items-center gap-2"
                >
                  <FaCheckCircle /> Mark Delivered
                </button>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 font-medium transition-colors flex items-center gap-2"
                >
                  <MdCancel /> Cancel Order
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
