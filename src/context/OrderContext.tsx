import React, { createContext, useContext, useState, ReactNode, useEffect, useRef } from "react";
import { api } from "../api/api";
import toast from "react-hot-toast";
import { cleanOrderFilters } from "../utils/utils";
import dayjs from "dayjs";
import { useAuth } from "./AuthContext";

/* ---------------------------------------------
 * Order Types
 * --------------------------------------------- */
interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  subTotal: number;
  image: string;
}

interface TrackingLog {
  status: string;
  timestamp: string;
  note?: string;
}

interface AssignedPersonnel {
  role: string;
  name: string;
  contact?: string;
}

interface DeliveryAddress {
  address_line: string;
  city: string;
  state: string;
  pincode: number;
}

export interface Order {
  _id: string;
  orderId: string;
  user: { name: string; mobile: string };
  order_status: string;
  orderType: string;
  totalAmt: number;
  createdAt: string;
  items: OrderItem[];
  tracking?: TrackingLog[];
  assigned_personnel?: AssignedPersonnel[];
  delivery_address?: DeliveryAddress;
  subTotalAmt: number;
  totalDiscount: number;
}

/* ---------------------------------------------
 * Notification Type
 * --------------------------------------------- */
export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'order' | 'system';
  orderId?: string;
}

/* ---------------------------------------------
 * Loading Config Type
 * --------------------------------------------- */
export interface LoadingConfig {
  loading: boolean;
  text: string;
}

/* ---------------------------------------------
 * Context Types
 * --------------------------------------------- */
interface OrderContextType {
  orders: Order[];
  singleOrder: Order | null;
  loadingConfig: LoadingConfig;
  notifications: Notification[];
  unreadCount: number;
  fetchOrders: (filters: Record<string, string>) => Promise<void>;
  fetchOrderById: (id: string) => Promise<void>;
  updateOrderStatus: (id: string, status: string) => Promise<void>;
  cancelOrder: (id: string) => Promise<void>;
  assignPersonnel: (
    id: string,
    staff: { name: string; contact?: string; role: string }
  ) => Promise<void>;
  markAllAsRead: () => void;
  clearNotifications: () => void;
}

/* ---------------------------------------------
 * Create Context
 * --------------------------------------------- */
const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const useOrders = () => {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error("useOrders must be used inside OrderProvider");
  return ctx;
};

/* ---------------------------------------------
 * Provider Component
 * --------------------------------------------- */
export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const { user, token } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [singleOrder, setSingleOrder] = useState<Order | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const [loadingConfig, setLoadingConfig] = useState<LoadingConfig>({
    loading: false,
    text: "",
  });

  // Ref to track the last known order ID to avoid duplicate notifications
  const lastKnownOrderIdRef = useRef<string | null>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  /* ---------------------------------------------
   * Polling for New Orders
   * --------------------------------------------- */
  useEffect(() => {
    // Only poll if user is logged in
    if (!user || !token) return;

    const checkNewOrders = async () => {
      try {
        // Fetch only the latest few orders to check for new ones
        const res = await api.get("/orders", {
          params: { limit: 5, page: 1 } // Assuming default sort is by createdAt desc
        });
        const latestOrders: Order[] = res.data.data || [];

        if (latestOrders.length === 0) return;

        const latestOrder = latestOrders[0];

        // Initialize on first run
        if (lastKnownOrderIdRef.current === null) {
          lastKnownOrderIdRef.current = latestOrder._id;
          return;
        }

        // If the latest order is different from what we last saw
        if (latestOrder._id !== lastKnownOrderIdRef.current) {
          // Find all new orders (those that came after our last known one)
          const newOrders = [];
          for (const order of latestOrders) {
            if (order._id === lastKnownOrderIdRef.current) break;
            newOrders.push(order);
          }

          // Update the ref to the newest one
          lastKnownOrderIdRef.current = latestOrder._id;

          // Notify for each new pending order
          newOrders.forEach((order) => {
            if (order.order_status === "Pending") {
              // Toast Notification
              toast.success(`New Order Received! #${order.orderId}`, {
                duration: 5000,
                icon: '🔔',
                style: {
                  border: '1px solid #4F46E5',
                  padding: '16px',
                  color: '#4F46E5',
                },
              });

              // Add to Notification List
              const newNotification: Notification = {
                id: Date.now().toString() + Math.random().toString(), // Simple unique ID
                title: "New Order Received",
                message: `Order #${order.orderId} received from ${order.user?.name || 'Guest'}`,
                time: new Date().toISOString(),
                read: false,
                type: 'order',
                orderId: order.orderId
              };

              setNotifications(prev => [newNotification, ...prev]);
            }
          });
        }
      } catch (err) {
        console.error("Background order check failed", err);
      }
    };

    // Initial check to set the baseline
    checkNewOrders();

    // Poll every 30 seconds
    const intervalId = setInterval(checkNewOrders, 30000);

    return () => clearInterval(intervalId);
  }, [user, token]);

  /* ---------------------------------------------
   * Fetch All Orders
   * --------------------------------------------- */
  const fetchOrders = async (filters: Record<string, string> = {}) => {
    setLoadingConfig({ loading: true, text: "Fetching Orders..." });

    try {
      const res = await api.get("/orders", {
        params: cleanOrderFilters(filters)
      });
      setOrders(res.data.data || []);
    } catch (err: any) {
      toast.error("Failed to fetch orders");
      console.error(err);
    }

    setLoadingConfig({ loading: false, text: "" });
  };

  /* ---------------------------------------------
   * Fetch Single Order
   * --------------------------------------------- */
  const fetchOrderById = async (id: string) => {
    setLoadingConfig({ loading: true, text: "Fetching Order Details..." });

    try {
      const res = await api.get(`/orders/${id}`);
      setSingleOrder(res.data.data);
    } catch (err) {
      toast.error("Failed to load order");
      console.error(err);
    }

    setLoadingConfig({ loading: false, text: "" });
  };

  /* ---------------------------------------------
   * Update Order Status
   * --------------------------------------------- */
  const updateOrderStatus = async (id: string, status: string) => {
    setLoadingConfig({ loading: true, text: `Updating Status...` });

    try {
      await api.put(`/orders/${id}/status`, { status });
      toast.success(`Order updated to ${status}`);
      await fetchOrders();
    } catch (err) {
      toast.error("Failed to update status");
      console.error(err);
    }

    setLoadingConfig({ loading: false, text: "" });
  };

  /* ---------------------------------------------
   * Cancel Order
   * --------------------------------------------- */
  const cancelOrder = async (id: string) => {
    setLoadingConfig({ loading: true, text: "Cancelling Order..." });

    try {
      await api.put(`/orders/${id}/cancel`);
      toast.success("Order Cancelled");
      await fetchOrders();
    } catch (err) {
      toast.error("Failed to cancel");
      console.error(err);
    }

    setLoadingConfig({ loading: false, text: "" });
  };

  /* ---------------------------------------------
   * Assign Personnel (Delivery boy / Picker etc.)
   * --------------------------------------------- */
  const assignPersonnel = async (
    id: string,
    staff: { name: string; contact?: string; role: string }
  ) => {
    setLoadingConfig({ loading: true, text: "Assigning Staff..." });

    try {
      await api.put(`/orders/${id}/assign`, staff);
      toast.success("Personnel assigned");
      await fetchOrders();
    } catch (err) {
      toast.error("Failed to assign staff");
      console.error(err);
    }

    setLoadingConfig({ loading: false, text: "" });
  };

  /* ---------------------------------------------
   * Return Context Value
   * --------------------------------------------- */
  return (
    <OrderContext.Provider
      value={{
        orders,
        singleOrder,
        loadingConfig,
        notifications,
        unreadCount,
        fetchOrders,
        fetchOrderById,
        updateOrderStatus,
        cancelOrder,
        assignPersonnel,
        markAllAsRead,
        clearNotifications,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};
