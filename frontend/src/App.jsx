import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';

// Layouts
const StudentLayout = React.lazy(() => import('./Pages/Dashboard/StudentDashboard/StudentLayout'));
const TeacherLayout = React.lazy(() => import('./Pages/Dashboard/TeacherDashboard/TeacherLayout'));

// Pages
const Login = React.lazy(() => import('./Pages/Login/Login'));
const Signup = React.lazy(() => import('./Pages/Signup/Signup'));
const Anatomy3D = React.lazy(() => import('./Pages/Anatomy/Anatomy3D'));

// Dashboard Pages
const StudentWelcome = React.lazy(() => import('./Pages/Dashboard/StudentDashboard/Welcome'));
const TeacherWelcome = React.lazy(() => import('./Pages/Dashboard/TeacherDashboard/TeacherWelcome'));
const Profile = React.lazy(() => import('./Pages/Dashboard/StudentDashboard/Profile'));
const StudentCourses = React.lazy(() => import('./Pages/Dashboard/StudentDashboard/Courses'));
const StudentClasses = React.lazy(() => import('./Pages/Dashboard/StudentDashboard/Classes'));
const SearchTeacher = React.lazy(() => import('./Pages/Dashboard/StudentDashboard/SearchTeacher'));
const TeacherProfile = React.lazy(() => import('./Pages/Dashboard/TeacherDashboard/Profile'));
const TeacherCourses = React.lazy(() => import('./Pages/Dashboard/TeacherDashboard/Courses'));
const TeacherStudents = React.lazy(() => import('./Pages/Dashboard/TeacherDashboard/Students'));
const TeacherSchedule = React.lazy(() => import('./Pages/Dashboard/TeacherDashboard/Schedule'));

// Components
const Navbar = React.lazy(() => import('./Components/Navbar/Navbar'));
const Footer = React.lazy(() => import('./Components/Footer/Footer'));

// Loading component
const Loading = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

// Protected Route Component
const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

const AppContent = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  const renderDashboard = () => {
    if (!user) return <Navigate to="/login" replace />;
    
    const dashboardPath = user.role === 'student' 
      ? `/Student/Dashboard/${user._id}/Welcome`
      : `/Teacher/Dashboard/${user._id}/Welcome`;
    
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
            <Route element={<ProtectedRoute />}>
              <Route path="/anatomy" element={<Anatomy3D />} />
              
              {/* Student Dashboard Routes */}
              <Route path="/Student/Dashboard/:ID" element={<StudentLayout />}>
                <Route index element={<Navigate to="Welcome" replace />} />
                <Route path="Welcome" element={<StudentWelcome />} />
                <Route path="AR-Anatomy" element={<Anatomy3D />} />
                <Route path="Profile" element={<Profile />} />
                <Route path="Courses" element={<StudentCourses />} />
                <Route path="Classes" element={<StudentClasses />} />
                <Route path="Search" element={<SearchTeacher />} />
              </Route>
              
              {/* Teacher Dashboard Routes */}
              <Route path="/Teacher/Dashboard/:ID" element={<TeacherLayout />}>
                <Route index element={<Navigate to="Welcome" replace />} />
                <Route path="Welcome" element={<TeacherWelcome />} />
                <Route path="Profile" element={<TeacherProfile />} />
                <Route path="Courses" element={<TeacherCourses />} />
                <Route path="Students" element={<TeacherStudents />} />
                <Route path="Schedule" element={<TeacherSchedule />} />
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

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <AppContent />
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App; 