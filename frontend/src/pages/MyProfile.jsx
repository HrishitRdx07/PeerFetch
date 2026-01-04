import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

const MyProfile = () => {
    const { user } = useAuth();
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        bio: '',
        skills: [],
        extracurriculars: []
    });
    const [newSkill, setNewSkill] = useState('');
    const [success, setSuccess] = useState(false);

    const extracurricularOptions = ['TRS', 'TSA', 'BAHA', 'IEEE', 'IEI'];

    useEffect(() => {
        if (user?.profile) {
            setFormData({
                bio: user.profile.bio || '',
                skills: user.profile.skills || [],
                extracurriculars: user.profile.extracurriculars || []
            });
        }
    }, [user]);

    const handleSave = async () => {
        setSaving(true);
        try {
            const token = localStorage.getItem('token');
            await axios.put('/api/profile', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSuccess(true);
            setEditing(false);
            setTimeout(() => setSuccess(false), 3000);
            window.location.reload();
        } catch (error) {
            console.error('Update profile error:', error);
            alert('Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    const addSkill = () => {
        if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
            setFormData(prev => ({
                ...prev,
                skills: [...prev.skills, newSkill.trim()]
            }));
            setNewSkill('');
        }
    };

    const removeSkill = (skill) => {
        setFormData(prev => ({
            ...prev,
            skills: prev.skills.filter(s => s !== skill)
        }));
    };

    const toggleExtracurricular = (extra) => {
        setFormData(prev => ({
            ...prev,
            extracurriculars: prev.extracurriculars.includes(extra)
                ? prev.extracurriculars.filter(e => e !== extra)
                : [...prev.extracurriculars, extra]
        }));
    };

    if (!user?.profile) {
        return (
            <>
                <Navbar />
                <div className="flex justify-center items-center min-h-screen">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Success Message */}
                {success && (
                    <div className="mb-6 bg-green-50 border-2 border-green-200 text-green-700 px-4 py-3 rounded-lg">
                        Profile updated successfully!
                    </div>
                )}

                {/* Profile Header */}
                <div className="card p-8 mb-6">
                    <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-6">
                            <img
                                src={user.profile.profilePicture}
                                alt={user.profile.name}
                                className="w-32 h-32 rounded-2xl ring-4 ring-primary-100 shadow-lg"
                            />
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">{user.profile.name}</h1>
                                <p className="text-lg text-gray-600 mb-1">{user.studentId}</p>
                                <p className="text-gray-600">{user.profile.branchName} • Year {user.profile.year}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => editing ? setEditing(false) : setEditing(true)}
                            className={editing ? 'btn-secondary' : 'btn-primary'}
                        >
                            {editing ? 'Cancel' : 'Edit Profile'}
                        </button>
                    </div>
                </div>

                {/* Bio Section */}
                <div className="card p-6 mb-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-3">About Me</h2>
                    {editing ? (
                        <textarea
                            value={formData.bio}
                            onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                            placeholder="Tell others about yourself..."
                            className="input-field min-h-[120px]"
                            rows={5}
                        />
                    ) : (
                        <p className="text-gray-700 leading-relaxed">
                            {user.profile.bio || 'No bio added yet'}
                        </p>
                    )}
                </div>

                {/* Skills Section */}
                <div className="card p-6 mb-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Skills</h2>
                    {editing && (
                        <div className="flex gap-2 mb-4">
                            <input
                                type="text"
                                value={newSkill}
                                onChange={(e) => setNewSkill(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                                placeholder="Add a skill..."
                                className="input-field"
                            />
                            <button onClick={addSkill} className="btn-primary whitespace-nowrap">
                                Add
                            </button>
                        </div>
                    )}
                    <div className="flex flex-wrap gap-2">
                        {formData.skills.length > 0 ? (
                            formData.skills.map((skill, index) => (
                                <span
                                    key={index}
                                    className="px-4 py-2 bg-primary-50 text-primary-700 rounded-lg font-medium text-sm flex items-center gap-2"
                                >
                                    {skill}
                                    {editing && (
                                        <button
                                            onClick={() => removeSkill(skill)}
                                            className="text-red-600 hover:text-red-700"
                                        >
                                            ×
                                        </button>
                                    )}
                                </span>
                            ))
                        ) : (
                            <p className="text-gray-500">No skills added yet</p>
                        )}
                    </div>
                </div>

                {/* Extracurriculars Section */}
                <div className="card p-6 mb-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Extracurricular Activities</h2>
                    {editing ? (
                        <div className="flex flex-wrap gap-3">
                            {extracurricularOptions.map(extra => (
                                <button
                                    key={extra}
                                    onClick={() => toggleExtracurricular(extra)}
                                    className={`px-4 py-2 rounded-lg font-medium transition-all ${formData.extracurriculars.includes(extra)
                                            ? 'bg-primary-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    {extra}
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-wrap gap-3">
                            {formData.extracurriculars.length > 0 ? (
                                formData.extracurriculars.map((extra, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-secondary-50 to-primary-50 rounded-lg"
                                    >
                                        <span className="text-2xl">🏆</span>
                                        <span className="font-semibold text-gray-900">{extra}</span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500">No extracurriculars added yet</p>
                            )}
                        </div>
                    )}
                </div>

                {/* Save Button */}
                {editing && (
                    <div className="flex justify-end">
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="btn-primary px-8"
                        >
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                )}
            </div>
        </>
    );
};

export default MyProfile;
