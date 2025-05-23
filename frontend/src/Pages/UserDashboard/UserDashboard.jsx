import React, { useState, useEffect } from 'react';
import { useParams, Navigate, NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaCalendarAlt, FaCheckCircle, FaClock } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const UserDashboard = () => {
  const { userid } = useParams();
  const { user, loading: authLoading } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  console.log(user);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get(`/user/${userid}`);
        if (response.data && response.data.data) {
          setUserData(response.data.data.user);
        } else {
          throw new Error('Invalid response format from server');
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError(err.response?.data?.message || 'Failed to load user data');
        setLoading(false);
      }
    };

    if (!authLoading && user) {
      fetchUserData();
    }
  }, [userid, authLoading, user]);

  // Show loading state while auth is initializing
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Show loading state while fetching user data
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  // Navigation items for the dashboard
  const navItems = [
    {
      name: 'My Profile',
      path: `/${user?.role === 'student' ? 'Student' : 'Teacher'}/Dashboard/${user?._id}`,
      icon: <FaUser className="mr-2" />,
      description: 'View and update your profile information'
    },
    {
      name: '3D Anatomy',
      path: '/anatomy',
      icon: <FaCube className="mr-2" />,
      description: 'Explore 3D anatomy models',
      roles: ['student', 'teacher']
    },
    {
      name: 'My Courses',
      path: '/courses',
      icon: <FaBookMedical className="mr-2" />,
      description: 'View your enrolled courses'
    },
    {
      name: 'Messages',
      path: '/messages',
      icon: <FaEnvelope className="mr-2" />,
      description: 'Check your messages'
    }
  ].filter(item => !item.roles || item.roles.includes(user?.role));

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-lg overflow-hidden"
        >
          {/* Profile Header */}
          <div className="bg-blue-600 px-6 py-8">
            <div className="flex flex-col md:flex-row md:items-center">
              <div className="h-24 w-24 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                <FaUser className="h-16 w-16 text-blue-600" />
              </div>
              <div className="mt-4 md:mt-0 md:ml-6">
                <h1 className="text-3xl font-bold text-white">
                  {user?.Firstname} {user?.Lastname}
                </h1>
                <div className="flex items-center mt-2">
                  <span className="text-blue-100">{user?.Email}</span>
                  <span className="mx-2 text-blue-200">•</span>
                  <span className="capitalize text-blue-100">{user?.role}</span>
                </div>
                <div className="mt-2">
                  {user?.Isverified ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      <FaCheckCircle className="mr-1" /> Verified Account
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                      <FaClock className="mr-1" /> Not Verified
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="px-6 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-800">Personal Information</h2>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <FaEnvelope className="h-5 w-5 text-gray-500 mr-3" />
                    <span className="text-gray-700">{userData?.Email || 'N/A'}</span>
                  </div>
                  <div className="flex items-center">
                    <FaCalendarAlt className="h-5 w-5 text-gray-500 mr-3" />
                    <span className="text-gray-700">
                      Joined: {new Date(userData?.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Account Status */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-800">Account Status</h2>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className={`h-3 w-3 rounded-full mr-2 ${
                      userData?.Isapproved === 'approved' ? 'bg-green-500' :
                      userData?.Isapproved === 'pending' ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}></div>
                    <span className="text-gray-700 capitalize">
                      Status: {userData?.Isapproved || 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <FaCalendarAlt className="h-5 w-5 text-gray-500 mr-3" />
                    <span className="text-gray-700">
                      Last Updated: {new Date(userData?.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Account Details</h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600">User ID:</p>
                    <p className="text-gray-800 font-mono">{userData?._id}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Account Type:</p>
                    <p className="text-gray-800 capitalize">
                      {userData?.Studentdetails ? 'Student' : 'Teacher'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Dashboard Navigation */}
          <div className="px-6 py-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {navItems.map((item, index) => (
                <NavLink
                  key={index}
                  to={item.path}
                  className="block p-6 bg-white border border-gray-200 rounded-lg shadow hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                      {item.icon}
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                      <p className="mt-1 text-sm text-gray-500">{item.description}</p>
                    </div>
                  </div>
                </NavLink>
              ))}
            </div>
          </div>
          
          {/* Recent Activity Section */}
          <div className="px-6 py-8 border-t border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Recent Activity</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-600 text-center">No recent activity to show</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default UserDashboard; 