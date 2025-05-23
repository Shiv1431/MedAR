import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://medarbackend.vercel.app/api';

const apiService = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiService.interceptors.request.use(
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
apiService.interceptors.response.use(
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
export const login = async (credentials) => {
  try {
    // Format the request data according to backend expectations
    const requestData = {
      Email: credentials.email,
      Password: credentials.password,
      UserType: credentials.userType
    };

    console.log('Login request data:', requestData); // Debug log

    // Use the correct endpoint based on user type
    const endpoint = credentials.userType === 'student' ? '/student/login' : '/teacher/login';
    const response = await apiService.post(endpoint, requestData);
    console.log('Login response:', response); // Debug log
    return response;
  } catch (error) {
    console.error('Login error details:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    throw error;
  }
};

export const signup = async (userData) => {
  try {
    const response = await apiService.post('/student/signup', userData);
    return response;
  } catch (error) {
    console.error('Signup error:', error);
    throw error;
  }
};

export const logout = async () => {
  try {
    const response = await apiService.post('/student/logout');
    return response;
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

// Profile methods
export const getProfile = async () => {
  try {
    const response = await apiService.get('/student/profile');
    return response;
  } catch (error) {
    console.error('Get profile error:', error);
    throw error;
  }
};

export const updateProfile = async (profileData) => {
  try {
    const response = await apiService.put('/student/profile', profileData);
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
    
    const response = await apiService.post('/student/profile/image', formData, {
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
    const response = await apiService.get(url, config);
    return response;
  } catch (error) {
    console.error('GET request error:', error);
    throw error;
  }
};

const post = async (url, data, config = {}) => {
  try {
    const response = await apiService.post(url, data, config);
    return response;
  } catch (error) {
    console.error('POST request error:', error);
    throw error;
  }
};

const put = async (url, data, config = {}) => {
  try {
    const response = await apiService.put(url, data, config);
    return response;
  } catch (error) {
    console.error('PUT request error:', error);
    throw error;
  }
};

const deleteRequest = async (url, config = {}) => {
  try {
    const response = await apiService.delete(url, config);
    return response;
  } catch (error) {
    console.error('DELETE request error:', error);
    throw error;
  }
};

export default apiService;

