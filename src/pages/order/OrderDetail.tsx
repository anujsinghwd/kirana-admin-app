// src/pages/AdminOrderDetail.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  FaChevronLeft,
  FaUserAlt,
  FaMapMarkerAlt,
  FaCircle,
  FaTruck,
  FaClock,
  FaCheckCircle,
  FaUserPlus,
  FaFileInvoice,
  FaPaperPlane,
} from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { useOrders } from "../../context/OrderContext";
import toast from "react-hot-toast";

type StaffPayload = {
  name: string;
  contact?: string;
  role?: "Delivery" | "Picker" | "Manager" | "Cashier" | string;
};

const smallBadge = (status: string) => {
  const map: Record<string, string> = {
    Delivered: "bg-green-100 text-green-700",
    Completed: "bg-green-100 text-green-700",
    Cancelled: "bg-red-100 text-red-700",
    Processing: "bg-yellow-100 text-yellow-700",
    Packed: "bg-blue-100 text-blue-700",
    "Out for Delivery": "bg-orange-100 text-orange-700",
    Pending: "bg-gray-100 text-gray-700",
    "Takeout Ready": "bg-purple-100 text-purple-700",
  };
  return map[status] ?? "bg-gray-100 text-gray-700";
};

const OrderDetailPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();

  // Context (adapt method names if different)
  const {
    fetchOrderById, // should return single order
    order,
    singleOrder,
    loadingConfig,
    updateOrderStatus,
    assignPersonnel,
    addTracking,
    downloadInvoice, // optional helper from context
    fetchOrders, // to refresh list after updates
  } = useOrders() as any;

  const [localOrder, setLocalOrder] = useState<any | null>(singleOrder);
  const [assignVisible, setAssignVisible] = useState(false);
  const [staff, setStaff] = useState<StaffPayload>({ name: "", contact: "", role: "Delivery" });
  const [note, setNote] = useState<string>("");

  useEffect(() => {
    if (!orderId) return;
    (async () => {
      try {
        const data = await fetchOrderById(orderId);
        // some contexts return data.data or data — attempt both
        // console.log(data);
        // setLocalOrder(data?.data ?? data ?? order ?? null);
      } catch (err) {
        toast.error("Failed to load order");
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  // If context `order` updates, keep local in sync
  useEffect(() => {
    // if (order && order.orderId === orderId) setLocalOrder(order);
  }, [order, orderId]);

  if (!localOrder && loadingConfig?.loading) {
    return (
      <div className="min-h-screen p-4 flex items-center justify-center">
        <p className="text-gray-500">{loadingConfig.text || "Loading order..."}</p>
      </div>
    );
  }

  if (!localOrder) {
    return (
      <div className="min-h-screen p-4">
        <div className="mb-4">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-700">
            <FaChevronLeft /> Back
          </button>
        </div>
        <p className="text-center text-gray-400 mt-6">Order not found</p>
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
    invoice_receipt,
  } = localOrder;

  const handleStatusUpdate = async (newStatus: string) => {
    try {
      await updateOrderStatus(oid || _id || localOrder._id, newStatus);
      toast.success(`Order updated to ${newStatus}`);
      fetchOrders(); // refresh list
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
      const refreshed = await fetchOrderById(orderId);
    //   setLocalOrder(refreshed?.data ?? refreshed ?? localOrder);
    } catch (err) {
      toast.error("Failed to assign");
    }
  };

  const handleAddTracking = async () => {
    if (!note.trim()) {
      toast.error("Add a note for tracking");
      return;
    }
    try {
      await addTracking(oid || _id || localOrder._id, { status: order_status, note });
      toast.success("Note added");
      setNote("");
      const refreshed = await fetchOrderById(orderId);
    //   setLocalOrder(refreshed?.data ?? refreshed ?? localOrder);
    } catch {
      toast.error("Failed to add note");
    }
  };

  const handleDownloadInvoice = async () => {
    try {
      if (downloadInvoice) {
        await downloadInvoice(oid || _id || localOrder._id);
      } else if (invoice_receipt) {
        window.open(invoice_receipt, "_blank");
      } else {
        toast.error("No invoice available");
      }
    } catch {
      toast.error("Failed to download invoice");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 pb-10">
      {/* header - mobile-first, full width */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 rounded bg-white shadow-sm">
            <FaChevronLeft />
          </button>
          <div>
            <h1 className="text-base font-semibold">Order #{oid}</h1>
            <p className="text-xs text-gray-500">{new Date(createdAt).toLocaleString()}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadInvoice}
            className="flex items-center gap-2 px-3 py-2 bg-white rounded shadow-sm text-sm"
            title="Download invoice"
          >
            <FaFileInvoice /> Invoice
          </button>
          <span className={`px-3 py-2 rounded text-sm ${smallBadge(order_status)}`}>
            {order_status}
          </span>
        </div>
      </div>

      {/* summary */}
      <div className="bg-white shadow-sm rounded-md p-3 mb-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-600">Type</div>
            <div className="font-medium">{orderType}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Payment</div>
            <div className="font-medium">{payment_method} • {payment_status}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Total</div>
            <div className="font-semibold text-green-700">₹{totalAmt?.toFixed(2)}</div>
          </div>
        </div>
      </div>

      {/* address & customer */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="bg-white p-3 rounded-md shadow-sm">
          <h3 className="text-sm font-semibold mb-2">Customer</h3>
          <div className="flex items-start gap-3">
            <FaUserAlt className="text-gray-500 mt-1" />
            <div className="text-sm">
              <div className="font-medium">{localOrder.userId?.name}</div>
              <div className="text-xs text-gray-500">{localOrder.userId?.mobile}</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-3 rounded-md shadow-sm">
          <h3 className="text-sm font-semibold mb-2">Delivery</h3>
          {delivery_address ? (
            <div className="flex items-start gap-3">
              <FaMapMarkerAlt className="text-gray-500 mt-1" />
              <div className="text-sm">
                <div className="font-medium">
                  {delivery_address?.name || `${delivery_address?.addressLine1 ?? ""}`}
                </div>
                <div className="text-xs text-gray-500">
                  {delivery_address?.addressLine1 ?? ""} {delivery_address?.addressLine2 ?? ""} <br />
                  {delivery_address?.city ?? ""} {delivery_address?.pincode ?? ""}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-sm text-gray-500">No delivery address (Takeout)</div>
          )}
        </div>
      </div>

      {/* items */}
      <section className="mt-4 bg-white rounded-md shadow-sm p-3">
        <h3 className="font-semibold mb-2">Items</h3>
        <div className="space-y-2 divide-y">
          {items.map((it: any, idx: number) => (
            <div key={idx} className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <img src={it.image} alt={it.name} className="w-12 h-12 rounded object-cover" />
                <div>
                  <div className="font-medium text-sm">{it.name}</div>
                  <div className="text-xs text-gray-500">
                    {it.quantity} × {it.unit ?? it.unitType ?? ""}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold">₹{it.subTotal?.toFixed(2)}</div>
                <div className="text-xs text-gray-400">₹{it.price?.toFixed(2)}</div>
              </div>
            </div>
          ))}
        </div>

        {/* totals */}
        <div className="mt-3 border-t pt-3 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₹{subTotalAmt?.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Discount</span>
            <span>- ₹{totalDiscount?.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-semibold mt-2">
            <span>Grand Total</span>
            <span>₹{totalAmt?.toFixed(2)}</span>
          </div>
        </div>
      </section>

      {/* tracking timeline */}
      <section className="mt-4 bg-white rounded-md shadow-sm p-3">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold">Tracking</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleStatusUpdate("Processing")}
              className="px-3 py-1 text-xs rounded bg-yellow-50 text-yellow-700"
            >
              Processing
            </button>
            <button
              onClick={() => handleStatusUpdate("Out for Delivery")}
              className="px-3 py-1 text-xs rounded bg-blue-50 text-blue-700"
            >
              Out
            </button>
            <button
              onClick={() => handleStatusUpdate("Delivered")}
              className="px-3 py-1 text-xs rounded bg-green-50 text-green-700"
            >
              Delivered
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {tracking && tracking.length > 0 ? (
            tracking.map((t: any, i: number) => (
              <div key={i} className="flex items-start gap-3">
                <div className="pt-1">
                  <FaCircle className="text-xs text-green-400" />
                </div>
                <div className="flex-1 text-sm">
                  <div className="font-medium">{t.status}</div>
                  <div className="text-xs text-gray-500">{t.note}</div>
                  <div className="text-xs text-gray-400 mt-1">{new Date(t.timestamp).toLocaleString()}</div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-sm text-gray-500">No tracking updates yet.</div>
          )}
        </div>

        <div className="mt-3">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add note/update for tracking..."
            className="w-full border rounded p-2 text-sm"
            rows={2}
          />
          <div className="flex gap-2 mt-2">
            <button onClick={handleAddTracking} className="flex-1 bg-green-600 text-white px-3 py-2 rounded">Add Note</button>
            <button onClick={() => setNote("")} className="px-3 py-2 bg-gray-100 rounded">Clear</button>
          </div>
        </div>
      </section>

      {/* personnel & actions */}
      <section className="mt-4 bg-white rounded-md shadow-sm p-3">
        {/* <div className="flex items-center justify-between">
          <h3 className="font-semibold">Assigned Personnel</h3>
          <button onClick={() => setAssignVisible(v => !v)} className="text-sm text-blue-600 flex items-center gap-2">
            <FaUserPlus /> {assignVisible ? "Close" : "Assign"}
          </button>
        </div> */}

        <div className="mt-3 space-y-2">
          {assigned_personnel && assigned_personnel.length > 0 ? (
            assigned_personnel.map((p: any, i: number) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <div>
                  <div className="font-medium">{p.name} <span className="text-xs text-gray-400">({p.role})</span></div>
                  <div className="text-xs text-gray-500">{p.contact}</div>
                </div>
                <div className="text-xs text-gray-400">{new Date(p.assignedAt).toLocaleString()}</div>
              </div>
            ))
          ) : (
            <div className="text-sm text-gray-500">No personnel assigned</div>
          )}
        </div>

        {assignVisible && (
          <div className="mt-3 space-y-2">
            <input
              placeholder="Name"
              value={staff.name}
              onChange={(e) => setStaff({ ...staff, name: e.target.value })}
              className="w-full border rounded px-2 py-2 text-sm"
            />
            <input
              placeholder="Contact (optional)"
              value={staff.contact}
              onChange={(e) => setStaff({ ...staff, contact: e.target.value })}
              className="w-full border rounded px-2 py-2 text-sm"
            />
            <select
              value={staff.role}
              onChange={(e) => setStaff({ ...staff, role: e.target.value })}
              className="w-full border rounded px-2 py-2 text-sm"
            >
              <option>Delivery</option>
              <option>Picker</option>
              <option>Manager</option>
              <option>Cashier</option>
            </select>

            <div className="flex gap-2">
              <button onClick={handleAssign} className="flex-1 bg-blue-600 text-white px-3 py-2 rounded">Assign</button>
              <button onClick={() => setAssignVisible(false)} className="px-3 py-2 bg-gray-100 rounded">Cancel</button>
            </div>
          </div>
        )}
      </section>

      {/* bottom actions (sticky on mobile) */}
      <div className="fixed left-0 right-0 bottom-0 p-3 bg-white border-t md:static md:mt-4">
        <div className="flex gap-2">
          <button onClick={() => handleStatusUpdate("Processing")} className="flex-1 px-3 py-2 rounded bg-yellow-50 text-yellow-700">Mark Processing</button>
          <button onClick={() => handleStatusUpdate("Out for Delivery")} className="flex-1 px-3 py-2 rounded bg-blue-50 text-blue-700">Out for Delivery</button>
          <button onClick={handleCancel} className="px-3 py-2 rounded bg-red-50 text-red-700">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
