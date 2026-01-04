import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import BranchView from './pages/BranchView';
import ProfileView from './pages/ProfileView';
import MyProfile from './pages/MyProfile';

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />

                    {/* Protected Routes */}
                    <Route
                        path="/"
                        element={
                            <ProtectedRoute>
                                <Home />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/branch/:branchCode"
                        element={
                            <ProtectedRoute>
                                <BranchView />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/profile/:studentId"
                        element={
                            <ProtectedRoute>
                                <ProfileView />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/my-profile"
                        element={
                            <ProtectedRoute>
                                <MyProfile />
                            </ProtectedRoute>
                        }
                    />

                    {/* Redirect to home by default */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
