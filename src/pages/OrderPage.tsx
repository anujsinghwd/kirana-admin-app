// src/pages/OrderPage.tsx
import React, { useEffect, useState, useMemo } from "react";
import {
  FaTruck,
  FaClock,
  FaCheckCircle,
  FaTimes,
  FaEye,
  FaSearch,
  FaFilter,
  FaBox,
  FaPhone,
  FaMapMarkerAlt,
  FaSync,
  FaCalendarAlt,
  FaShoppingBag,
} from "react-icons/fa";
import { MdCancel, MdRestaurantMenu } from "react-icons/md";
import { useOrders } from "../context/OrderContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

/* ---------------------------------------------------
 * Status Configuration
 * --------------------------------------------------- */
const statusConfig: Record<string, { icon: any; color: string; bg: string; text: string; border: string }> = {
  Pending: { icon: FaClock, color: "yellow", bg: "bg-yellow-50", text: "text-yellow-700", border: "border-yellow-200" },
  Confirmed: { icon: FaCheckCircle, color: "blue", bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  Preparing: { icon: FaBox, color: "indigo", bg: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-200" },
  Ready: { icon: FaCheckCircle, color: "purple", bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
  "Out for Delivery": { icon: FaTruck, color: "orange", bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200" },
  Delivered: { icon: FaCheckCircle, color: "green", bg: "bg-green-50", text: "text-green-700", border: "border-green-200" },
  Cancelled: { icon: MdCancel, color: "red", bg: "bg-red-50", text: "text-red-700", border: "border-red-200" },
  Rejected: { icon: MdCancel, color: "red", bg: "bg-red-50", text: "text-red-700", border: "border-red-200" },
};

/* ---------------------------------------------------
 * Status Badge Component
 * --------------------------------------------------- */
const StatusBadge = ({ status }: { status: string }) => {
  const config = statusConfig[status] || statusConfig.Pending;
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-medium text-xs border ${config.bg} ${config.text} ${config.border}`}>
      <Icon className="text-[10px]" />
      {status}
    </span>
  );
};

/* ---------------------------------------------------
 * Skeleton Loader
 * --------------------------------------------------- */
const OrderCardSkeleton = () => (
  <div className="bg-white rounded-xl shadow-sm p-6 animate-pulse border border-gray-100">
    <div className="flex items-start justify-between mb-6">
      <div className="flex-1">
        <div className="h-6 bg-gray-200 rounded w-32 mb-3"></div>
        <div className="h-4 bg-gray-200 rounded w-48"></div>
      </div>
      <div className="h-8 bg-gray-200 rounded-full w-24"></div>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
      <div className="h-12 bg-gray-200 rounded-lg"></div>
      <div className="h-12 bg-gray-200 rounded-lg"></div>
    </div>
    <div className="flex gap-3">
      <div className="h-10 bg-gray-200 rounded-lg flex-1"></div>
      <div className="h-10 bg-gray-200 rounded-lg flex-1"></div>
    </div>
  </div>
);

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
 * Main Admin Orders Component
 * --------------------------------------------------- */
const AdminOrdersPage: React.FC = () => {
  const {
    orders,
    loadingConfig,
    fetchOrders,
    updateOrderStatus,
    cancelOrder,
  } = useOrders();

  const navigate = useNavigate();

  // Filters
  const [status, setStatus] = useState<string>("");
  const [orderType, setOrderType] = useState<string>("");
  const [fromDate, setFromDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [toDate, setToDate] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const debouncedSearch = useDebounce(search, 450);
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(20);
  const [showFilters, setShowFilters] = useState(false);

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

  // Count active filters
  const activeFilterCount = [status, orderType, fromDate, toDate].filter(Boolean).length;

  /* ---------------------------------------------------
   * Fetch orders when filters change
   * --------------------------------------------------- */
  useEffect(() => {
    fetchOrders(activeFilters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, orderType, fromDate, toDate, debouncedSearch, page]);

  /* ---------------------------------------------------
   * Action handlers
   * --------------------------------------------------- */
  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      toast.success(`Order updated to ${newStatus}`);
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

  const handleQuickFilter = (filterStatus: string) => {
    setStatus(filterStatus);
    setPage(1);
  };

  return (
    <div className="pb-24">
      {/* Header Section */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Orders</h1>
            <p className="text-sm text-gray-500 mt-1">Manage and track customer orders</p>
          </div>
          <button
            onClick={() => fetchOrders(activeFilters)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg shadow-sm transition-all text-sm font-medium text-gray-700"
            disabled={loadingConfig.loading}
          >
            <FaSync className={loadingConfig.loading ? "animate-spin text-indigo-600" : "text-indigo-600"} />
            <span>Refresh List</span>
          </button>
        </div>

        {/* Stats & Search Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-6">
          {/* Stats Card */}
          <div className="md:col-span-3 bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center">
              <FaShoppingBag className="text-indigo-600 text-xl" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
              <p className="text-sm text-gray-500">Total Orders</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="md:col-span-6 relative">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by order ID, customer, or phone..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-11 pr-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white shadow-sm"
            />
          </div>

          {/* Filter Toggle */}
          <div className="md:col-span-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`w-full h-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all border ${showFilters || activeFilterCount > 0
                ? "bg-indigo-50 border-indigo-200 text-indigo-700"
                : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                }`}
            >
              <FaFilter />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className="bg-indigo-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Advanced Filters Panel */}
        {showFilters && (
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 mb-6 animate-fade-in-down">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Order Type</label>
                <div className="relative">
                  <MdRestaurantMenu className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <select
                    value={orderType}
                    onChange={(e) => {
                      setOrderType(e.target.value);
                      setPage(1);
                    }}
                    className="w-full pl-10 border border-gray-200 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="">All Types</option>
                    <option value="Delivery">Delivery</option>
                    <option value="Takeout">Takeout</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">From Date</label>
                <div className="relative">
                  <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="date"
                    value={fromDate}
                    onChange={(e) => {
                      setFromDate(e.target.value);
                      setPage(1);
                    }}
                    className="w-full pl-10 border border-gray-200 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">To Date</label>
                <div className="relative">
                  <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="date"
                    value={toDate}
                    onChange={(e) => {
                      setToDate(e.target.value);
                      setPage(1);
                    }}
                    className="w-full pl-10 border border-gray-200 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex items-end">
                <button
                  onClick={clearFilters}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg font-medium transition-colors border border-red-100"
                >
                  <FaTimes />
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Quick Status Filters */}
        {!showFilters && (
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide mb-6">
            <button
              onClick={() => handleQuickFilter("")}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${status === ""
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
            >
              All Orders
            </button>
            {Object.keys(statusConfig).map((s) => {
              const config = statusConfig[s];
              const Icon = config.icon;
              return (
                <button
                  key={s}
                  onClick={() => handleQuickFilter(s)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${status === s
                    ? `bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md`
                    : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                >
                  <Icon className={status === s ? "text-white" : "text-gray-400"} />
                  {s}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Main Content */}
      <div>
        {/* Loading State */}
        {loadingConfig.loading && (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <OrderCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loadingConfig.loading && orders.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center border-2 border-dashed border-gray-200">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaShoppingBag className="text-4xl text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              {activeFilterCount > 0 || search
                ? "We couldn't find any orders matching your filters. Try adjusting them."
                : "Orders will appear here once customers start placing them."}
            </p>
            {(activeFilterCount > 0 || search) && (
              <button
                onClick={clearFilters}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors shadow-sm"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}

        {/* Orders List */}
        {!loadingConfig.loading && orders.length > 0 && (
          <div className="space-y-4">
            {orders.map((order) => {
              const config = statusConfig[order.order_status] || statusConfig.Pending;

              return (
                <div
                  key={order._id}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 overflow-hidden group"
                >
                  <div className="p-5">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-5">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-lg font-bold text-gray-900">#{order.orderId}</h3>
                          <StatusBadge status={order.order_status} />
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                          <span className="flex items-center gap-1.5">
                            <FaClock className="text-xs" />
                            {dayjs(order.createdAt).format("DD MMM, YYYY • h:mm A")}
                          </span>
                          <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                          <span className="flex items-center gap-1.5">
                            {order.orderType === 'Delivery' ? <FaTruck className="text-xs" /> : <MdRestaurantMenu className="text-xs" />}
                            {order.orderType}
                          </span>
                        </div>
                      </div>
                      <div className="text-left sm:text-right">
                        <div className="text-2xl font-bold text-gray-900">
                          ₹{order.totalAmt.toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                        </div>
                      </div>
                    </div>

                    {/* Customer & Delivery Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                      <div className="bg-gray-50 rounded-lg p-3 border border-gray-100 flex items-start gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <FaPhone className="text-blue-600 text-xs" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-0.5">Customer</p>
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {order.user?.name || "Guest User"}
                          </p>
                          {order.user?.mobile && (
                            <p className="text-xs text-gray-600 mt-0.5">{order.user.mobile}</p>
                          )}
                        </div>
                      </div>

                      {order.delivery_address && (
                        <div className="bg-gray-50 rounded-lg p-3 border border-gray-100 flex items-start gap-3">
                          <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <FaMapMarkerAlt className="text-orange-600 text-xs" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-0.5">Delivery</p>
                            <p className="text-sm font-semibold text-gray-900 truncate">
                              {order.delivery_address?.city || "N/A"}
                            </p>
                            <p className="text-xs text-gray-600 mt-0.5 truncate">
                              {order.delivery_address?.address_line}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100">
                      <button
                        onClick={() => navigate(`/orders/${order.orderId}`)}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg font-medium transition-colors text-sm shadow-sm"
                      >
                        <FaEye />
                        View Details
                      </button>

                      <div className="flex-1 flex gap-3 overflow-x-auto sm:justify-end">
                        {order.order_status !== "Delivered" && order.order_status !== "Cancelled" && order.order_status !== "Rejected" && (
                          <>
                            {order.order_status === "Pending" && (
                              <button
                                onClick={() => handleStatusChange(order.orderId, "Confirmed")}
                                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors text-sm shadow-sm whitespace-nowrap"
                              >
                                <FaCheckCircle />
                                Confirm Order
                              </button>
                            )}
                            {order.order_status === "Confirmed" && (
                              <button
                                onClick={() => handleStatusChange(order.orderId, "Preparing")}
                                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors text-sm shadow-sm whitespace-nowrap"
                              >
                                <FaBox />
                                Start Preparing
                              </button>
                            )}
                            {order.order_status === "Preparing" && (
                              <button
                                onClick={() => handleStatusChange(order.orderId, "Ready")}
                                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors text-sm shadow-sm whitespace-nowrap"
                              >
                                <FaCheckCircle />
                                Mark Ready
                              </button>
                            )}
                            {(order.order_status === "Ready" || order.order_status === "Confirmed") && order.orderType === "Delivery" && (
                              <button
                                onClick={() => handleStatusChange(order.orderId, "Out for Delivery")}
                                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors text-sm shadow-sm whitespace-nowrap"
                              >
                                <FaTruck />
                                Out for Delivery
                              </button>
                            )}
                            {(order.order_status === "Out for Delivery" || order.order_status === "Ready") && (
                              <button
                                onClick={() => handleStatusChange(order.orderId, "Delivered")}
                                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors text-sm shadow-sm whitespace-nowrap"
                              >
                                <FaCheckCircle />
                                Mark Delivered
                              </button>
                            )}
                            <button
                              onClick={() => handleCancel(order.orderId)}
                              className="flex-none flex items-center justify-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 rounded-lg font-medium transition-colors text-sm whitespace-nowrap"
                            >
                              <MdCancel />
                              Cancel
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {!loadingConfig.loading && orders.length > 0 && (
          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-5 py-2 bg-white border border-gray-200 rounded-lg font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              Previous
            </button>
            <span className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg font-medium text-sm border border-indigo-100">
              Page {page}
            </span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={orders.length < limit}
              className="px-5 py-2 bg-white border border-gray-200 rounded-lg font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrdersPage;
