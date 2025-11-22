// src/pages/DashboardStatsMobile.tsx
import React, { useEffect, useState } from "react";
import { FaBox, FaTags, FaShoppingCart, FaChartLine, FaExclamationTriangle, FaSyncAlt, FaCalendarAlt, FaArrowUp, FaArrowDown } from "react-icons/fa";
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

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good Morning";
        if (hour < 18) return "Good Afternoon";
        return "Good Evening";
    };

    return (
        <section className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-4 md:p-6">
            {/* Header */}
            <div className="mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{getGreeting()} 👋</h1>
                        <p className="text-sm text-gray-500 mt-1">Here's what's happening with your store today</p>
                    </div>
                    <button
                        onClick={() => fetchStats(periodDays)}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg shadow-sm transition-all text-sm font-medium text-gray-700"
                        title="Refresh"
                    >
                        <FaSyncAlt className="text-indigo-600" />
                        <span>Refresh Data</span>
                    </button>
                </div>

                {/* Period Selector */}
                <div className="flex items-center gap-3 overflow-x-auto pb-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600 flex-shrink-0">
                        <FaCalendarAlt className="text-indigo-600" />
                        <span className="font-medium">Period:</span>
                    </div>
                    <div className="flex gap-2">
                        {[
                            { days: 7, label: "Last 7 days" },
                            { days: 30, label: "Last 30 days" },
                            { days: 90, label: "Last 90 days" }
                        ].map((period) => (
                            <button
                                key={period.days}
                                onClick={() => setPeriodDays(period.days)}
                                className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-medium transition-all ${periodDays === period.days
                                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                                        : "bg-white text-gray-700 border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50"
                                    }`}
                            >
                                {period.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {loadingConfig.loading && (<Loading size={40} color="fill-blue-500" fullscreen={true} text={loadingConfig.text} />)}

            {!stats && !loadingConfig.loading && (
                <div className="bg-red-50 border border-red-200 p-4 rounded-xl text-sm text-red-700 flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FaExclamationTriangle className="text-red-600" />
                    </div>
                    <div>
                        <p className="font-semibold">Unable to load dashboard data</p>
                        <p className="text-xs text-red-600 mt-1">Please try refreshing the page</p>
                    </div>
                </div>
            )}

            {stats && (
                <>
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center">
                                    <FaBox className="text-indigo-600 text-xl" />
                                </div>
                                <div className="flex items-center gap-1 text-xs font-medium text-green-600">
                                    <FaArrowUp className="text-[10px]" />
                                    <span>12%</span>
                                </div>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Total Products</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.totals.totalProducts}</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center">
                                    <FaTags className="text-purple-600 text-xl" />
                                </div>
                                <div className="flex items-center gap-1 text-xs font-medium text-green-600">
                                    <FaArrowUp className="text-[10px]" />
                                    <span>8%</span>
                                </div>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Categories</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.totals.totalCategories}</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg flex items-center justify-center">
                                    <FaShoppingCart className="text-green-600 text-xl" />
                                </div>
                                <div className="flex items-center gap-1 text-xs font-medium text-green-600">
                                    <FaArrowUp className="text-[10px]" />
                                    <span>24%</span>
                                </div>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Total Orders</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.totals.totalOrders}</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-amber-100 rounded-lg flex items-center justify-center">
                                    <FaChartLine className="text-orange-600 text-xl" />
                                </div>
                                <div className="flex items-center gap-1 text-xs font-medium text-green-600">
                                    <FaArrowUp className="text-[10px]" />
                                    <span>18%</span>
                                </div>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Total Revenue</p>
                                <p className="text-2xl font-bold text-gray-900">₹{stats.revenueSummary.totalRevenue.toFixed(2)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Orders by Status */}
                    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center">
                                    <FaShoppingCart className="text-indigo-600 text-sm" />
                                </div>
                                <h3 className="text-base font-bold text-gray-900">Orders by Status</h3>
                            </div>
                            <span className="text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                                Total: {stats.revenueSummary.count}
                            </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {stats.ordersByStatus.map((s) => (
                                <div
                                    key={s.status}
                                    className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-lg px-4 py-2 text-sm hover:shadow-sm transition-shadow"
                                >
                                    <span className="font-semibold text-gray-900">{s.status}</span>
                                    <span className="text-gray-400">·</span>
                                    <span className="font-bold text-indigo-600">{s.count}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Revenue Chart */}
                    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg flex items-center justify-center">
                                    <FaChartLine className="text-green-600 text-sm" />
                                </div>
                                <h3 className="text-base font-bold text-gray-900">Revenue Trend</h3>
                            </div>
                            <div className="text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                                Last {periodDays} days
                            </div>
                        </div>
                        <MiniRevenueSparkline data={stats.revenueByDay} />
                    </div>

                    {/* Two Column Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        {/* Top Products */}
                        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center">
                                        <FaBox className="text-purple-600 text-sm" />
                                    </div>
                                    <h3 className="text-base font-bold text-gray-900">Top Products</h3>
                                </div>
                                <span className="text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                                    {stats.topProducts.length} items
                                </span>
                            </div>
                            <TopProductsList products={stats.topProducts as any} />
                        </div>

                        {/* Low Stock */}
                        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-gradient-to-br from-red-100 to-orange-100 rounded-lg flex items-center justify-center">
                                        <FaExclamationTriangle className="text-red-600 text-sm" />
                                    </div>
                                    <h3 className="text-base font-bold text-gray-900">Low Stock Alert</h3>
                                </div>
                                <span className="text-xs font-medium text-red-600 bg-red-50 px-3 py-1 rounded-full">
                                    {stats.lowStockProducts.length} items
                                </span>
                            </div>
                            <LowStockList items={stats.lowStockProducts} />
                        </div>
                    </div>

                    {/* Recent Orders */}
                    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 mb-12">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center">
                                <FaShoppingCart className="text-indigo-600 text-sm" />
                            </div>
                            <h3 className="text-base font-bold text-gray-900">Recent Orders</h3>
                        </div>
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
