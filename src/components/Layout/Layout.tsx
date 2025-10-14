import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import Sidebar from './Sidebar'

const Layout = ()=>{
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-4">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout;
