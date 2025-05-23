import React, { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FaStethoscope, FaUserMd, FaBookMedical, FaCube, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for token in localStorage
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, [user]);

  const handleLogout = async () => {
    try {
      await logout();
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setIsAuthenticated(false);
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <FaStethoscope className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">MedAR</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium ${
                  isActive ? 'text-blue-600 border-b-2 border-blue-600' : ''
                }`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/courses"
              className={({ isActive }) =>
                `text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium ${
                  isActive ? 'text-blue-600 border-b-2 border-blue-600' : ''
                }`
              }
            >
              Medical Courses
            </NavLink>
            {isAuthenticated && (user?.role === 'student' || user?.role === 'teacher') && (
              <NavLink
                to="/anatomy"
                className={({ isActive }) =>
                  `text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium flex items-center ${
                    isActive ? 'text-blue-600 border-b-2 border-blue-600' : ''
                  }`
                }
              >
                <FaCube className="mr-1" />
                3D Anatomy
              </NavLink>
            )}
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium ${
                  isActive ? 'text-blue-600 border-b-2 border-blue-600' : ''
                }`
              }
            >
              About
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium ${
                  isActive ? 'text-blue-600 border-b-2 border-blue-600' : ''
                }`
              }
            >
              Contact
            </NavLink>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <button
                  onClick={() => navigate(`/${user?.role === 'student' ? 'Student' : 'Teacher'}/Dashboard/${user?._id}/Profile`)}
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium flex items-center"
                >
                  <FaUser className="mr-1" />
                  Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium flex items-center"
                >
                  <FaSignOutAlt className="mr-1" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 