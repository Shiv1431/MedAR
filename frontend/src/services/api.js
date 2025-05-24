import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://medarbackend.vercel.app/api';

console.log('API Base URL:', API_BASE_URL);

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    console.log('Request interceptor - Token exists:', !!token);
    console.log('Request URL:', config.url);
    
    if (token) {
      // Ensure token is properly formatted
      const formattedToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
      config.headers.Authorization = formattedToken;
      console.log('Authorization header set:', config.headers.Authorization);
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('Response interceptor - Success:', response.config.url);
    return response;
  },
  (error) => {
    console.error('Response interceptor - Error:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      headers: error.config?.headers
    });
    
    if (error.response?.status === 401) {
      console.log('401 Unauthorized - Clearing auth data');
      localStorage.removeItem('token');
      localStorage.removeItem('userType');
      localStorage.removeItem('userId');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth methods
export const login = async (email, password, userType) => {
  try {
    console.log('Making login request:', {
      url: `/${userType}/login`,
      email,
      userType
    });

    const response = await api.post(`/${userType}/login`, {
      Email: email,
      Password: password
    });

    console.log('Login response:', {
      success: response.data.success,
      hasToken: !!response.data.data?.token,
      hasUser: !!response.data.data?.user
    });
    
    if (response.data.success) {
      const token = response.data.data.token;
      console.log('Token received:', token ? 'Token exists' : 'No token');
      
      if (!token) {
        throw new Error('No token received in login response');
      }

      // Store token without 'Bearer ' prefix
      const cleanToken = token.replace('Bearer ', '');
      localStorage.setItem('token', cleanToken);

      return {
        success: true,
        data: {
          token: cleanToken,
          user: response.data.data.user
        }
      };
    } else {
      return {
        success: false,
        message: response.data.message || 'Login failed'
      };
    }
  } catch (error) {
    console.error('Login error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    return {
      success: false,
      message: error.response?.data?.message || 'Login failed. Please try again.'
    };
  }
};

export const signup = async (userData, userType) => {
  try {
    const response = await api.post(`/${userType}/signup`, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const logout = async (userType) => {
  try {
    const response = await api.post(`/${userType}/logout`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const verifyToken = async (userType) => {
  try {
    const token = localStorage.getItem('token');
    console.log('Verifying token:', {
      userType,
      hasToken: !!token,
      tokenLength: token?.length
    });
    
    if (!token) {
      throw new Error('No token found in localStorage');
    }

    // Ensure we're using the correct endpoint and token format
    const response = await api.get(`/${userType}/verify-token`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('Verify token response:', {
      success: response.data.success,
      hasData: !!response.data.data
    });
    
    if (response.data.success) {
      return {
        success: true,
        data: response.data.data
      };
    } else {
      throw new Error(response.data.message || 'Token verification failed');
    }
  } catch (error) {
    console.error('Token verification error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      headers: error.config?.headers
    });
    
    // Clear invalid token
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    localStorage.removeItem('userId');
    localStorage.removeItem('user');
    
    return {
      success: false,
      message: error.response?.data?.message || 'Token verification failed'
    };
  }
};

// Profile methods
export const getProfile = async (userType, userId) => {
  try {
    const response = await api.get(`/${userType}/profile/${userId}`);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Get profile error:', error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch profile'
    };
  }
};

export const updateProfile = async (userType, userId, data) => {
  try {
    const response = await api.put(`/${userType}/profile/${userId}`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
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

export const getCourses = async (userType, userId) => {
  try {
    const response = await api.get(`/${userType}/courses/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getClassMentor = async (userId) => {
  try {
    const response = await api.get(`/student/class-mentor/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export default api;

