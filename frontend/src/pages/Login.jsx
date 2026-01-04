import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [studentId, setStudentId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(studentId, password);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="max-w-md w-full">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-block w-16 h-16 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-2xl flex items-center justify-center mb-4">
                        <span className="text-white font-bold text-3xl">P</span>
                    </div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-2">
                        Welcome Back
                    </h1>
                    <p className="text-gray-600">Sign in to connect with peers</p>
                </div>

                {/* Form */}
                <div className="card p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-lg">
                                {error}
                            </div>
                        )}

                        <div>
                            <label htmlFor="studentId" className="block text-sm font-semibold text-gray-700 mb-2">
                                Student ID
                            </label>
                            <input
                                id="studentId"
                                type="text"
                                placeholder="e.g., 25EL011"
                                value={studentId}
                                onChange={(e) => setStudentId(e.target.value.toUpperCase())}
                                className="input-field"
                                required
                            />
                            <p className="mt-1 text-xs text-gray-500">Format: YearBranchRoll (e.g., 25EL011)</p>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input-field"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full"
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-gray-600">
                            Don't have an account?{' '}
                            <Link to="/signup" className="text-primary-600 font-semibold hover:text-primary-700">
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Demo Credentials */}
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                        <strong>Demo:</strong> Use any student ID like <code className="bg-white px-2 py-0.5 rounded">25EL001</code> with password <code className="bg-white px-2 py-0.5 rounded">password123</code>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
