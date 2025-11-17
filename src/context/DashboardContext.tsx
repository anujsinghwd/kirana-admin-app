// src/context/DashboardContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";
import { api } from "../api/api";
import toast from "react-hot-toast";

export type RevenueDay = { _id: string; revenue: number; orders: number }[];
export type OrdersByStatus = { status: string; count: number }[];

export type Totals = {
  totalProducts: number;
  totalCategories: number;
  totalOrders: number;
};

export type RevenueSummary = {
  totalRevenue: number;
  totalDiscount: number;
  totalSubTotal: number;
  count: number;
};

export type TopProduct = {
  _id: string;
  name: string;
  image?: string;
  quantitySold: number;
  revenue: number;
}[];

export type LowStockProduct = { _id: string; name: string; images?: string[]; totalStock: number }[];

export type RecentOrder = {
  _id: string;
  orderId: string;
  totalAmt: number;
  order_status: string;
  createdAt: string;
}[];

export type StatsResponse = {
  totals: Totals;
  revenueSummary: RevenueSummary;
  ordersByStatus: OrdersByStatus;
  revenueByDay: RevenueDay;
  topProducts: TopProduct;
  productsByCategory: { categoryId: string; categoryName?: string; count: number }[];
  lowStockProducts: LowStockProduct;
  recentOrders: RecentOrder;
};

type LoadingConfig = { loading: boolean; text?: string };

type DashboardContextType = {
  stats: StatsResponse | null;
  loadingConfig: LoadingConfig;
  fetchStats: (periodDays?: number, opts?: Record<string, any>) => Promise<void>;
};

const DashboardContext = createContext<DashboardContextType | undefined>(
  undefined
);

export const useDashboard = (): DashboardContextType => {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error("useDashboard must be used within DashboardProvider");
  return ctx;
};

export const DashboardProvider = ({ children }: { children: ReactNode }) => {
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [loadingConfig, setLoadingConfig] = useState<LoadingConfig>({
    loading: false,
    text: "",
  });

  const fetchStats = async (period = 7, opts: Record<string, any> = {}) => {
    setLoadingConfig({ loading: true, text: "Loading dashboard..." });
    try {
      const res = await api.get("/dashboard/stats", { params: { period, ...opts } });
      setStats(res.data.data ?? null);
    } catch (err: any) {
      console.error("Dashboard fetch error", err);
      toast.error("Failed to load dashboard stats");
      setStats(null);
    } finally {
      setLoadingConfig({ loading: false, text: "" });
    }
  };

  return (
    <DashboardContext.Provider value={{ stats, loadingConfig, fetchStats }}>
      {children}
    </DashboardContext.Provider>
  );
};
