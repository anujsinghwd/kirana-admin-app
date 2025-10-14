import React, { useState } from 'react'
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
    const [open, setOpen] = useState(false)
    return (
        <nav className="bg-blue-600 text-white px-4 py-3 flex justify-between items-center z-10">
            <h1 className="text-lg font-bold">My Dashboard</h1>
            <button className="md:hidden" onClick={() => setOpen(!open)}>
                {open ? <X /> : <Menu />}
            </button>
            <div className="hidden md:flex gap-4">
                <Link to="/dashboard" className="hover:underline">Dashboard</Link>
                <Link to="/products" className="hover:underline">Products</Link>
                <Link to="/categories" className="hover:underline">Categories</Link>
            </div>

            {open && (
                <div className="absolute top-16 left-0 bg-blue-700 w-full flex flex-col md:hidden">
                    <Link to="/dashboard" className="p-3 border-b border-blue-500" onClick={() => setOpen(false)}>Dashboard</Link>
                    <Link to="/products" className="p-3 border-b border-blue-500" onClick={() => setOpen(false)}>Products</Link>
                    <Link to="/categories" className="p-3 border-b border-blue-500" onClick={() => setOpen(false)}>Categories</Link>
                </div>
            )}
        </nav>
    )
}

export default Sidebar;
