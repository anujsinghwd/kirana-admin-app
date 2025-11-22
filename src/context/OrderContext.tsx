import React, { createContext, useContext, useState, ReactNode } from "react";
import { api } from "../api/api";
import toast from "react-hot-toast";
import { cleanOrderFilters } from "../utils/utils";

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
  fetchOrders: (filters: Record<string, string>) => Promise<void>;
  fetchOrderById: (id: string) => Promise<void>;
  updateOrderStatus: (id: string, status: string) => Promise<void>;
  cancelOrder: (id: string) => Promise<void>;
  assignPersonnel: (
    id: string,
    staff: { name: string; contact?: string; role: string }
  ) => Promise<void>;
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
  const [orders, setOrders] = useState<Order[]>([]);
  const [singleOrder, setSingleOrder] = useState<Order | null>(null);

  const [loadingConfig, setLoadingConfig] = useState<LoadingConfig>({
    loading: false,
    text: "",
  });

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
        fetchOrders,
        fetchOrderById,
        updateOrderStatus,
        cancelOrder,
        assignPersonnel,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};
