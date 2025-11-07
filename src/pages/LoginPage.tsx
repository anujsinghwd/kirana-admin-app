import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const LoginPage = () => {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const nav = useNavigate()

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      await login(email, password)
      nav('/dashboard')
    } catch (err: any) {
      alert(err.response?.data?.message || err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-blue-50 to-white">
      {/* Login Card */}
      <div className="bg-white shadow-lg rounded-2xl w-[90%] max-w-md p-6 sm:p-8 relative">
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-25 h-25 bg-white-600 rounded-full flex items-center justify-center mb-3 shadow-md">
            <img
              src="https://res.cloudinary.com/decexqep6/image/upload/v1762529905/shivikirana-lgo-transparent_haadaj.png"
              alt="Kirana Logo"
              className="w-25 h-25 object-contain filter drop-shadow-md"
            />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Welcome Back</h1>
          <p className="text-sm text-gray-500">Login to your Kirana Admin panel</p>
        </div>

        {/* Login Form */}
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-between items-center text-sm text-gray-600">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="accent-blue-600" />
              Remember me
            </label>
            {/* <a href="#" className="text-blue-600 hover:underline">
              Forgot password?
            </a> */}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2.5 mt-3 text-white rounded-lg font-medium transition 
              ${loading
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 shadow-sm hover:shadow-md'
              }`}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-xs text-gray-500 mt-6">
          © {new Date().getFullYear()} Kirana Admin. All rights reserved.
        </p>
      </div>
    </div>
  )
}

export default LoginPage
