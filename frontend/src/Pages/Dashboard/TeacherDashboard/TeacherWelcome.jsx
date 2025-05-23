import React from 'react';
import { motion } from 'framer-motion';
import { FaBookMedical, FaUsers, FaChartLine, FaCalendarAlt, FaChalkboardTeacher } from 'react-icons/fa';

const TeacherWelcome = () => {
  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-xl shadow-md p-6"
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back, Professor!</h1>
        <p className="text-gray-600">Manage your courses and track student progress</p>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={<FaBookMedical className="text-blue-500" size={20} />}
          title="Active Courses"
          value="4"
          description="This semester"
          color="blue"
        />
        <StatCard 
          icon={<FaUsers className="text-green-500" size={20} />}
          title="Total Students"
          value="120"
          description="Across all courses"
          color="green"
        />
        <StatCard 
          icon={<FaChartLine className="text-purple-500" size={20} />}
          title="Avg. Performance"
          value="85%"
          description="Class average"
          color="purple"
        />
        <StatCard 
          icon={<FaCalendarAlt className="text-yellow-500" size={20} />}
          title="Upcoming"
          value="5"
          description="Sessions this week"
          color="yellow"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ActionCard 
          icon={<FaBookMedical className="text-blue-600" size={24} />}
          title="Create New Course"
          description="Set up a new course with modules and content"
          buttonText="Create Course"
          color="blue"
          onClick={() => {}}
        />
        <ActionCard 
          icon={<FaChalkboardTeacher className="text-green-600" size={24} />}
          title="Schedule Session"
          description="Plan your next teaching session"
          buttonText="Schedule Now"
          color="green"
          onClick={() => {}}
        />
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white rounded-xl shadow-md p-6"
      >
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          <ActivityItem 
            title="New assignment submitted"
            time="2 hours ago"
            course="Anatomy 101"
            studentCount="15 submissions"
          />
          <ActivityItem 
            title="Student question"
            time="1 day ago"
            course="Physiology 201"
            studentCount="From 3 students"
          />
          <ActivityItem 
            title="Upcoming deadline"
            time="Tomorrow"
            course="Biochemistry Lab"
            studentCount="Lab report due"
          />
        </div>
      </motion.div>
    </div>
  );
};

const StatCard = ({ icon, title, value, description, color }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-700',
    green: 'bg-green-50 text-green-700',
    purple: 'bg-purple-50 text-purple-700',
    yellow: 'bg-yellow-50 text-yellow-700'
  };

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className={`${colorClasses[color]} rounded-xl p-6 shadow-sm`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          <p className="text-xs opacity-75 mt-1">{description}</p>
        </div>
        <div className="p-3 bg-white bg-opacity-30 rounded-full">
          {icon}
        </div>
      </div>
    </motion.div>
  );
};

const ActionCard = ({ icon, title, description, buttonText, color, onClick }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100',
    green: 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100',
    purple: 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100',
    yellow: 'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100'
  };

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className={`${colorClasses[color]} rounded-xl p-6 border`}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="p-3 rounded-full bg-white inline-block mb-3">
            {icon}
          </div>
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        </div>
      </div>
      <button 
        onClick={onClick}
        className={`mt-4 px-4 py-2 rounded-md text-sm font-medium ${
          color === 'blue' ? 'bg-blue-600 hover:bg-blue-700' :
          color === 'green' ? 'bg-green-600 hover:bg-green-700' :
          color === 'purple' ? 'bg-purple-600 hover:bg-purple-700' :
          'bg-yellow-600 hover:bg-yellow-700'
        } text-white transition-colors`}
      >
        {buttonText}
      </button>
    </motion.div>
  );
};

const ActivityItem = ({ title, time, course, studentCount }) => (
  <div className="flex items-start pb-4 border-b border-gray-100 last:border-0 last:pb-0">
    <div className="h-2 w-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
    <div className="flex-1">
      <div className="flex justify-between items-start">
        <p className="font-medium text-gray-800">{title}</p>
        <span className="text-xs text-gray-500">{time}</span>
      </div>
      <div className="text-sm text-gray-600 mt-1">
        <span>{course}</span>
        <span className="mx-2">•</span>
        <span>{studentCount}</span>
      </div>
    </div>
  </div>
);

export default TeacherWelcome;
