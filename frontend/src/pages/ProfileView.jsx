import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';

const ProfileView = () => {
    const { studentId } = useParams();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showMentorshipModal, setShowMentorshipModal] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, [studentId]);

    const fetchProfile = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`/api/students/${studentId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProfile(response.data);
        } catch (error) {
            console.error('Fetch profile error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRequestMentorship = () => {
        setShowMentorshipModal(true);
        setTimeout(() => setShowMentorshipModal(false), 3000);
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="flex justify-center items-center min-h-screen">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                </div>
            </>
        );
    }

    if (!profile) {
        return (
            <>
                <Navbar />
                <div className="max-w-4xl mx-auto px-4 py-12 text-center">
                    <p className="text-gray-600">Profile not found</p>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Profile Header */}
                <div className="card p-8 mb-6">
                    <div className="flex items-start space-x-6">
                        <img
                            src={profile.profilePicture}
                            alt={profile.name}
                            className="w-32 h-32 rounded-2xl ring-4 ring-primary-100 shadow-lg"
                        />
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">{profile.name}</h1>
                            <p className="text-lg text-gray-600 mb-1">{profile.studentId}</p>
                            <p className="text-gray-600 mb-3">{profile.branchName} • Year {profile.year}</p>

                            <div className="flex gap-3">
                                <button
                                    onClick={handleRequestMentorship}
                                    className="btn-primary"
                                >
                                    Request Mentorship
                                </button>
                                <button className="btn-secondary">
                                    Send Message
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bio Section */}
                {profile.bio && (
                    <div className="card p-6 mb-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-3">About</h2>
                        <p className="text-gray-700 leading-relaxed">{profile.bio}</p>
                    </div>
                )}

                {/* Skills Section */}
                {profile.skills && profile.skills.length > 0 && (
                    <div className="card p-6 mb-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Skills</h2>
                        <div className="flex flex-wrap gap-2">
                            {profile.skills.map((skill, index) => (
                                <span
                                    key={index}
                                    className="px-4 py-2 bg-primary-50 text-primary-700 rounded-lg font-medium text-sm"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Extracurriculars Section */}
                {profile.extracurriculars && profile.extracurriculars.length > 0 && (
                    <div className="card p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Extracurricular Activities</h2>
                        <div className="flex flex-wrap gap-3">
                            {profile.extracurriculars.map((extra, index) => (
                                <div
                                    key={index}
                                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-secondary-50 to-primary-50 rounded-lg"
                                >
                                    <span className="text-2xl">🏆</span>
                                    <span className="font-semibold text-gray-900">{extra}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Mentorship Request Modal */}
            {showMentorshipModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-8 max-w-md mx-4 shadow-2xl animate-fade-in">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Request Sent!</h3>
                            <p className="text-gray-600">
                                Your mentorship request has been sent to {profile.name}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ProfileView;
