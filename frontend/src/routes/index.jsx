import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Layouts
const StudentLayout = React.lazy(() => import('../Pages/Dashboard/StudentDashboard/StudentLayout'));
const TeacherLayout = React.lazy(() => import('../Pages/Dashboard/TeacherDashboard/TeacherLayout'));

// Pages
const Login = React.lazy(() => import('../Pages/Login/Login'));
const Signup = React.lazy(() => import('../Pages/Signup/Signup'));
const Anatomy3D = React.lazy(() => import('../Pages/Anatomy/Anatomy3D'));

// Dashboard Pages
const StudentWelcome = React.lazy(() => import('../Pages/Dashboard/StudentDashboard/Welcome'));
const TeacherWelcome = React.lazy(() => import('../Pages/Dashboard/TeacherDashboard/TeacherWelcome'));
const Profile = React.lazy(() => import('../Pages/Dashboard/StudentDashboard/Profile'));
const StudentCourses = React.lazy(() => import('../Pages/Dashboard/StudentDashboard/Courses'));
const StudentClasses = React.lazy(() => import('../Pages/Dashboard/StudentDashboard/Classes'));
const SearchTeacher = React.lazy(() => import('../Pages/Dashboard/StudentDashboard/SearchTeacher'));
const TeacherProfile = React.lazy(() => import('../Pages/Dashboard/TeacherDashboard/Profile'));
const TeacherCourses = React.lazy(() => import('../Pages/Dashboard/TeacherDashboard/Courses'));
const TeacherStudents = React.lazy(() => import('../Pages/Dashboard/TeacherDashboard/Students'));
const TeacherSchedule = React.lazy(() => import('../Pages/Dashboard/TeacherDashboard/Schedule'));

// Components
const Navbar = React.lazy(() => import('../Components/Navbar/Navbar'));
const Footer = React.lazy(() => import('../Components/Footer/Footer'));

// Loading component
const Loading = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const AppRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  const renderDashboard = () => {
    if (!user) return <Navigate to="/login" replace />;
    
    const dashboardPath = user.role === 'student' 
      ? `/student/dashboard/${user._id}/welcome`
      : `/teacher/dashboard/${user._id}/welcome`;
    
    return <Navigate to={dashboardPath} replace />;
  };

  return (
    <Suspense fallback={<Loading />}>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={renderDashboard()} />
            <Route 
              path="/login" 
              element={!user ? <Login /> : renderDashboard()} 
            />
            <Route 
              path="/signup" 
              element={!user ? <Signup /> : renderDashboard()} 
            />
            
            {/* Protected Routes */}
            <Route element={<ProtectedRoute><Outlet /></ProtectedRoute>}>
              <Route path="/anatomy" element={<Anatomy3D />} />
              
              {/* Student Dashboard Routes */}
              <Route path="/student/dashboard/:id" element={<StudentLayout />}>
                <Route index element={<Navigate to="welcome" replace />} />
                <Route path="welcome" element={<StudentWelcome />} />
                <Route path="ar-anatomy" element={<Anatomy3D />} />
                <Route path="profile" element={<Profile />} />
                <Route path="courses" element={<StudentCourses />} />
                <Route path="classes" element={<StudentClasses />} />
                <Route path="search" element={<SearchTeacher />} />
              </Route>
              
              {/* Teacher Dashboard Routes */}
              <Route path="/teacher/dashboard/:id" element={<TeacherLayout />}>
                <Route index element={<Navigate to="welcome" replace />} />
                <Route path="welcome" element={<TeacherWelcome />} />
                <Route path="profile" element={<TeacherProfile />} />
                <Route path="courses" element={<TeacherCourses />} />
                <Route path="students" element={<TeacherStudents />} />
                <Route path="schedule" element={<TeacherSchedule />} />
              </Route>
            </Route>
            
            {/* Catch all other routes */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Suspense>
  );
};

export default AppRoutes; 