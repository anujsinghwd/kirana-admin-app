// src/pages/AdminOrdersPage.tsx
import React, { useEffect, useState, useMemo } from "react";
import {
  FaChevronDown,
  FaChevronUp,
  FaUserAlt,
  FaTruck,
  FaClock,
  FaCheckCircle,
  FaUserPlus,
  FaSearch,
  FaTimes,
  FaEye,
} from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { useOrders } from "../context/OrderContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

/* ---------------------------------------------------
 * Status Badge — UI helper
 * --------------------------------------------------- */
const StatusBadge = ({ status }: { status: string }) => {
  const colorMap: Record<string, string> = {
    Delivered: "bg-green-100 text-green-700",
    Completed: "bg-green-100 text-green-700",
    Cancelled: "bg-red-100 text-red-700",
    Processing: "bg-yellow-100 text-yellow-700",
    Packed: "bg-blue-100 text-blue-700",
    "Out for Delivery": "bg-orange-100 text-orange-700",
    Pending: "bg-gray-100 text-gray-700",
    "Takeout Ready": "bg-purple-100 text-purple-700",
  };

  return (
    <span
      className={`text-xs font-semibold px-2 py-1 rounded-full ${
        colorMap[status] || "bg-gray-200 text-gray-600"
      }`}
    >
      {status}
    </span>
  );
};

/* ---------------------------------------------------
 * Utility: debounce hook
 * --------------------------------------------------- */
function useDebounce<T>(value: T, delay = 400) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

/* ---------------------------------------------------
 * Main Admin Orders Component (with filters)
 * --------------------------------------------------- */
const AdminOrdersPage: React.FC = () => {
  const {
    orders,
    loadingConfig,
    fetchOrders,
    updateOrderStatus,
    cancelOrder,
    assignPersonnel,
  } = useOrders();

  const navigate = useNavigate();

  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [assignFormVisible, setAssignFormVisible] = useState<string | null>(null);
  const [staff, setStaff] = useState({ name: "", contact: "", role: "Delivery" });

  // Filters
  const [status, setStatus] = useState<string>(""); // '' means all
  const [orderType, setOrderType] = useState<string>(""); // Delivery / Takeout
  const [fromDate, setFromDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [toDate, setToDate] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const debouncedSearch = useDebounce(search, 450);
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(20);

  // derived
  const activeFilters = useMemo(() => {
    const f: Record<string, string> = {};
    if (status) f.status = status;
    if (orderType) f.orderType = orderType;
    if (fromDate) f.from = fromDate;
    if (toDate) f.to = toDate;
    if (debouncedSearch) f.q = debouncedSearch;
    f.page = String(page);
    f.limit = String(limit);
    return f;
  }, [status, orderType, fromDate, toDate, debouncedSearch, page, limit]);

  /* ---------------------------------------------------
   * Fetch orders when filters change
   * --------------------------------------------------- */
  useEffect(() => {
    fetchOrders(activeFilters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, orderType, fromDate, toDate, debouncedSearch, page]);

  /* ---------------------------------------------------
   * Assign Staff Handler
   * --------------------------------------------------- */
  const handleAssignStaff = async (orderId: string) => {
    if (!staff.name.trim()) {
      toast.error("Staff name required");
      return;
    }
    try {
      await assignPersonnel(orderId, staff);
      toast.success("Personnel assigned");
      setStaff({ name: "", contact: "", role: "Delivery" });
      setAssignFormVisible(null);
      fetchOrders(activeFilters);
    } catch (err) {
      toast.error("Failed to assign");
    }
  };

  /* ---------------------------------------------------
   * Action shortcuts
   * --------------------------------------------------- */
  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      toast.success(`Marked ${newStatus}`);
      fetchOrders(activeFilters);
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleCancel = async (orderId: string) => {
    try {
      await cancelOrder(orderId);
      toast.success("Order cancelled");
      fetchOrders(activeFilters);
    } catch {
      toast.error("Failed to cancel");
    }
  };

  const clearFilters = () => {
    setStatus("");
    setOrderType("");
    setFromDate("");
    setToDate("");
    setSearch("");
    setPage(1);
  };

  return (
    <section className="min-h-screen bg-gray-50 p-4 pb-10">
      {/* header */}
      <header className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">📦 Manage Orders</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchOrders(activeFilters)}
            className="text-sm bg-green-600 text-white px-3 py-1 rounded-lg"
          >
            Refresh
          </button>
          <button
            onClick={clearFilters}
            className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-lg flex items-center gap-2"
          >
            <FaTimes /> Clear
          </button>
        </div>
      </header>

      {/* Filters (mobile-first) */}
      <div className="bg-white rounded-md p-3 mb-4 shadow-sm">
        {/* Grid: 1 column mobile -> 3 columns md+ */}
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {/* Status */}
          <div>
            <label className="block text-xs text-gray-500 mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
              className="w-full border rounded px-2 py-2 text-sm"
            >
              <option value="">All</option>
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Packed">Packed</option>
              <option value="Out for Delivery">Out for Delivery</option>
              <option value="Takeout Ready">Takeout Ready</option>
              <option value="Delivered">Delivered</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Date range + type — stacked on mobile, inline on md */}
        <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1">From</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => {
                setFromDate(e.target.value);
                setPage(1);
              }}
              className="w-full border rounded px-2 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">To</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => {
                setToDate(e.target.value);
                setPage(1);
              }}
              className="w-full border rounded px-2 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">Type</label>
            <select
              value={orderType}
              onChange={(e) => {
                setOrderType(e.target.value);
                setPage(1);
              }}
              className="w-full border rounded px-2 py-2 text-sm"
            >
              <option value="">All</option>
              <option value="Delivery">Delivery</option>
              <option value="Takeout">Takeout</option>
            </select>
          </div>
        </div>
      </div>

      {/* Loading */}
      {loadingConfig.loading && (
        <p className="text-center text-gray-500 mb-4">{loadingConfig.text}</p>
      )}

      {/* No Orders */}
      {!loadingConfig.loading && orders.length === 0 && (
        <p className="text-center text-gray-400 mt-10">No orders found.</p>
      )}

      {/* Orders List */}
      <div className="space-y-3">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white rounded-lg shadow-sm border border-gray-200"
          >
            {/* ---------- Summary ---------- */}
            <div
              className="flex items-center justify-between p-3 cursor-pointer"
              onClick={() =>
                setExpandedOrder(expandedOrder === order._id ? null : order._id)
              }
            >
              <div>
                <p className="font-semibold text-gray-800">#{order.orderId}</p>
                <p className="text-xs text-gray-500">
                  {new Date(order.createdAt).toLocaleString()}
                </p>
                <p className="text-sm text-green-700 font-medium mt-1">
                  ₹{order.totalAmt.toFixed(2)}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {/* ← NEW: View / Eye button (doesn't toggle accordion) */}
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // prevent accordion toggle
                    navigate(`/orders/${order.orderId}`);
                  }}
                  aria-label={`View order ${order.orderId}`}
                  title="View details"
                  className="p-1 rounded hover:bg-gray-100"
                >
                  <FaEye className="text-gray-600" />
                </button>
                
                <StatusBadge status={order.order_status} />

                {expandedOrder === order._id ? (
                  <FaChevronUp size={14} className="text-gray-500" />
                ) : (
                  <FaChevronDown size={14} className="text-gray-500" />
                )}
              </div>
            </div>

            {/* ---------- Details ---------- */}
            {expandedOrder === order._id && (
              <div className="border-t border-gray-200 p-3 space-y-4">
                {/* items */}
                <div className="border rounded-md divide-y">
                  {order.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center p-2 text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-10 h-10 rounded object-cover"
                        />
                        <div>
                          <p className="font-medium text-gray-800">{item.name}</p>
                          <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <p className="font-semibold text-gray-700">
                        ₹{item.subTotal.toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* staff assignment */}
                <div className="bg-gray-50 p-2 rounded-md">
                  {assignFormVisible === order._id && (
                    <div className="mt-3 space-y-2">
                      <input
                        type="text"
                        placeholder="Name"
                        value={staff.name}
                        onChange={(e) => setStaff({ ...staff, name: e.target.value })}
                        className="w-full border rounded px-2 py-1 text-sm"
                      />
                      <input
                        type="text"
                        placeholder="Contact (optional)"
                        value={staff.contact}
                        onChange={(e) => setStaff({ ...staff, contact: e.target.value })}
                        className="w-full border rounded px-2 py-1 text-sm"
                      />
                      <select
                        value={staff.role}
                        onChange={(e) => setStaff({ ...staff, role: e.target.value })}
                        className="w-full border rounded px-2 py-1 text-sm"
                      >
                        <option value="Delivery">Delivery</option>
                        <option value="Picker">Picker</option>
                        <option value="Manager">Manager</option>
                        <option value="Cashier">Cashier</option>
                      </select>

                      <button
                        onClick={() => handleAssignStaff(order._id)}
                        className="bg-blue-600 text-white text-sm px-3 py-1 rounded-md w-full"
                      >
                        Assign
                      </button>
                    </div>
                  )}
                </div>

                {/* action buttons */}
                <div className="flex flex-wrap gap-2 pt-2">
                  <button
                    onClick={() => handleStatusChange(order.orderId, "Processing")}
                    className="flex items-center gap-1 bg-yellow-100 text-yellow-700 text-xs px-3 py-1.5 rounded-full"
                  >
                    <FaClock /> Processing
                  </button>

                  <button
                    onClick={() => handleStatusChange(order.orderId, "Takeout Ready")}
                    className="flex items-center gap-1 bg-purple-100 text-purple-900 text-xs px-3 py-1.5 rounded-full"
                  >
                    <FaClock /> Takeout Ready
                  </button>

                  <button
                    onClick={() => handleStatusChange(order.orderId, "Out for Delivery")}
                    className="flex items-center gap-1 bg-blue-100 text-blue-700 text-xs px-3 py-1.5 rounded-full"
                  >
                    <FaTruck /> Out for Delivery
                  </button>

                  <button
                    onClick={() => handleStatusChange(order.orderId, "Delivered")}
                    className="flex items-center gap-1 bg-green-100 text-green-700 text-xs px-3 py-1.5 rounded-full"
                  >
                    <FaCheckCircle /> Delivered
                  </button>

                  <button
                    onClick={() => handleCancel(order.orderId)}
                    className="flex items-center gap-1 bg-red-100 text-red-700 text-xs px-3 py-1.5 rounded-full"
                  >
                    <MdCancel /> Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* pagination / load more (simple) */}
      <div className="mt-6 flex items-center justify-center gap-3">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          className="px-3 py-1 rounded bg-gray-100"
        >
          Prev
        </button>
        <span className="text-sm text-gray-600">Page {page}</span>
        <button
          onClick={() => setPage((p) => p + 1)}
          className="px-3 py-1 rounded bg-gray-100"
        >
          Next
        </button>
      </div>
    </section>
  );
};

export default AdminOrdersPage;
