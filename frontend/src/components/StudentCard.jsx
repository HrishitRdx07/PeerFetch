import React from 'react';
import { useNavigate } from 'react-router-dom';

const StudentCard = ({ student }) => {
    const navigate = useNavigate();

    const getYearLabel = (year) => {
        if (year >= 3) return 'Senior';
        return 'Junior';
    };

    const extracurricularColors = {
        'TRS': 'bg-blue-100 text-blue-700',
        'TSA': 'bg-green-100 text-green-700',
        'BAHA': 'bg-purple-100 text-purple-700',
        'IEEE': 'bg-orange-100 text-orange-700',
        'IEI': 'bg-pink-100 text-pink-700'
    };

    return (
        <div
            onClick={() => navigate(`/profile/${student.studentId}`)}
            className="card p-5 cursor-pointer hover:scale-105 transform transition-all duration-300"
        >
            <div className="flex items-start space-x-4">
                {/* Profile Picture */}
                <div className="relative">
                    <img
                        src={student.profilePicture}
                        alt={student.name}
                        className="w-16 h-16 rounded-full ring-4 ring-primary-100"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-white rounded-full px-2 py-0.5 shadow-md">
                        <span className="text-xs font-semibold text-primary-600">{student.year}Y</span>
                    </div>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg text-gray-900 truncate">{student.name}</h3>
                    <p className="text-sm text-gray-500">{student.studentId}</p>

                    <div className="mt-1">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${student.year >= 3 ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                            }`}>
                            {getYearLabel(student.year)}
                        </span>
                    </div>

                    {/* Extracurriculars */}
                    {student.extracurriculars && student.extracurriculars.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-3">
                            {student.extracurriculars.map((extra, index) => (
                                <span
                                    key={index}
                                    className={`badge text-xs ${extracurricularColors[extra] || 'bg-gray-100 text-gray-700'}`}
                                >
                                    {extra}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentCard;
