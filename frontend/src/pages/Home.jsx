import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import StudentCard from '../components/StudentCard';

const Home = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get('search');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (searchQuery) {
            performSearch(searchQuery);
        }
    }, [searchQuery]);

    const performSearch = async (query) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`/api/students/search?q=${encodeURIComponent(query)}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSearchResults(response.data);
        } catch (error) {
            console.error('Search error:', error);
        } finally {
            setLoading(false);
        }
    };

    const branches = [
        { code: 'CP-SFI', name: 'Computer SFI', color: 'from-blue-500 to-blue-600', icon: '💻' },
        { code: 'CP-GIA', name: 'Computer GIA', color: 'from-indigo-500 to-indigo-600', icon: '🖥️' },
        { code: 'EL', name: 'Electronics', color: 'from-purple-500 to-purple-600', icon: '⚡' },
        { code: 'EC', name: 'Electronics & Communication', color: 'from-pink-500 to-pink-600', icon: '📡' },
        { code: 'EE', name: 'Electrical', color: 'from-yellow-500 to-yellow-600', icon: '🔌' },
        { code: 'ME-SFI', name: 'Mechanical SFI', color: 'from-green-500 to-green-600', icon: '⚙️' },
        { code: 'ME-GIA', name: 'Mechanical GIA', color: 'from-teal-500 to-teal-600', icon: '🔧' },
        { code: 'CE', name: 'Civil', color: 'from-orange-500 to-orange-600', icon: '🏗️' },
        { code: 'PE', name: 'Production', color: 'from-red-500 to-red-600', icon: '🏭' },
        { code: 'IT', name: 'IT', color: 'from-cyan-500 to-cyan-600', icon: '🌐' }
    ];

    if (searchQuery) {
        return (
            <>
                <Navbar />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                        Search Results for "{searchQuery}"
                    </h2>

                    {loading ? (
                        <div className="flex justify-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                        </div>
                    ) : searchResults.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {searchResults.map((student) => (
                                <StudentCard key={student.id} student={student} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-gray-600">No students found matching "{searchQuery}"</p>
                        </div>
                    )}
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-4">
                        Engineering Branches
                    </h1>
                    <p className="text-xl text-gray-600">
                        Select a branch to explore students and connect with peers
                    </p>
                </div>

                {/* Branch Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {branches.map((branch) => (
                        <div
                            key={branch.code}
                            onClick={() => navigate(`/branch/${branch.code}`)}
                            className="card p-6 cursor-pointer hover:scale-105 transform transition-all duration-300 hover:shadow-glow"
                        >
                            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${branch.color} flex items-center justify-center mb-4 shadow-lg`}>
                                <span className="text-3xl">{branch.icon}</span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{branch.name}</h3>
                            <p className="text-gray-600 text-sm">Click to view students</p>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default Home;
