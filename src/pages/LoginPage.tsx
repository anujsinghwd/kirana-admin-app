import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const LoginPage = () => {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const nav = useNavigate();

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            await login(email, password);
            nav('/dashboard');
        } catch (err: any) {
            alert(err.response?.data?.message || err.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-blue-50">
            <form
                onSubmit={submit}
                className="bg-white p-6 rounded-xl shadow-md w-11/12 max-w-sm"
            >
                <h2 className="text-xl font-semibold mb-4 text-center">Login</h2>
                <input
                    type="email"
                    className="w-full mb-3 border p-2 rounded"
                    placeholder="Email"
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    className="w-full mb-3 border p-2 rounded"
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button className="bg-blue-600 text-white py-2 px-4 rounded w-full hover:bg-blue-700">
                    Login
                </button>
            </form>
        </div>
    )
}

export default LoginPage;
