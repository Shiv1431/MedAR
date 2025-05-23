"use client"

import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { login as apiLogin, signup as apiSignup, logout as apiLogout } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          await verifyToken(token);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const verifyToken = async (token) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/student/verify-token`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Token verification failed');
      }

      const data = await response.json();
      if (data.success) {
        setUser(data.user);
      } else {
        throw new Error('Token verification failed');
      }
    } catch (error) {
      console.error('Token verification failed:', error);
      localStorage.removeItem('token');
      setUser(null);
      throw error;
    }
  };

  const login = async (email, password, userType) => {
    setLoading(true);
    try {
      const response = await apiLogin(email, password, userType);
      if (response.success) {
        const { token, user } = response.data;
        localStorage.setItem('token', token);
        setUser(user);
        toast.success('Login successful!');
        
        // Return the redirect path based on user role
        if (user.role === 'student') {
          return {
            success: true,
            redirectPath: `/Student/Dashboard/${user._id}/Welcome`
          };
        } else if (user.role === 'teacher') {
          return {
            success: true,
            redirectPath: `/Teacher/Dashboard/${user._id}/Welcome`
          };
        }
      } else {
        toast.error(response.message || 'Login failed');
        return { success: false, message: response.message };
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.response?.data?.message || 'Login failed');
      return { success: false, message: 'Login failed' };
    } finally {
      setLoading(false);
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

  const logout = async () => {
    try {
      setLoading(true);
      await apiLogout();
      localStorage.removeItem('token');
      setUser(null);
      toast.success('Logged out successfully!');
      return { success: true, redirectPath: '/login' };
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Logout failed. Please try again.');
      return { success: false, message: 'Logout failed' };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
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

