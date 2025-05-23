import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';

// Lazy load components
const Login = lazy(() => import('./Pages/Login/Login'));
const Signup = lazy(() => import('./Pages/Signup/Signup'));
const StudentLayout = lazy(() => import('./Pages/Dashboard/StudentDashboard/StudentLayout'));
const Welcome = lazy(() => import('./Pages/Dashboard/StudentDashboard/Welcome'));
const Courses = lazy(() => import('./Pages/Dashboard/StudentDashboard/Courses'));
const ClassMentor = lazy(() => import('./Pages/Dashboard/StudentDashboard/ClassMentor'));
const Profile = lazy(() => import('./Pages/Dashboard/StudentDashboard/Profile'));
const TeacherLayout = lazy(() => import('./Pages/Dashboard/TeacherDashboard/TeacherLayout'));
const TeacherWelcome = lazy(() => import('./Pages/Dashboard/TeacherDashboard/TeacherWelcome'));
const TeacherProfile = lazy(() => import('./Pages/Dashboard/TeacherDashboard/Profile'));
const TeacherCourses = lazy(() => import('./Pages/Dashboard/TeacherDashboard/Courses'));
const TeacherStudents = lazy(() => import('./Pages/Dashboard/TeacherDashboard/Students'));
const TeacherSchedule = lazy(() => import('./Pages/Dashboard/TeacherDashboard/Schedule'));

// Components
const Navbar = lazy(() => import('./Components/Navbar/Navbar'));
const Footer = lazy(() => import('./Components/Footer/Footer'));

// Loading component
const Loading = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
  </div>
);

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const userType = localStorage.getItem('userType');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Suspense fallback={<Loading />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Student Dashboard Routes */}
            <Route
              path="/Student/Dashboard/:ID/*"
              element={
                <ProtectedRoute>
                  <StudentLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="Welcome" replace />} />
              <Route path="Welcome" element={<Welcome />} />
              <Route path="Courses" element={<Courses />} />
              <Route path="ClassMentor" element={<ClassMentor />} />
              <Route path="Profile" element={<Profile />} />
            </Route>

            {/* Redirect root to login */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            
            {/* Teacher Dashboard Routes */}
            <Route path="/Teacher/Dashboard/:ID" element={<TeacherLayout />}>
              <Route index element={<Navigate to="Welcome" replace />} />
              <Route path="Welcome" element={<TeacherWelcome />} />
              <Route path="Profile" element={<TeacherProfile />} />
              <Route path="Courses" element={<TeacherCourses />} />
              <Route path="Students" element={<TeacherStudents />} />
              <Route path="Schedule" element={<TeacherSchedule />} />
            </Route>
            
            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
          <ToastContainer position="top-right" autoClose={3000} />
        </Suspense>
      </AuthProvider>
    </Router>
  );
}

export default App; 