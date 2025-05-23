"use client"

import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { login as apiLogin, signup as apiSignup, logout as apiLogout, verifyToken as apiVerifyToken } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null);
  const [loading, setLoading] = useState(true);

  const initializeAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      const storedUserType = localStorage.getItem('userType');
      const storedUser = localStorage.getItem('user');

      console.log('Initializing auth:', {
        hasToken: !!token,
        userType: storedUserType,
        hasUser: !!storedUser
      });

      if (token && storedUserType && storedUser) {
        // Set token in axios defaults
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // Verify token
        const response = await apiVerifyToken(storedUserType);
        console.log('Token verification response:', response);

        if (response.success) {
          setIsAuthenticated(true);
          setUserType(storedUserType);
          setUser(JSON.parse(storedUser));
        } else {
          console.error('Token verification failed:', response.message);
          // Clear invalid data
          localStorage.removeItem('token');
          localStorage.removeItem('userType');
          localStorage.removeItem('userId');
          localStorage.removeItem('user');
          delete axios.defaults.headers.common['Authorization'];
        }
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      // Clear any invalid data
      localStorage.removeItem('token');
      localStorage.removeItem('userType');
      localStorage.removeItem('userId');
      localStorage.removeItem('user');
      delete axios.defaults.headers.common['Authorization'];
    } finally {
      setLoading(false);
    }
  };

  // Add useEffect to initialize auth when component mounts
  useEffect(() => {
    initializeAuth();
  }, []);

  const login = async (email, password, type) => {
    try {
      console.log('Attempting login:', { email, type });
      const response = await apiLogin(email, password, type);
      console.log('Login response:', response);

      if (response.success) {
        const { token, user } = response.data;
        console.log('Login successful:', { hasToken: !!token, hasUser: !!user });

        if (!token) {
          throw new Error('No token received in login response');
        }

        // Store auth data
        localStorage.setItem('token', token);
        localStorage.setItem('userType', type);
        localStorage.setItem('userId', user._id);
        localStorage.setItem('user', JSON.stringify(user));

        // Set token in axios defaults
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        // Verify token immediately
        const verifyResponse = await apiVerifyToken(type);
        console.log('Token verification response:', verifyResponse);

        if (verifyResponse.success) {
          setIsAuthenticated(true);
          setUserType(type);
          setUser(user);
          return { success: true };
        } else {
          throw new Error('Token verification failed after login');
        }
      } else {
        return { success: false, message: response.message };
      }
    } catch (error) {
      console.error('Login error:', error);
      // Clear any partial data
      localStorage.removeItem('token');
      localStorage.removeItem('userType');
      localStorage.removeItem('userId');
      localStorage.removeItem('user');
      delete axios.defaults.headers.common['Authorization'];
      return { success: false, message: error.message };
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
      // Remove any trailing /api from base URL
      const baseUrl = import.meta.env.VITE_API_BASE_URL.replace(/\/api$/, '');
      const logoutUrl = `${baseUrl}/api/${userType}/logout`;

      await axios.post(
        logoutUrl,
        {},
        {
          headers: { 
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
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
      localStorage.removeItem('user');
    }
  };

  const verifyToken = async (userType) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token found');
        return false;
      }

      // Remove any trailing /api from base URL
      const baseUrl = import.meta.env.VITE_API_BASE_URL.replace(/\/api$/, '');
      const verifyUrl = `${baseUrl}/api/${userType}/verify-token`;

      console.log('Verifying token at:', verifyUrl);
      
      const response = await axios.get(
        verifyUrl,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Token verification response:', response.data);
      if (response.data.success) {
        setUser(response.data.data.student);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Token verification failed:', error.response?.data || error.message);
      localStorage.removeItem('token');
      localStorage.removeItem('userType');
      localStorage.removeItem('userId');
      localStorage.removeItem('user');
      setUser(null);
      return false;
    }
  };

  const value = {
    user,
    userType,
    loading,
    login,
    signup,
    logout,
    isAuthenticated,
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

