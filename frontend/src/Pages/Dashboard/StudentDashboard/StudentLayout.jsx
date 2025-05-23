import React, { useEffect } from 'react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import './StudentLayout.css';

const StudentLayout = () => {
  const { ID } = useParams();
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    } else if (user && user._id !== ID) {
      navigate(`/Student/Dashboard/${user._id}`);
    }
  }, [user, loading, ID, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
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