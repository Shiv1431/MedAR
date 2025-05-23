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
    const initializeLayout = async () => {
      try {
        // Check if we have the necessary data in localStorage
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');
        const storedUserType = localStorage.getItem('userType');
        const storedUserId = localStorage.getItem('userId');

        if (!storedUser || !storedToken || !storedUserType || !storedUserId) {
          console.log('Missing authentication data, redirecting to login');
          navigate('/login');
          return;
        }

        if (storedUserType !== 'student') {
          console.log('User is not a student, redirecting to login');
          navigate('/login');
          return;
        }

        if (storedUserId !== ID) {
          console.log('User ID mismatch, redirecting to correct dashboard');
          navigate(`/Student/Dashboard/${storedUserId}/Welcome`);
          return;
        }

        // Set up axios default header
        axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;

        // Remove any trailing /api from base URL
        const baseUrl = import.meta.env.VITE_API_BASE_URL.replace(/\/api$/, '');
        const studentUrl = `${baseUrl}/api/student/${ID}`;

        console.log('Fetching student data from:', studentUrl);

        // Fetch student data
        const response = await axios.get(
          studentUrl,
          {
            headers: {
              'Content-Type': 'application/json'
            },
            withCredentials: true
          }
        );

        if (response.data.success) {
          const student = response.data.data.student;
          setStudentData(student);
          
          // Update stored user data
          localStorage.setItem('user', JSON.stringify(student));
        } else {
          throw new Error(response.data.message || 'Failed to fetch student data');
        }
      } catch (error) {
        console.error('Error initializing layout:', error);
        if (error.response?.status === 401) {
          // Clear invalid data
          localStorage.removeItem('token');
          localStorage.removeItem('userType');
          localStorage.removeItem('userId');
          localStorage.removeItem('user');
          navigate('/login');
        } else {
          toast.error('Failed to load student data');
        }
      } finally {
        setIsLoading(false);
      }
    };

    initializeLayout();
  }, [ID, navigate]);

  if (loading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!studentData) {
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