import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Layouts
import StudentLayout from './Pages/Dashboard/StudentDashboard/StudentLayout';
import TeacherLayout from './Pages/Dashboard/TeacherDashboard/TeacherLayout';

// Pages
const Login = lazy(() => import('./Pages/Login/Login'));
const Signup = lazy(() => import('./Pages/Signup/Signup'));
const Anatomy3D = lazy(() => import('./Pages/Anatomy/Anatomy3D'));

// Dashboard Pages
const StudentWelcome = lazy(() => import('./Pages/Dashboard/StudentDashboard/Welcome'));
const TeacherWelcome = lazy(() => import('./Pages/Dashboard/TeacherDashboard/TeacherWelcome'));
const Profile = lazy(() => import('./Pages/Dashboard/StudentDashboard/Profile'));
const StudentCourses = lazy(() => import('./Pages/Dashboard/StudentDashboard/Courses'));
const StudentClasses = lazy(() => import('./Pages/Dashboard/StudentDashboard/Classes'));
const SearchTeacher = lazy(() => import('./Pages/Dashboard/StudentDashboard/SearchTeacher'));
const TeacherProfile = lazy(() => import('./Pages/Dashboard/TeacherDashboard/Profile'));
const TeacherCourses = lazy(() => import('./Pages/Dashboard/TeacherDashboard/Courses'));
const TeacherStudents = lazy(() => import('./Pages/Dashboard/TeacherDashboard/Students'));
const TeacherSchedule = lazy(() => import('./Pages/Dashboard/TeacherDashboard/Schedule'));

// Components
const Navbar = lazy(() => import('./Components/Navbar/Navbar'));
const Footer = lazy(() => import('./Components/Footer/Footer'));
const ProtectedRoute = lazy(() => import('./Components/ProtectedRoute'));

// Loading component
const Loading = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

function App() {
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
}

export default App; 