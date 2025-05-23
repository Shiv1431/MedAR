import React, { useEffect } from 'react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import './StudentLayout.css';

const StudentLayout = () => {
  const { ID } = useParams();
  const navigate = useNavigate();
  const { user, userType, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (!user || !userType) {
        console.log('No user or userType found, redirecting to login');
        navigate('/login');
      } else if (userType !== 'student') {
        console.log('User is not a student, redirecting to login');
        navigate('/login');
      } else if (user._id !== ID) {
        console.log('User ID mismatch, redirecting to correct dashboard');
        navigate(`/Student/Dashboard/${user._id}`);
      }
    }
  }, [user, userType, loading, ID, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user || userType !== 'student') {
    return null;
  }

  return (
    <div className="student-dashboard">
      <div className="dashboard-container">
        <Outlet />
      </div>
    </div>
  );
};

export default StudentLayout;