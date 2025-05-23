"use client"

import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { login as apiLogin, signup as apiSignup, logout as apiLogout, verifyToken } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('token');
      const userType = localStorage.getItem('userType');

      if (!token || !userType) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/${userType}/verify-token`,
          {
            headers: { 
              Authorization: `Bearer ${token}`,
              'Accept': 'application/json'
            },
            withCredentials: true
          }
        );

        if (response.data.success) {
          setUser(response.data.data.student);
          setUserType(userType);
        } else {
          localStorage.removeItem('token');
          localStorage.removeItem('userType');
        }
      } catch (error) {
        console.error('Token verification failed:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('userType');
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, []);

  const login = async (email, password, userType) => {
    try {
      const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/api/${userType}/login`;
      console.log('Making login request to:', apiUrl);
      console.log('Request payload:', { Email: email, Password: password });
      
      const response = await axios.post(
        apiUrl,
        { Email: email, Password: password },
        { 
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );

      console.log('Login response:', response.data);

      if (response.data && response.data.data) {
        const { user, token } = response.data.data;
        
        if (!user || !token) {
          console.error('Invalid response data:', response.data);
          return { success: false, message: 'Invalid response from server' };
        }

        setUser(user);
        setUserType(userType);
        localStorage.setItem('token', token);
        localStorage.setItem('userType', userType);
        localStorage.setItem('userId', user._id);
        return { success: true, data: response.data.data };
      } else {
        console.error('Unexpected response structure:', response.data);
        return { success: false, message: 'Unexpected response from server' };
      }
    } catch (error) {
      console.error('Login error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers
      });

      if (error.response) {
        if (error.response.status === 400) {
          return { success: false, message: 'Invalid email or password' };
        } else if (error.response.status === 401) {
          return { success: false, message: 'Email not verified' };
        } else if (error.response.status === 403) {
          return { success: false, message: 'Incorrect password' };
        }
      }

      return {
        success: false,
        message: error.response?.data?.message || 'Login failed. Please try again.'
      };
    }
  };

  const signup = async (userData) => {
    try {
      setLoading(true);
      const response = await apiSignup(userData);
      
      if (response.success) {
        toast.success('Signup successful! Please verify your email.');
        return { success: true, redirectPath: '/login' };
      } else {
        toast.error(response.message || 'Signup failed');
        return { success: false, message: response.message };
      }
    } catch (error) {
      console.error('Signup error:', error);
      const errorMessage = error.response?.data?.message || 'Signup failed. Please try again.';
      toast.error(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = async (userType) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/${userType}/logout`,
        {},
        {
          headers: { 
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Accept': 'application/json'
          },
          withCredentials: true
        }
      );
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setUserType(null);
      localStorage.removeItem('token');
      localStorage.removeItem('userType');
      localStorage.removeItem('userId');
    }
  };

  const value = {
    user,
    userType,
    loading,
    login,
    signup,
    logout,
    isAuthenticated: !!user && !!userType,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;

