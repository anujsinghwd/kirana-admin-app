import React, { useState, useRef, useEffect } from 'react';
import { Menu, User, LogOut, Bell, Search, Check, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useOrders } from '../../context/OrderContext';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

interface HeaderProps {
    onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
    const { user, logout } = useAuth();
    const { notifications, unreadCount, markAllAsRead, clearNotifications } = useOrders();
    const navigate = useNavigate();

    const [showNotifications, setShowNotifications] = useState(false);
    const notificationRef = useRef<HTMLDivElement>(null);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Close notification dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
                setShowNotifications(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleNotificationClick = (orderId?: string) => {
        if (orderId) {
            navigate(`/orders/${orderId}`);
            setShowNotifications(false);
        }
    };

    return (
        <header className="h-16 bg-white border-b border-gray-200 sticky top-0 z-30 px-4 lg:px-6 flex items-center justify-between">
            {/* Left: Mobile Menu & Search */}
            <div className="flex items-center gap-4">
                <button
                    onClick={onMenuClick}
                    className="lg:hidden p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors"
                >
                    <Menu size={24} />
                </button>

                {/* Global Search (Visual only for now) */}
                <div className="hidden md:flex items-center relative">
                    <Search size={18} className="absolute left-3 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="pl-10 pr-4 py-2 bg-gray-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-500 w-64 transition-all"
                    />
                </div>
            </div>

            {/* Right: Actions & Profile */}
            <div className="flex items-center gap-3 sm:gap-4">
                {/* Notifications */}
                <div className="relative" ref={notificationRef}>
                    <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className="p-2 hover:bg-gray-100 rounded-full text-gray-500 relative transition-colors"
                    >
                        <Bell size={20} />
                        {unreadCount > 0 && (
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                        )}
                    </button>

                    {/* Notification Dropdown */}
                    {showNotifications && (
                        <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 animate-fade-in-up">
                            <div className="px-4 py-2 border-b border-gray-100 flex items-center justify-between">
                                <h3 className="font-semibold text-gray-900">Notifications</h3>
                                <div className="flex gap-2">
                                    <button
                                        onClick={markAllAsRead}
                                        className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                                        title="Mark all as read"
                                    >
                                        <Check size={14} /> Mark all read
                                    </button>
                                    <button
                                        onClick={clearNotifications}
                                        className="text-xs text-gray-500 hover:text-red-600 font-medium flex items-center gap-1"
                                        title="Clear all"
                                    >
                                        <Trash2 size={14} /> Clear
                                    </button>
                                </div>
                            </div>

                            <div className="max-h-[400px] overflow-y-auto">
                                {notifications.length === 0 ? (
                                    <div className="p-8 text-center text-gray-500">
                                        <Bell size={32} className="mx-auto mb-2 text-gray-300" />
                                        <p className="text-sm">No notifications yet</p>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-gray-50">
                                        {notifications.map((notification) => (
                                            <div
                                                key={notification.id}
                                                onClick={() => handleNotificationClick(notification.orderId)}
                                                className={`px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer ${!notification.read ? 'bg-blue-50/50' : ''}`}
                                            >
                                                <div className="flex gap-3">
                                                    <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${!notification.read ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                                                    <div className="flex-1">
                                                        <p className={`text-sm ${!notification.read ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                                                            {notification.title}
                                                        </p>
                                                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                                                            {notification.message}
                                                        </p>
                                                        <p className="text-[10px] text-gray-400 mt-1.5">
                                                            {dayjs(notification.time).fromNow()}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <div className="h-8 w-px bg-gray-200 hidden sm:block"></div>

                {/* User Profile */}
                <div className="flex items-center gap-3 pl-2">
                    <div className="hidden sm:block text-right">
                        <p className="text-sm font-semibold text-gray-900 leading-none">{user?.name || 'Admin'}</p>
                        <p className="text-xs text-gray-500 mt-1">{user?.email || 'admin@store.com'}</p>
                    </div>

                    <div className="relative group">
                        <button className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-sm border-2 border-white ring-2 ring-gray-100">
                            <User size={20} className="text-white" />
                        </button>

                        {/* Dropdown Menu */}
                        <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all transform origin-top-right z-50">
                            <div className="px-4 py-3 border-b border-gray-100 sm:hidden">
                                <p className="text-sm font-semibold text-gray-900">{user?.name || 'Admin'}</p>
                                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                            >
                                <LogOut size={16} />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;