import React from 'react'
import './index.css'
import ReactDOM from 'react-dom/client'
import Landing from './Pages/Home/Landing/Landing'
import About from './Pages/Home/About/About'
import Contact from './Pages/Home/Contact/Contact'
import Courses from './Pages/Home/Courses/Courses'
import Login from './Pages/Login/Login'
import Signup from './Pages/Signup/Signup'
import AdminLogin from './Pages/Login/AdminLogin'
import Chatbot from './Pages/Home/Chatbot/Chatbot'
import Anatomy3D from './Pages/Anatomy/Anatomy3D'
import MedicalCourses from './Pages/MedicalCourses/MedicalCourses'
// import UploadImage from './Pages/Dashboard/StudentDashboard/UploadImage'
// import ARViewer from './Pages/Dashboard/StudentDashboard/ARViewer'

import { RouterProvider, Route, createBrowserRouter, createRoutesFromElements, Navigate } from 'react-router-dom'
import Layout from './Layout'
import StudentDocument from './Pages/Components/DocumentVerification/StudentDocument'
import TeacherDocument from './Pages/Components/DocumentVerification/TeacherDocument'
import VarifyEmail from './Pages/Components/VarifyEmail/VarifyEmail'
import Rejected from './Pages/Response/Rejected'
import Pending from './Pages/Response/Pending'
import Admin from './Pages/Components/Admin/Admin'
import VarifyDoc from './Pages/Components/Admin/VarifyDoc'
import TeacherLayout from './Pages/Dashboard/TeacherDashboard/TeacherLayout'
import StudentLayout from './Pages/Dashboard/StudentDashboard/StudentLayout'
import SearchTeacher from './Pages/Dashboard/StudentDashboard/SearchTeacher'
import StudentClasses from './Pages/Dashboard/StudentDashboard/StudentClasses'
import StudentCourses from './Pages/Dashboard/StudentDashboard/StudentCourses'
import DashboardTeacher from './Pages/Dashboard/TeacherDashboard/DashboardTeacher'
import TeacherClasses from './Pages/Dashboard/TeacherDashboard/TeacherClasses'
import TeacherCourses from './Pages/Dashboard/TeacherDashboard/TeacherCourses'
import SearchData from './Pages/Home/Search/Search'
import ErrorPage from './Pages/ErrorPage/ErrorPage'
import Forgetpassword from './Pages/ForgetPassword/Forgetpassword'
import ResetPassword from './Pages/ForgetPassword/ResetPassword'
import { Toaster } from 'react-hot-toast'
import ResetTeacher from './Pages/ForgetPassword/ResetTeacher'
import Course from './Pages/Components/Admin/Course'
import WelcomeMedical from './Pages/Dashboard/StudentDashboard/WelcomeMedical'
import MedicalARViewer from './Pages/Dashboard/StudentDashboard/MedicalARViewer'
import UserDashboard from './Pages/UserDashboard/UserDashboard'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './context/ProtectedRoute'
import Profile from './Pages/Dashboard/StudentDashboard/Profile'


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<Layout/>}>
      {/* Public Routes */}
      <Route path='/' element={<Landing/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/Signup' element={<Signup/>}/>
      <Route path='/contact' element={<Contact/>}/>
      <Route path='/about' element={<About/>}/>
      <Route path='/varifyEmail' element={<VarifyEmail/>}/>
      <Route path='/adminLogin/' element={<AdminLogin/>}/>
      <Route path='/rejected/:user/:ID' element={<Rejected/>}/>
      <Route path='/pending' element={<Pending/>}/>
      <Route path='/forgetPassword' element={<Forgetpassword/>}/>
      <Route path='/student/forgetPassword/:token' element={<ResetPassword/>}/>
      <Route path='/teacher/forgetPassword/:token' element={<ResetTeacher/>}/>
      
      {/* Protected Routes */}
      <Route path='/User/Dashboard/:userid' element={
        <ProtectedRoute allowedRoles={['user']}>
          <UserDashboard/>
        </ProtectedRoute>
      }/>
      
      <Route path='/Search/:subject' element={
        <ProtectedRoute>
          <SearchData/>
        </ProtectedRoute>
      }/>
      
      <Route path='/StudentDocument/:Data' element={
        <ProtectedRoute allowedRoles={['student']}>
          <StudentDocument/>
        </ProtectedRoute>
      }/>
      
      <Route path='/TeacherDocument/:Data' element={
        <ProtectedRoute allowedRoles={['teacher']}>
          <TeacherDocument/>
        </ProtectedRoute>
      }/>
      
      <Route path='/courses' element={
        <ProtectedRoute>
          <MedicalCourses/>
        </ProtectedRoute>
      }/>
      
      <Route path='/chat' element={
        <ProtectedRoute>
          <Chatbot/>
        </ProtectedRoute>
      }/>
      
      <Route path='/admin/:data' element={
        <ProtectedRoute allowedRoles={['admin']}>
          <Admin/>
        </ProtectedRoute>
      }/>
      
      <Route path='/admin/course/:data' element={
        <ProtectedRoute allowedRoles={['admin']}>
          <Course/>
        </ProtectedRoute>
      }/>
      
      <Route path='/VarifyDoc/:type/:adminID/:ID' element={
        <ProtectedRoute allowedRoles={['admin']}>
          <VarifyDoc/>
        </ProtectedRoute>
      }/>
      
      <Route path='/anatomy' element={
        <ProtectedRoute>
          <Anatomy3D/>
        </ProtectedRoute>
      }/>
      
      {/* Student Dashboard Routes */}
      <Route path='/Student/Dashboard/:ID' element={
        <ProtectedRoute allowedRoles={['student']}>
          <StudentLayout/>
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="Welcome" replace />} />
        <Route path="Welcome" element={<WelcomeMedical/>}/>
        <Route path="Search" element={<SearchTeacher/>}/>
        <Route path="Classes" element={<StudentClasses/>}/>
        <Route path="Courses" element={<StudentCourses/>}/>
        <Route path="AR-Anatomy" element={<MedicalARViewer/>}/>
        <Route path="Profile" element={<Profile/>}/>
      </Route>
      
      {/* Teacher Dashboard Routes */}
      <Route path='/Teacher/Dashboard/:ID' element={
        <ProtectedRoute allowedRoles={['teacher']}>
          <TeacherLayout/>
        </ProtectedRoute>
      }>
        <Route path='/Teacher/Dashboard/:ID/Home' element={<DashboardTeacher/>}/>
        <Route path='/Teacher/Dashboard/:ID/Classes' element={<TeacherClasses/>}/>
        <Route path='/Teacher/Dashboard/:ID/Courses' element={<TeacherCourses/>}/>
      </Route>
      
      {/* 404 Route */}
      <Route path='*' element={<ErrorPage/>}/>
    </Route>
  )
)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <Toaster/>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>,
)

//testing