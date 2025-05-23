import env from '../config/env';

const API_URL = env.API_BASE_URL;

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Something went wrong');
  }
  return response.json();
};

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const api = {
  get: async (endpoint) => {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'GET',
        credentials: 'include',
        headers: getHeaders(),
        mode: 'cors',
      });
      return handleResponse(response);
    } catch (error) {
      if (env.ENABLE_LOGGING) {
        console.error('API Error:', error);
      }
      throw error;
    }
  },

  post: async (endpoint, data) => {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        credentials: 'include',
        headers: getHeaders(),
        body: JSON.stringify(data),
        mode: 'cors',
      });
      return handleResponse(response);
    } catch (error) {
      if (env.ENABLE_LOGGING) {
        console.error('API Error:', error);
      }
      throw error;
    }
  },

  put: async (endpoint, data) => {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'PUT',
        credentials: 'include',
        headers: getHeaders(),
        body: JSON.stringify(data),
        mode: 'cors',
      });
      return handleResponse(response);
    } catch (error) {
      if (env.ENABLE_LOGGING) {
        console.error('API Error:', error);
      }
      throw error;
    }
  },

  delete: async (endpoint) => {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: getHeaders(),
        mode: 'cors',
      });
      return handleResponse(response);
    } catch (error) {
      if (env.ENABLE_LOGGING) {
        console.error('API Error:', error);
      }
      throw error;
    }
  },
};

