import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [showUserMenu, setShowUserMenu] = useState(false);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    return (
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-xl">P</span>
                        </div>
                        <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                            PeerFetch
                        </span>
                    </Link>

                    {/* Search Bar */}
                    <form onSubmit={handleSearch} className="flex-1 max-w-xl mx-8">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search students by name..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full px-4 py-2 pl-10 rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                            />
                            <svg
                                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                        </div>
                    </form>

                    {/* User Menu */}
                    <div className="relative">
                        <button
                            onClick={() => setShowUserMenu(!showUserMenu)}
                            className="flex items-center space-x-3 hover:bg-gray-50 rounded-lg px-3 py-2 transition-colors"
                        >
                            <img
                                src={user?.profile?.profilePicture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.studentId}`}
                                alt="Profile"
                                className="w-8 h-8 rounded-full"
                            />
                            <span className="font-medium text-gray-700">{user?.profile?.name}</span>
                            <svg
                                className={`w-5 h-5 text-gray-500 transition-transform ${showUserMenu ? 'rotate-180' : ''}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {showUserMenu && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
                                <Link
                                    to="/my-profile"
                                    className="block px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                                    onClick={() => setShowUserMenu(false)}
                                >
                                    My Profile
                                </Link>
                                <button
                                    onClick={() => {
                                        logout();
                                        setShowUserMenu(false);
                                        navigate('/login');
                                    }}
                                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-50 transition-colors"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
