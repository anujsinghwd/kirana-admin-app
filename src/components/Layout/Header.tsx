import React from 'react';
import { Menu, User, LogOut, Bell, Search } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
    onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
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
                <button className="p-2 hover:bg-gray-100 rounded-full text-gray-500 relative transition-colors">
                    <Bell size={20} />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                </button>

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