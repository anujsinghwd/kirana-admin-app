// src/pages/DashboardStatsMobile.tsx
import React, { useEffect, useState } from "react";
import { api } from "../api/api"; // adjust path if needed
import {
    FaBox,
    FaTags,
    FaShoppingCart,
    FaChartLine,
    FaExclamationTriangle,
    FaSyncAlt,
} from "react-icons/fa";
import toast from "react-hot-toast";

type Totals = {
    totalProducts: number;
    totalCategories: number;
    totalOrders: number;
};

type RevenueSummary = {
    totalRevenue: number;
    totalDiscount: number;
    totalSubTotal: number;
    count: number;
};

type OrdersByStatus = { status: string; count: number }[];

type RevenueDay = { _id: string; revenue: number; orders: number }[];

type TopProduct = {
    _id: string;
    name: string;
    image?: string;
    quantitySold: number;
    revenue: number;
}[];

type LowStockProduct = { _id: string; name: string; images?: string[]; totalStock: number }[];

type RecentOrder = {
    _id: string;
    orderId: string;
    totalAmt: number;
    order_status: string;
    createdAt: string;
};

type StatsResponse = {
    totals: Totals;
    revenueSummary: RevenueSummary;
    ordersByStatus: OrdersByStatus;
    revenueByDay: RevenueDay;
    topProducts: TopProduct;
    productsByCategory: { categoryId: string; categoryName?: string; count: number }[];
    lowStockProducts: LowStockProduct;
    recentOrders: RecentOrder[];
};

const StatCard: React.FC<{ title: string; value: string | number; icon?: React.ReactNode; className?: string }> = ({ title, value, icon, className }) => (
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
/** Simple mini bar chart using revenueByDay */
const MiniRevenueSparkline: React.FC<{ data: RevenueDay }> = ({ data }) => {
    if (!data || data.length === 0) {
        return <div className="text-xs text-gray-400">No data</div>;
    }

    // coerce numbers and guard
    const revenues = data.map((d) => Number(d.revenue) || 0);
    const max = Math.max(...revenues, 1);

    // all zero fallback
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
                        {/* bar */}
                        <div
                            role="img"
                            aria-label={`${d._id}: ₹${rev.toFixed(2)}`}
                            title={`${d._id}: ₹${rev.toFixed(2)}`}
                            className="w-full rounded-t"
                            style={{
                                height: `${heightPercent}%`,
                                // using a CSS gradient inline — you can move to classes if preferred
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

export default function Dashboard(): JSX.Element {
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState<StatsResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [periodDays, setPeriodDays] = useState<number>(7);

    const fetchStats = async (period = 7) => {
        setLoading(true);
        setError(null);
        try {
            const res = await api.get("/dashboard/stats", {
                params: { period, limit: 6 }, // example params
            });
            setStats(res.data.data);
        } catch (err: any) {
            console.error("Failed to load dashboard stats", err);
            setError("Could not load stats");
            toast.error("Failed to load dashboard stats");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats(periodDays);
    }, [periodDays]);

    return (
        <section className="min-h-screen bg-gray-50 p-4">
            {/* header */}
            <header className="flex items-center justify-between mb-4">
                <h1 className="text-lg font-semibold text-gray-800">Admin Dashboard</h1>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => fetchStats(periodDays)}
                        className="p-2 rounded-md bg-white shadow-sm text-sm flex items-center gap-2"
                        title="Refresh"
                    >
                        <FaSyncAlt />
                        <span className="hidden sm:inline text-xs">Refresh</span>
                    </button>
                </div>
            </header>

            {/* quick filters (period) */}
            <div className="flex gap-2 mb-4 overflow-x-auto">
                {[7, 30, 90].map((d) => (
                    <button
                        key={d}
                        onClick={() => setPeriodDays(d)}
                        className={`whitespace-nowrap px-3 py-1 rounded-full text-sm ${periodDays === d ? "bg-green-600 text-white" : "bg-white text-gray-700 shadow-sm"}`}
                    >
                        Last {d}d
                    </button>
                ))}
            </div>

            {/* Loading */}
            {loading && (
                <div className="space-y-3">
                    <div className="h-16 bg-white rounded-lg animate-pulse" />
                    <div className="h-12 bg-white rounded-lg animate-pulse" />
                </div>
            )}

            {/* Error */}
            {error && (
                <div className="bg-red-50 p-3 rounded text-sm text-red-700 mb-3 flex items-center gap-2">
                    <FaExclamationTriangle />
                    <span>{error}</span>
                </div>
            )}

            {/* Content */}
            {stats && !loading && (
                <>
                    {/* Totals cards — horizontal scroll on mobile */}
                    <div className="flex gap-3 overflow-x-auto pb-2 mb-4">
                        <div className="min-w-[220px]">
                            <StatCard title="Products" value={stats.totals.totalProducts} icon={<FaBox />} />
                        </div>
                        <div className="min-w-[220px]">
                            <StatCard title="Categories" value={stats.totals.totalCategories} icon={<FaTags />} />
                        </div>
                        <div className="min-w-[220px]">
                            <StatCard title="Orders" value={stats.totals.totalOrders} icon={<FaShoppingCart />} />
                        </div>
                        <div className="min-w-[220px]">
                            <StatCard
                                title="Revenue"
                                value={`₹${stats.revenueSummary.totalRevenue.toFixed(2)}`}
                                icon={<FaChartLine />}
                            />
                        </div>
                    </div>

                    {/* Orders by status */}
                    <div className="bg-white rounded-lg p-3 shadow-sm mb-4">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-semibold">Orders by status</h3>
                            <span className="text-xs text-gray-500">Total {stats.revenueSummary.count}</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {stats.ordersByStatus.length === 0 ? (
                                <div className="text-xs text-gray-400">No orders</div>
                            ) : (
                                stats.ordersByStatus.map((s) => (
                                    <div key={s.status} className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1 text-xs">
                                        <span className="font-medium">{s.status}</span>
                                        <span className="text-gray-600">·</span>
                                        <span className="text-gray-700">{s.count}</span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Revenue sparkline */}
                    <div className="bg-white rounded-lg p-3 shadow-sm mb-4">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-semibold">Revenue (daily)</h3>
                            <div className="text-xs text-gray-500">last {periodDays} days</div>
                        </div>

                        <MiniRevenueSparkline data={stats.revenueByDay} />
                    </div>

                    {/* Top products */}
                    <div className="bg-white rounded-lg p-3 shadow-sm mb-4">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-semibold">Top products</h3>
                            <div className="text-xs text-gray-500">{stats.topProducts.length}</div>
                        </div>

                        <div className="space-y-2">
                            {stats.topProducts.map((p) => (
                                <div key={p._id} className="flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <img src={p.image} alt={p.name} className="w-10 h-10 rounded object-cover flex-shrink-0" />
                                        <div className="min-w-0">
                                            <div className="text-sm font-medium truncate">{p.name}</div>
                                            <div className="text-xs text-gray-500">Sold: {p.quantitySold}</div>
                                        </div>
                                    </div>
                                    <div className="text-sm font-semibold">₹{p.revenue.toFixed(0)}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Low stock */}
                    <div className="bg-white rounded-lg p-3 shadow-sm mb-6">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-semibold">Low stock</h3>
                            <div className="text-xs text-gray-500">{stats.lowStockProducts.length}</div>
                        </div>

                        <div className="space-y-2">
                            {stats.lowStockProducts.length === 0 ? (
                                <div className="text-xs text-gray-400">All good — no low stock</div>
                            ) : (
                                stats.lowStockProducts.map((p) => (
                                    <div key={p._id} className="flex items-center justify-between gap-3">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <img src={p.images?.[0]} alt={p.name} className="w-10 h-10 rounded object-cover flex-shrink-0" />
                                            <div className="min-w-0">
                                                <div className="text-sm truncate">{p.name}</div>
                                                <div className="text-xs text-gray-500">Stock: {p.totalStock}</div>
                                            </div>
                                        </div>
                                        <div className="text-xs text-red-600 font-semibold">Restock</div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Recent orders (compact) */}
                    <div className="mb-12">
                        <h3 className="text-sm font-semibold mb-2">Recent orders</h3>
                        <div className="space-y-2">
                            {stats.recentOrders.map((o) => (
                                <div key={o._id} className="bg-white rounded-lg p-3 shadow-sm flex items-center justify-between">
                                    <div>
                                        <div className="text-sm font-medium">#{o.orderId}</div>
                                        <div className="text-xs text-gray-500">{new Date(o.createdAt).toLocaleString()}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm font-semibold">₹{o.totalAmt.toFixed(2)}</div>
                                        <div className="text-xs text-gray-500">{o.order_status}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </section>
    );
}
