import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow px-4 py-3 flex justify-between items-center sticky top-0 z-40">
      {/* App Title */}
      <h1 className="text-lg sm:text-xl font-bold text-blue-600">Shivi Kirana Store</h1>

      {/* Desktop Menu */}
      <div className="hidden md:flex space-x-6 items-center">
        <Link to="/dashboard" className="hover:text-blue-600 font-medium">Dashboard</Link>
        <Link to="/products" className="hover:text-blue-600 font-medium">Products</Link>
        <Link to="/categories" className="hover:text-blue-600 font-medium">Categories</Link>
        <span className="text-gray-500 text-sm">Hi, {user?.name || 'Admin'}</span>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1 rounded transition-all"
        >
          Logout
        </button>
      </div>

      {/* Mobile Hamburger */}
      <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Menu Drawer */}
      {isOpen && (
        <div className="absolute top-13 left-0 w-full bg-white border-t shadow-md flex flex-col md:hidden z-50 p-4 space-y-3">
          <Link
            to="/dashboard"
            className="p-2 border-b border-gray-100 hover:bg-gray-50 rounded"
            onClick={() => setIsOpen(false)}
          >
            Dashboard
          </Link>
          <Link
            to="/products"
            className="p-2 border-b border-gray-100 hover:bg-gray-50 rounded"
            onClick={() => setIsOpen(false)}
          >
            Products
          </Link>
          <Link
            to="/categories"
            className="p-2 border-b border-gray-100 hover:bg-gray-50 rounded"
            onClick={() => setIsOpen(false)}
          >
            Categories
          </Link>

          <div className="flex justify-between items-center pt-3 border-t border-gray-100">
            <span className="text-gray-600 text-sm">Hi, {user?.name || 'Admin'}</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-3 py-1 text-sm rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
