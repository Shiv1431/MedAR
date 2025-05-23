import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaUserMd, FaStethoscope, FaUserGraduate } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import Radiobtn from "../Components/RadioBtn/Radiobtn";
import Navbar from "../../Components/Navbar/Navbar";
import Footer from '../../Components/Footer/Footer';
import { useAuth } from "../../context/AuthContext";
import './Login.css';
import { toast } from 'react-toastify';

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    userType: "student" // Default user type
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.userType) {
      newErrors.userType = "Please select user type";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      console.log('Submitting login with data:', formData);
      const result = await login(formData.email, formData.password, formData.userType);
      console.log('Login result:', result);
      
      if (result.success && result.data) {
        // Store user type and token in localStorage
        localStorage.setItem('userType', formData.userType);
        localStorage.setItem('token', result.data.token);
        localStorage.setItem('userId', result.data.user._id);
        
        // Ensure we're using the correct user type for redirection
        if (formData.userType === 'student') {
          const studentPath = `/Student/Dashboard/${result.data.user._id}`;
          console.log('Redirecting student to:', studentPath);
          navigate(studentPath, { replace: true });
          toast.success('Login successful!');
        } else {
          const teacherPath = `/Teacher/Dashboard/${result.data.user._id}`;
          console.log('Redirecting teacher to:', teacherPath);
          navigate(teacherPath, { replace: true });
          toast.success('Login successful!');
        }
      } else {
        const errorMessage = result.message || "Login failed. Please try again.";
        setErrors(prev => ({
          ...prev,
          submit: errorMessage
        }));
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.message || "Login failed. Please try again.";
      setErrors(prev => ({
        ...prev,
        submit: errorMessage
      }));
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left Side - Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-lg shadow-lg p-8"
            >
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl font-bold text-gray-900 mb-2"
              >
                Welcome Back!
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-gray-600 mb-8"
              >
                Please log in to your account
              </motion.p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your email"
                    autoComplete="username"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                      errors.password ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                  />
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Radiobtn 
                      userType={formData.userType} 
                      setUserType={(type) => {
                        console.log('Setting user type to:', type); // Debug log
                        setFormData(prev => ({ ...prev, userType: type }));
                        if (errors.userType) {
                          setErrors(prev => ({ ...prev, userType: "" }));
                        }
                      }} 
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate('/forgetpassword')}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Forgot Password?
                  </button>
                </div>

                {errors.userType && (
                  <p className="text-sm text-red-600">{errors.userType}</p>
                )}

                {errors.submit && (
                  <p className="text-sm text-red-600">{errors.submit}</p>
                )}

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400"
                  disabled={loading}
                >
                  {loading ? 'Logging in...' : 'Log In'}
                </button>

                <div className="text-center">
                  <span className="text-gray-600">Don't have an account? </span>
                  <NavLink to="/signup" className="text-blue-600 hover:text-blue-800">
                    Sign up
                  </NavLink>
                </div>
              </form>
            </motion.div>

            {/* Right Side - Illustration */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="hidden md:block"
            >
              <div className="flex flex-col items-center justify-center space-y-8">
                <div className="text-center">
                  <FaUserMd className="w-24 h-24 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-2xl font-semibold text-gray-900">Medical Education Platform</h3>
                  <p className="text-gray-600 mt-2">Access comprehensive medical learning resources</p>
                </div>
                <div className="grid grid-cols-2 gap-8">
                  <div className="text-center">
                    <FaStethoscope className="w-12 h-12 text-blue-600 mx-auto mb-2" />
                    <p className="text-gray-600">Expert Instructors</p>
                  </div>
                  <div className="text-center">
                    <FaUserGraduate className="w-12 h-12 text-blue-600 mx-auto mb-2" />
                    <p className="text-gray-600">Interactive Learning</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
