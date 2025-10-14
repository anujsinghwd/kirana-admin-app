import React from 'react'
import { useAuth } from '../../context/AuthContext'

const Header = () => {
    const { user, logout } = useAuth()
    return (
        <header className="w-full bg-white shadow px-4 py-3 flex justify-between items-center">
            <div className="text-xl font-bold">Kirana Admin</div>
            <div className="hidden md:flex items-center space-x-4">
                <span className="text-sm text-gray-600">{user?.name}</span>
                <button onClick={logout} className="px-3 py-1 bg-red-500 text-white rounded">Logout</button>
            </div>
        </header>
    )
}

export default Header