import axios from 'axios';

const API_BASE_URL = 'https://medarbackend.vercel.app/api';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth methods
export const login = async (email, password, userType) => {
  try {
    const response = await api.post(`/${userType}/login`, {
      Email: email,
      Password: password
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const signup = async (userData, userType) => {
  try {
    const response = await api.post(`/${userType}/signup`, userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const logout = async (userType) => {
  try {
    const response = await api.post(`/${userType}/logout`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const verifyToken = async (userType) => {
  try {
    const response = await api.get(`/${userType}/verify-token`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Profile methods
export const getProfile = async () => {
  try {
    const response = await api.get('/student/profile');
    return response;
  } catch (error) {
    console.error('Get profile error:', error);
    throw error;
  }
};

export const updateProfile = async (profileData) => {
  try {
    const response = await api.put('/student/profile', profileData);
    return response;
  } catch (error) {
    console.error('Update profile error:', error);
    throw error;
  }
};

export const uploadProfileImage = async (imageFile) => {
  try {
    const formData = new FormData();
    formData.append('profileImage', imageFile);
    
    const response = await api.post('/student/profile/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  } catch (error) {
    console.error('Upload profile image error:', error);
    throw error;
  }
};

// Generic methods
const get = async (url, config = {}) => {
  try {
    const response = await api.get(url, config);
    return response;
  } catch (error) {
    console.error('GET request error:', error);
    throw error;
  }
};

const post = async (url, data, config = {}) => {
  try {
    const response = await api.post(url, data, config);
    return response;
  } catch (error) {
    console.error('POST request error:', error);
    throw error;
  }
};

const put = async (url, data, config = {}) => {
  try {
    const response = await api.put(url, data, config);
    return response;
  } catch (error) {
    console.error('PUT request error:', error);
    throw error;
  }
};

const deleteRequest = async (url, config = {}) => {
  try {
    const response = await api.delete(url, config);
    return response;
  } catch (error) {
    console.error('DELETE request error:', error);
    throw error;
  }
};

export default api;

