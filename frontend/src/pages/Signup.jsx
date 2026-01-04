import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
    const [formData, setFormData] = useState({
        studentId: '',
        name: '',
        password: '',
        confirmPassword: '',
        branchVariant: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const { signup } = useAuth();
    const navigate = useNavigate();

    const STUDENT_ID_REGEX = /^(24|25|26|27)(EL|CP|EC|EE|ME|CE|PE|IT)\d{3}$/;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'studentId' ? value.toUpperCase() : value
        }));
    };

    const getBranchCode = (studentId) => {
        if (studentId.length >= 4) {
            return studentId.substring(2, 4);
        }
        return '';
    };

    const needsBranchVariant = () => {
        const branchCode = getBranchCode(formData.studentId);
        return branchCode === 'CP' || branchCode === 'ME';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validation
        if (!STUDENT_ID_REGEX.test(formData.studentId)) {
            setError('Invalid student ID format. Expected format: 25EL011');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (needsBranchVariant() && !formData.branchVariant) {
            setError('Please select SFI or GIA variant for your branch');
            return;
        }

        setLoading(true);

        try {
            await signup(formData.studentId, formData.password, formData.name, formData.branchVariant);
            setSuccess(true);
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4">
                <div className="max-w-md w-full text-center">
                    <div className="card p-8">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Registration Successful!</h2>
                        <p className="text-gray-600 mb-4">You can now login with your credentials</p>
                        <p className="text-sm text-gray-500">Redirecting to login page...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12">
            <div className="max-w-md w-full">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-block w-16 h-16 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-2xl flex items-center justify-center mb-4">
                        <span className="text-white font-bold text-3xl">P</span>
                    </div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-2">
                        Join PeerFetch
                    </h1>
                    <p className="text-gray-600">Create your account to start networking</p>
                </div>

                {/* Form */}
                <div className="card p-8">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        <div>
                            <label htmlFor="studentId" className="block text-sm font-semibold text-gray-700 mb-2">
                                Student ID *
                            </label>
                            <input
                                id="studentId"
                                name="studentId"
                                type="text"
                                placeholder="e.g., 25EL011"
                                value={formData.studentId}
                                onChange={handleChange}
                                className="input-field"
                                required
                            />
                            <p className="mt-1 text-xs text-gray-500">
                                Format: YY + Branch Code + Roll Number (e.g., 25EL011)
                            </p>
                        </div>

                        <div>
                            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                                Full Name *
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                placeholder="Enter your full name"
                                value={formData.name}
                                onChange={handleChange}
                                className="input-field"
                                required
                            />
                        </div>

                        {needsBranchVariant() && (
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Branch Variant *
                                </label>
                                <div className="flex gap-4">
                                    <label className="flex items-center cursor-pointer">
                                        <input
                                            type="radio"
                                            name="branchVariant"
                                            value="SFI"
                                            checked={formData.branchVariant === 'SFI'}
                                            onChange={handleChange}
                                            className="mr-2"
                                        />
                                        <span className="text-gray-700">SFI</span>
                                    </label>
                                    <label className="flex items-center cursor-pointer">
                                        <input
                                            type="radio"
                                            name="branchVariant"
                                            value="GIA"
                                            checked={formData.branchVariant === 'GIA'}
                                            onChange={handleChange}
                                            className="mr-2"
                                        />
                                        <span className="text-gray-700">GIA</span>
                                    </label>
                                </div>
                            </div>
                        )}

                        <div>
                            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                                Password *
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="Minimum 6 characters"
                                value={formData.password}
                                onChange={handleChange}
                                className="input-field"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                                Confirm Password *
                            </label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                placeholder="Re-enter your password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="input-field"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full"
                        >
                            {loading ? 'Creating Account...' : 'Sign Up'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-gray-600">
                            Already have an account?{' '}
                            <Link to="/login" className="text-primary-600 font-semibold hover:text-primary-700">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
