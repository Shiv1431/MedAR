import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useParams, Link, useLocation } from 'react-router-dom';
import { FaBars, FaTimes, FaHome, FaBook, FaChalkboardTeacher, FaUser } from 'react-icons/fa';
import { useAuth } from '../../../context/AuthContext';
import './StudentLayout.css';

const StudentLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { ID } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  useEffect(() => {
    // Verify token and user type on mount
    const token = localStorage.getItem('token');
    const userType = localStorage.getItem('userType');
    
    if (!token || userType !== 'student') {
      navigate('/login');
    }
  }, [navigate]);

  const menuItems = [
    { path: 'Welcome', icon: <FaHome />, label: 'Dashboard' },
    { path: 'Courses', icon: <FaBook />, label: 'Courses' },
    { path: 'ClassMentor', icon: <FaChalkboardTeacher />, label: 'Class & Mentor' },
    { path: 'Profile', icon: <FaUser />, label: 'Profile' }
  ];

  const handleLogout = async () => {
    try {
      await logout('student');
      localStorage.removeItem('token');
      localStorage.removeItem('userType');
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const isActive = (path) => {
    return location.pathname.includes(path);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <h2 className="text-xl font-bold text-white">MedAR</h2>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-white hover:text-gray-200"
          >
            {isSidebarOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={`/Student/Dashboard/${ID}/${item.path}`}
              className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              {isSidebarOpen && <span className="nav-label">{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button
            onClick={handleLogout}
            className="logout-button"
          >
            {isSidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-6 py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentLayout;