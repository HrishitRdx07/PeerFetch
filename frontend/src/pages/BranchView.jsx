import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import StudentCard from '../components/StudentCard';

const BranchView = () => {
    const { branchCode } = useParams();
    const [activeYear, setActiveYear] = useState(1);
    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [selectedExtras, setSelectedExtras] = useState([]);
    const [loading, setLoading] = useState(true);

    const extracurriculars = ['TRS', 'TSA', 'BAHA', 'IEEE', 'IEI'];

    const branchNames = {
        'CP-SFI': 'Computer SFI',
        'CP-GIA': 'Computer GIA',
        'EL': 'Electronics',
        'EC': 'Electronics and Communication',
        'EE': 'Electrical',
        'ME-SFI': 'Mechanical SFI',
        'ME-GIA': 'Mechanical GIA',
        'CE': 'Civil',
        'PE': 'Production',
        'IT': 'IT'
    };

    // Extract actual branch code (CP from CP-SFI, etc.)
    const getActualBranchCode = (code) => {
        if (code.includes('-')) {
            return code.split('-')[0];
        }
        return code;
    };

    useEffect(() => {
        fetchStudents();
    }, [branchCode, activeYear]);

    useEffect(() => {
        applyFilters();
    }, [students, selectedExtras]);

    const fetchStudents = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const actualBranch = getActualBranchCode(branchCode);
            const response = await axios.get(`/api/students?branch=${actualBranch}&year=${activeYear}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Filter by branch variant if needed
            let studentsData = response.data;
            if (branchCode.includes('-')) {
                const variant = branchCode.split('-')[1];
                studentsData = studentsData.filter(s => s.branchName.includes(variant));
            }

            setStudents(studentsData);
        } catch (error) {
            console.error('Fetch students error:', error);
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = () => {
        if (selectedExtras.length === 0) {
            setFilteredStudents(students);
        } else {
            const filtered = students.filter(student =>
                student.extracurriculars.some(extra => selectedExtras.includes(extra))
            );
            setFilteredStudents(filtered);
        }
    };

    const toggleExtra = (extra) => {
        setSelectedExtras(prev =>
            prev.includes(extra)
                ? prev.filter(e => e !== extra)
                : [...prev, extra]
        );
    };

    return (
        <>
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        {branchNames[branchCode] || branchCode}
                    </h1>
                    <p className="text-gray-600">Explore and connect with students</p>
                </div>

                {/* Year Tabs */}
                <div className="flex space-x-2 mb-6 border-b border-gray-200">
                    {[1, 2, 3, 4].map(year => (
                        <button
                            key={year}
                            onClick={() => setActiveYear(year)}
                            className={`px-6 py-3 font-semibold transition-all ${activeYear === year
                                    ? 'border-b-2 border-primary-600 text-primary-600'
                                    : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            {year === 1 ? '1st' : year === 2 ? '2nd' : year === 3 ? '3rd' : '4th'} Year
                        </button>
                    ))}
                </div>

                {/* Filter Section */}
                <div className="card p-4 mb-6">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">Filter by Extracurriculars:</h3>
                    <div className="flex flex-wrap gap-2">
                        {extracurriculars.map(extra => (
                            <button
                                key={extra}
                                onClick={() => toggleExtra(extra)}
                                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${selectedExtras.includes(extra)
                                        ? 'bg-primary-600 text-white shadow-md'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {extra}
                            </button>
                        ))}
                        {selectedExtras.length > 0 && (
                            <button
                                onClick={() => setSelectedExtras([])}
                                className="px-4 py-2 rounded-lg font-medium text-sm bg-red-100 text-red-700 hover:bg-red-200 transition-all"
                            >
                                Clear Filters
                            </button>
                        )}
                    </div>
                </div>

                {/* Students Grid */}
                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                    </div>
                ) : filteredStudents.length > 0 ? (
                    <>
                        <p className="text-gray-600 mb-4">
                            Showing {filteredStudents.length} student{filteredStudents.length !== 1 ? 's' : ''}
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredStudents.map((student) => (
                                <StudentCard key={student.id} student={student} />
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-gray-600">No students found with the selected filters</p>
                    </div>
                )}
            </div>
        </>
    );
};

export default BranchView;
