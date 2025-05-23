import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useParams, Navigate, useNavigate, Link } from 'react-router-dom';
import { FaHome, FaBookMedical, FaUsers, FaChartLine, FaUser, FaSignOutAlt, FaChalkboardTeacher, FaCalendarAlt } from 'react-icons/fa';
import axios from 'axios';
import { motion } from 'framer-motion';

const TeacherLayout = () => {
  const { ID } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/teacher/${ID}`,
          {
            withCredentials: true,
          }
        );
        setUserData(response.data.data.teacher);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching teacher data:', error);
        setLoading(false);
      }
    };

    if (token) {
      fetchUserData();
    }
  }, [ID, token]);

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      // Try to call the logout API
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/teacher/logout`,
        {},
        {
          withCredentials: true,
        }
      );
    } catch (error) {
      console.log('Logout API call failed, proceeding with client-side cleanup:', error);
    } finally {
      // Always clear local storage and redirect
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Use window.location.href to ensure a full page reload and clear all state
      window.location.href = '/login';
    }
  };

  const navItems = [
    {
      path: `/Teacher/Dashboard/${ID}/Dashboard`,
      icon: <FaHome className="w-5 h-5" />,
      text: 'Dashboard'
    },
    {
      path: `/Teacher/Dashboard/${ID}/Courses`,
      icon: <FaBookMedical className="w-5 h-5" />,
      text: 'My Courses'
    },
    {
      path: `/Teacher/Dashboard/${ID}/Students`,
      icon: <FaUsers className="w-5 h-5" />,
      text: 'Students'
    },
    {
      path: `/Teacher/Dashboard/${ID}/Schedule`,
      icon: <FaCalendarAlt className="w-5 h-5" />,
      text: 'Schedule'
    },
    {
      path: `/Teacher/Dashboard/${ID}/Analytics`,
      icon: <FaChartLine className="w-5 h-5" />,
      text: 'Analytics'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }


  if (!token) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg flex flex-col">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-blue-600">MedLearn VR</h2>
          <p className="text-sm text-gray-600 mt-1">Medical Teacher Portal</p>
        </div>
        
        {/* Profile Section */}
        <div className="px-4 py-3 border-t border-gray-200 space-y-3">
          {/* Profile Button */}
          <Link
            to={`/Teacher/Dashboard/${ID}/profile`}
            className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
              <FaUser className="text-blue-600" />
            </div>
            <div className="text-left flex-1">
              <p className="text-sm font-medium text-gray-900">
                Dr. {userData?.Firstname} {userData?.Lastname}
              </p>
              <p className="text-xs text-gray-500">View Profile</p>
            </div>
          </Link>
          
          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
          >
            <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
              <FaSignOutAlt className="text-red-600" />
            </div>
            <span className="text-sm font-medium">Sign Out</span>
          </button>
        </div>

        <nav className="mt-2 flex-1 overflow-y-auto">
          {navItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-6 py-4 transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`
              }
            >
              {item.icon}
              <span className="ml-3">{item.text}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default TeacherLayout;