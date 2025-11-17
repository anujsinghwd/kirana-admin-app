// src/pages/DashboardStatsMobile.tsx
import React, { useEffect, useState } from "react";
import { FaBox, FaTags, FaShoppingCart, FaChartLine, FaExclamationTriangle, FaSyncAlt } from "react-icons/fa";
import { useDashboard, DashboardProvider } from "../../context/DashboardContext";
import StatCard from "../../components/dashboard/StatCard";
import MiniRevenueSparkline from "../../components/dashboard/MiniRevenueSparkline";
import TopProductsList from "../../components/dashboard/TopProductsList";
import LowStockList from "../../components/dashboard/LowStockList";
import RecentOrdersList from "../../components/dashboard/RecentOrdersList";
import Loading from "../../components/common/Loading";

const DashboardInner: React.FC = () => {
    const { stats, loadingConfig, fetchStats } = useDashboard();
    const [periodDays, setPeriodDays] = useState<number>(7);

    useEffect(() => {
        fetchStats(periodDays);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [periodDays]);

    return (
        <section className="min-h-screen bg-gray-50 p-4">
            <header className="flex items-center justify-between mb-4">
                <h1 className="text-lg font-semibold text-gray-800">Dashboard</h1>
                <div className="flex items-center gap-2">
                    <button onClick={() => fetchStats(periodDays)} className="p-2 rounded-md bg-white shadow-sm text-sm flex items-center gap-2" title="Refresh">
                        <FaSyncAlt />
                        <span className="hidden sm:inline text-xs">Refresh</span>
                    </button>
                </div>
            </header>

            <div className="flex gap-2 mb-4 overflow-x-auto">
                {[7, 30, 90].map((d) => (
                    <button key={d} onClick={() => setPeriodDays(d)} className={`whitespace-nowrap px-3 py-1 rounded-full text-sm ${periodDays === d ? "bg-green-600 text-white" : "bg-white text-gray-700 shadow-sm"}`}>
                        Last {d}d
                    </button>
                ))}
            </div>

            {loadingConfig.loading && (<Loading size={40} color="fill-blue-500" fullscreen={true} text={loadingConfig.text} />)}

            {!stats && !loadingConfig.loading && (
                <div className="bg-red-50 p-3 rounded text-sm text-red-700 mb-3 flex items-center gap-2">
                    <FaExclamationTriangle />
                    <span>Could not load stats</span>
                </div>
            )}

            {stats && (
                <>
                    <div className="flex gap-3 overflow-x-auto pb-2 mb-4">
                        <div className="min-w-[220px]"><StatCard title="Products" value={stats.totals.totalProducts} icon={<FaBox />} /></div>
                        <div className="min-w-[220px]"><StatCard title="Categories" value={stats.totals.totalCategories} icon={<FaTags />} /></div>
                        <div className="min-w-[220px]"><StatCard title="Orders" value={stats.totals.totalOrders} icon={<FaShoppingCart />} /></div>
                        <div className="min-w-[220px]"><StatCard title="Revenue" value={`₹${stats.revenueSummary.totalRevenue.toFixed(2)}`} icon={<FaChartLine />} /></div>
                    </div>

                    <div className="bg-white rounded-lg p-3 shadow-sm mb-4">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-semibold">Orders by status</h3>
                            <span className="text-xs text-gray-500">Total {stats.revenueSummary.count}</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {stats.ordersByStatus.map((s) => (
                                <div key={s.status} className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1 text-xs">
                                    <span className="font-medium">{s.status}</span>
                                    <span className="text-gray-600">·</span>
                                    <span className="text-gray-700">{s.count}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-lg p-3 shadow-sm mb-4">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-semibold">Revenue (daily)</h3>
                            <div className="text-xs text-gray-500">last {periodDays} days</div>
                        </div>
                        <MiniRevenueSparkline data={stats.revenueByDay} />
                    </div>

                    <div className="bg-white rounded-lg p-3 shadow-sm mb-4">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-semibold">Top products</h3>
                            <div className="text-xs text-gray-500">{stats.topProducts.length}</div>
                        </div>
                        <TopProductsList products={stats.topProducts as any} />
                    </div>

                    <div className="bg-white rounded-lg p-3 shadow-sm mb-4">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-semibold">Low stock</h3>
                            <div className="text-xs text-gray-500">{stats.lowStockProducts.length}</div>
                        </div>
                        <LowStockList items={stats.lowStockProducts} />
                    </div>

                    <div className="mb-12">
                        <h3 className="text-sm font-semibold mb-2">Recent orders</h3>
                        <RecentOrdersList orders={stats.recentOrders as any} />
                    </div>
                </>
            )}
        </section>
    );
};

// top-level default export wrapped with provider (so page consumer only imports the page)
export default function DashboardStatsMobilePage() {
    return (
        <DashboardProvider>
            <DashboardInner />
        </DashboardProvider>
    );
}
