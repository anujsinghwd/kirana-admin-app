import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FaEnvelope, FaLock, FaShieldAlt, FaCheckCircle } from 'react-icons/fa'

const LoginPage = () => {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-white p-4">
      {/* Login Container */}
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-0 bg-white rounded-2xl shadow-2xl overflow-hidden">

        {/* Left Side - Branding */}
        <div className="hidden md:flex flex-col justify-between bg-gradient-to-br from-blue-600 to-indigo-700 p-12 text-white relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/3 translate-y-1/3"></div>
          </div>

          {/* Content */}
          <div className="relative z-10">
            {/* Logo */}
            <div className="mb-8">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4">
                <img
                  src="https://res.cloudinary.com/decexqep6/image/upload/v1762529905/shivikirana-lgo-transparent_haadaj.png"
                  alt="Kirana Logo"
                  className="w-16 h-16 object-contain"
                />
              </div>
              <h1 className="text-3xl font-bold mb-2">Kirana Admin</h1>
              <p className="text-blue-100 text-lg">Manage your store with ease</p>
            </div>

            {/* Features */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <FaShieldAlt className="text-xl" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Secure Access</h3>
                  <p className="text-blue-100 text-sm">Your data is protected with enterprise-grade security</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <FaCheckCircle className="text-xl" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Easy Management</h3>
                  <p className="text-blue-100 text-sm">Streamlined interface for efficient store operations</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="relative z-10 text-blue-100 text-sm">
            © {new Date().getFullYear()} Kirana Admin. All rights reserved.
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="p-8 sm:p-12 flex flex-col justify-center">
          {/* Mobile Logo */}
          <div className="md:hidden flex flex-col items-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mb-4">
              <img
                src="https://res.cloudinary.com/decexqep6/image/upload/v1762529905/shivikirana-lgo-transparent_haadaj.png"
                alt="Kirana Logo"
                className="w-16 h-16 object-contain"
              />
            </div>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
            <p className="text-gray-500">Sign in to access your admin panel</p>
          </div>

          {/* Login Form */}
          <form onSubmit={submit} className="space-y-5">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <FaEnvelope />
                </div>
                <input
                  type="email"
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <FaLock />
                </div>
                <input
                  type="password"
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                />
                <span className="text-sm text-gray-600 group-hover:text-gray-900 transition">
                  Remember me
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 text-white rounded-lg font-semibold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 ${loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
                }`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Signing in...</span>
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Mobile Footer */}
          <p className="md:hidden text-center text-xs text-gray-500 mt-8">
            © {new Date().getFullYear()} Kirana Admin. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
