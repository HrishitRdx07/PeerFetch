import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is logged in on mount
        const token = localStorage.getItem('token');
        if (token) {
            fetchUser();
        } else {
            setLoading(false);
        }
    }, []);

    const fetchUser = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('/api/auth/me', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUser(response.data);
        } catch (error) {
            console.error('Failed to fetch user:', error);
            localStorage.removeItem('token');
        } finally {
            setLoading(false);
        }
    };

    const login = async (studentId, password) => {
        const response = await axios.post('/api/auth/login', { studentId, password });
        localStorage.setItem('token', response.data.token);
        setUser(response.data.user);
        return response.data;
    };

    const signup = async (studentId, password, name, branchVariant) => {
        const response = await axios.post('/api/auth/signup', {
            studentId,
            password,
            name,
            branchVariant
        });
        return response.data;
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    const value = {
        user,
        login,
        signup,
        logout,
        loading,
        isAuthenticated: !!user
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
