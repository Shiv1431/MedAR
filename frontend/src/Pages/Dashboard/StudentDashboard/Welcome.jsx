import React from 'react';
import { motion } from 'framer-motion';
import { FaBookOpen, FaUserGraduate, FaCalendarAlt, FaChartLine, FaCheckCircle, FaVrCardboard, FaBookMedical, FaUserMd } from 'react-icons/fa';
import { Link, useParams } from 'react-router-dom';

const Welcome = () => {
  const { ID } = useParams();

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-xl shadow-md p-6"
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back!</h1>
        <p className="text-gray-600">Track your learning progress and access your courses</p>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={<FaBookOpen className="text-blue-500" size={24} />}
          title="Enrolled Courses"
          value="5"
          description="Active courses"
          color="blue"
        />
        <StatCard 
          icon={<FaUserGraduate className="text-green-500" size={24} />}
          title="Learning Hours"
          value="24.5"
          description="This week"
          color="green"
        />
        <StatCard 
          icon={<FaCalendarAlt className="text-purple-500" size={24} />}
          title="Upcoming"
          value="3"
          description="Sessions this week"
          color="purple"
        />
        <StatCard 
          icon={<FaChartLine className="text-yellow-500" size={24} />}
          title="Progress"
          value="78%"
          description="Overall completion"
          color="yellow"
        />
      </div>

      {/* Quick Actions */}
      <QuickActions ID={ID} />

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
            title="Completed Anatomy Module 1"
            time="2 hours ago"
            course="Human Anatomy"
            completed={true}
          />
          <ActivityItem 
            title="New assignment available"
            time="1 day ago"
            course="Physiology 101"
            completed={false}
          />
          <ActivityItem 
            title="Upcoming quiz tomorrow"
            time="2 days ago"
            course="Biochemistry"
            completed={false}
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

const ActivityItem = ({ title, time, course, completed }) => (
  <div className="flex items-start pb-4 border-b border-gray-100 last:border-0 last:pb-0 group">
    <div className={`h-2 w-2 rounded-full mt-2 mr-3 ${completed ? 'bg-green-500' : 'bg-blue-500'}`}></div>
    <div className="flex-1">
      <div className="flex items-start justify-between">
        <p className="font-medium text-gray-800 group-hover:text-blue-600 transition-colors">
          {title}
        </p>
        {completed && (
          <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
        )}
      </div>
      <div className="flex items-center text-sm text-gray-500 mt-1">
        <span className="font-medium">{course}</span>
        <span className="mx-2">•</span>
        <span>{time}</span>
      </div>
    </div>
  </div>
);

// Quick Actions Component
const QuickActions = ({ ID }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <Link
      to={`/Student/Dashboard/${ID}/AR-Anatomy`}
      className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
    >
      <div className="flex items-center space-x-4">
        <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
          <FaVrCardboard className="text-blue-600 text-xl" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">AR Anatomy Lab</h3>
          <p className="text-sm text-gray-600">Explore human anatomy in AR</p>
        </div>
      </div>
    </Link>

    <Link
      to={`/Student/Dashboard/${ID}/Courses`}
      className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
    >
      <div className="flex items-center space-x-4">
        <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
          <FaBookMedical className="text-green-600 text-xl" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Medical Courses</h3>
          <p className="text-sm text-gray-600">Browse available courses</p>
        </div>
      </div>
    </Link>

    <Link
      to={`/Student/Dashboard/${ID}/Classes`}
      className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
    >
      <div className="flex items-center space-x-4">
        <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center">
          <FaUserMd className="text-purple-600 text-xl" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">My Classes</h3>
          <p className="text-sm text-gray-600">View your enrolled classes</p>
        </div>
      </div>
    </Link>
  </div>
);

export default Welcome;
