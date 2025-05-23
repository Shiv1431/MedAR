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
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        const storedUserType = localStorage.getItem('userType');
        
        if (!token || !storedUserType) {
          console.log('No token or user type found');
          setLoading(false);
          return;
        }

        console.log('Verifying token for:', storedUserType);
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/${storedUserType}/verify-token`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            withCredentials: true
          }
        );

        console.log('Token verification response:', response.data);
        if (response.data.success) {
          setUser(response.data.data.student);
          setUserType(storedUserType);
        } else {
          // Clear invalid data
          localStorage.removeItem('token');
          localStorage.removeItem('userType');
          localStorage.removeItem('userId');
          setUser(null);
          setUserType(null);
        }
      } catch (error) {
        console.error('Token verification failed:', error.response?.data || error.message);
        // Clear invalid data
        localStorage.removeItem('token');
        localStorage.removeItem('userType');
        localStorage.removeItem('userId');
        setUser(null);
        setUserType(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email, password, userType) => {
    try {
      console.log('Attempting login with:', { email, userType });
      
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/${userType}/login`,
        { Email: email, Password: password },
        { 
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
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

        // Set auth state
        setUser(user);
        setUserType(userType);
        
        // Store in localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('userType', userType);
        localStorage.setItem('userId', user._id);

        // Set default auth header
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        return { 
          success: true, 
          data: response.data.data,
          message: 'Login successful'
        };
      }
      
      return { 
        success: false, 
        message: 'Invalid response format from server'
      };
    } catch (error) {
      console.error('Login error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });

      if (error.response) {
        const { status, data } = error.response;
        
        switch (status) {
          case 400:
            return { 
              success: false, 
              message: data?.message || 'Invalid email or password'
            };
          case 401:
            return { 
              success: false, 
              message: data?.message || 'Email not verified'
            };
          case 403:
            return { 
              success: false, 
              message: data?.message || 'Incorrect password'
            };
          default:
            return { 
              success: false, 
              message: data?.message || 'Login failed. Please try again.'
            };
        }
      }

      return {
        success: false,
        message: 'Unable to connect to the server. Please check your internet connection.'
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

