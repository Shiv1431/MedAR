"use client"

import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { login as apiLogin, signup as apiSignup, logout as apiLogout, verifyToken as apiVerifyToken } from '../services/api';

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
        const storedUser = localStorage.getItem('user');
        
        if (!token || !storedUserType || !storedUser) {
          console.log('Missing authentication data');
          setLoading(false);
          return;
        }

        const response = await apiVerifyToken(storedUserType);
        
        if (response.success) {
          const userData = response.data.student || response.data.teacher;
          setUser(userData);
          setUserType(storedUserType);
          localStorage.setItem('user', JSON.stringify(userData));
        } else {
          throw new Error(response.message || 'Token verification failed');
        }
      } catch (error) {
        console.error('Token verification failed:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('userType');
        localStorage.removeItem('userId');
        localStorage.removeItem('user');
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
      const response = await apiLogin(email, password, userType);
      
      if (response.success) {
        const { user, token } = response.data;
        
        localStorage.setItem('token', token);
        localStorage.setItem('userType', userType);
        localStorage.setItem('userId', user._id);
        localStorage.setItem('user', JSON.stringify(user));

        try {
          const verifyResponse = await apiVerifyToken(userType);
          
          if (verifyResponse.success) {
            setUser(user);
            setUserType(userType);
            return { 
              success: true, 
              data: response.data,
              message: 'Login successful'
            };
          } else {
            throw new Error(verifyResponse.message || 'Token verification failed');
          }
        } catch (verifyError) {
          console.error('Token verification failed after login:', verifyError);
          localStorage.removeItem('token');
          localStorage.removeItem('userType');
          localStorage.removeItem('userId');
          localStorage.removeItem('user');
          return { 
            success: false, 
            message: verifyError.message || 'Login successful but token verification failed'
          };
        }
      }
      
      return { 
        success: false, 
        message: response.message || 'Invalid response format from server'
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Unable to connect to the server. Please check your internet connection.'
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

