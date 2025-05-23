import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  // Check if user is a student or teacher
  const isAuthorized = user.role === 'student' || user.role === 'teacher';
  
  if (!isAuthorized) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute; 