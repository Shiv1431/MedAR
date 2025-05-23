import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import axios from 'axios';
import './StudentLayout.css';
import { toast } from 'react-hot-toast';

const StudentLayout = () => {
  const { ID } = useParams();
  const navigate = useNavigate();
  const { user, userType, loading } = useAuth();
  const [studentData, setStudentData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        if (!user || !userType) {
          console.log('No user or userType found, redirecting to login');
          navigate('/login');
          return;
        }

        if (userType !== 'student') {
          console.log('User is not a student, redirecting to login');
          navigate('/login');
          return;
        }

        if (user._id !== ID) {
          console.log('User ID mismatch, redirecting to correct dashboard');
          navigate(`/Student/Dashboard/${user._id}/Welcome`);
          return;
        }

        // Fetch student data
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/student/${ID}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json'
            },
            withCredentials: true
          }
        );

        if (response.data.success) {
          setStudentData(response.data.data.student);
        } else {
          console.error('Failed to fetch student data:', response.data.message);
          toast.error('Failed to load student data');
        }
      } catch (error) {
        console.error('Error fetching student data:', error);
        if (error.response?.status === 401) {
          navigate('/login');
        } else {
          toast.error('Failed to load student data');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudentData();
  }, [user, userType, ID, navigate]);

  if (loading || isLoading) {
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
        <Outlet context={{ studentData }} />
      </div>
    </div>
  );
};

export default StudentLayout;