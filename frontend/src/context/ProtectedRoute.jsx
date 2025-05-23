import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ children, allowedRoles = ['student', 'teacher'] }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    // Redirect to login page but save the attempted URL
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user's role is allowed
  const isAuthorized = allowedRoles.includes(user.role);
  
  if (!isAuthorized) {
    // Redirect to home page if user's role is not authorized
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute; 