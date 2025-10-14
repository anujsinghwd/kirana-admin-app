import React from 'react'

const Dashboard = () => {
    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded shadow">Total Products: --</div>
                <div className="bg-white p-4 rounded shadow">Total Categories: --</div>
                <div className="bg-white p-4 rounded shadow">Pending Orders: --</div>
            </div>
        </div>
    )
}

export default Dashboard