import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUserMd, FaBookMedical, FaUsers, FaChartLine, FaBell, FaSignOutAlt, FaChalkboardTeacher, FaCalendarAlt } from 'react-icons/fa';
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const TeacherDashboard = () => {
  const { data } = useParams();
  const navigate = useNavigate();
  const [teacherData, setTeacherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/teacher/${data}`);
        setTeacherData(response.data.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch teacher data");
        setLoading(false);
      }
    };

    fetchTeacherData();
  }, [data]);

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
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <FaUserMd className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-800">MedLearn</span>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-full hover:bg-blue-50">
                <FaBell className="h-6 w-6 text-gray-600" />
              </button>
              <button className="p-2 rounded-full hover:bg-blue-50">
                <FaSignOutAlt className="h-6 w-6 text-gray-600" />
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
                Welcome, Dr. {teacherData?.Firstname}!
              </h1>
              <p className="text-gray-600 mt-1">
                Manage your medical teaching activities
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
                <FaChalkboardTeacher className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-gray-600">Active Courses</p>
                <p className="text-2xl font-bold text-gray-900">4</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-full mr-4">
                <FaUsers className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-gray-900">120</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-full mr-4">
                <FaCalendarAlt className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-gray-600">Upcoming Sessions</p>
                <p className="text-2xl font-bold text-gray-900">5</p>
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
                Course Management
              </h2>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-4">
                Create and manage your medical courses and content
              </p>
              <button
                onClick={() => navigate(`/teacher/courses/${data}`)}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                Manage Courses
              </button>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <div className="bg-gradient-to-r from-green-600 to-green-800 p-4">
              <h2 className="text-xl font-semibold text-white flex items-center">
                <FaChartLine className="mr-2" />
                Student Analytics
              </h2>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-4">
                Track student progress and performance metrics
              </p>
              <button
                onClick={() => navigate(`/teacher/analytics/${data}`)}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
              >
                View Analytics
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;