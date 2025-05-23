import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FaCalendarAlt, FaUserMd, FaBook, FaClock } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Classes = () => {
  const { ID } = useParams();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Please login to view classes');
          setLoading(false);
          return;
        }

        console.log('Fetching classes...');
        const response = await axios.get(`http://localhost:8000/api/student/classes`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          withCredentials: true
        });

        console.log('Classes API Response:', response.data);

        if (response.data && response.data.data) {
          setClasses(response.data.data);
        } else {
          setClasses([]);
        }
      } catch (error) {
        console.error('Error fetching classes:', error);
        setError(error.response?.data?.message || 'Failed to fetch classes. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 min-h-[400px] flex flex-col justify-center items-center">
        <div className="text-red-600 mb-4">{error}</div>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!classes || classes.length === 0) {
    return (
      <div className="text-center py-12 min-h-[400px] flex flex-col justify-center items-center bg-white rounded-xl shadow-sm">
        <div className="mb-4">
          <FaCalendarAlt className="mx-auto text-6xl text-gray-400" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">No Classes Assigned</h2>
        <p className="text-gray-500 mb-6">You haven't been assigned any classes yet. Please contact your administrator to get enrolled in classes.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 min-h-[400px]">
      {/* Weekly Schedule */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Weekly Schedule</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {classes.map((classItem) => (
            <motion.div
              key={classItem._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center space-x-3 mb-2">
                <FaUserMd className="text-blue-600 flex-shrink-0" />
                <h3 className="font-medium text-gray-900 truncate">{classItem.teacherName}</h3>
              </div>
              <div className="flex items-center space-x-3 mb-2">
                <FaBook className="text-blue-600 flex-shrink-0" />
                <span className="text-gray-600 truncate">{classItem.courseName}</span>
              </div>
              <div className="flex items-center space-x-3">
                <FaClock className="text-blue-600 flex-shrink-0" />
                <span className="text-gray-600 truncate">{classItem.schedule}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Upcoming Classes */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Classes</h2>
        <div className="space-y-4">
          {classes.map((classItem) => (
            <motion.div
              key={classItem._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="flex items-center space-x-4 min-w-0">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <FaUserMd className="text-blue-600" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-medium text-gray-900 truncate">{classItem.courseName}</h3>
                  <p className="text-sm text-gray-600 truncate">{classItem.teacherName}</p>
                </div>
              </div>
              <div className="text-right ml-4 flex-shrink-0">
                <p className="text-sm font-medium text-gray-900">{classItem.schedule}</p>
                <p className="text-sm text-gray-600">{classItem.duration}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Classes; 