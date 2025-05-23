import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { FaUserMd, FaBookMedical, FaCalendarAlt, FaChartLine, FaGraduationCap, FaBell, FaSignOutAlt } from "react-icons/fa";
import axios from "axios";

const StudentDashboard = () => {
  const { ID } = useParams();
  const navigate = useNavigate();
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/student/${ID}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setStudentData(response.data.data.student);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch student data");
        setLoading(false);
        if (err.response?.status === 401) {
          navigate('/login');
        }
      }
    };

    fetchStudentData();
  }, [ID, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="text-red-600 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Navbar */}
      <nav className="bg-gradient-to-r from-blue-800 to-blue-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <NavLink to='/' className="flex items-center">
              <img src={logo} alt="logo" className="h-10 w-auto" />
              <h1 className="ml-3 text-2xl font-bold text-white">
                MedLearn
              </h1>
            </NavLink>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <FaBell className="h-6 w-6 text-white hover:text-blue-200 transition-colors" />
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center text-xs text-white">
                  3
                </span>
              </div>
              <button 
                onClick={() => navigate('/')} 
                className="bg-white text-blue-800 px-4 py-2 rounded-md hover:bg-blue-50 transition-colors"
              >
                <FaSignOutAlt className="inline-block mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome, {studentData?.Firstname}!
              </h1>
              <p className="text-gray-600 mt-1">
                Track your medical education journey
              </p>
            </div>
            <div className="bg-blue-100 p-4 rounded-full">
              <FaUserMd className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-full mr-4">
                <FaBookMedical className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-gray-600">Enrolled Courses</p>
                <p className="text-2xl font-bold text-gray-900">5</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-full mr-4">
                <FaCalendarAlt className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-gray-600">Upcoming Classes</p>
                <p className="text-2xl font-bold text-gray-900">3</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-full mr-4">
                <FaChartLine className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-gray-600">Progress</p>
                <p className="text-2xl font-bold text-gray-900">75%</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Main Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-4">
              <h2 className="text-xl font-semibold text-white flex items-center">
                <FaBookMedical className="mr-2" />
                My Courses
              </h2>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-4">
                Access your enrolled medical courses and learning materials
              </p>
              <button
                onClick={() => navigate(`/Student/Dashboard/${ID}/Courses`)}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                View Courses
              </button>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <div className="bg-gradient-to-r from-green-600 to-green-800 p-4">
              <h2 className="text-xl font-semibold text-white flex items-center">
                <FaGraduationCap className="mr-2" />
                Learning Progress
              </h2>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-4">
                Track your progress and achievements in medical education
              </p>
              <button
                onClick={() => navigate(`/Student/Dashboard/${ID}/Progress`)}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
              >
                View Progress
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard; 