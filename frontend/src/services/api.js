import env from '../config/env';

const API_URL = env.API_BASE_URL;

// Debug logging
if (import.meta.env.DEV) {
  console.log('API URL:', API_URL);
}

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw {
      status: response.status,
      message: error.message || 'Something went wrong',
      data: error
    };
  }
  return response.json();
};

const getHeaders = () => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  // Debug logging
  if (import.meta.env.DEV) {
    console.log('Request headers:', headers);
  }

  return headers;
};

const api = {
  defaults: {
    headers: {
      common: {}
    }
  },

  get: async (endpoint) => {
    const url = `${API_URL}${endpoint}`;
    if (import.meta.env.DEV) {
      console.log('GET Request:', url);
    }

    try {
      const response = await fetch(url, {
        method: 'GET',
        credentials: 'include',
        headers: getHeaders(),
        mode: 'cors',
        cache: 'no-cache',
      });
      return handleResponse(response);
    } catch (error) {
      if (env.ENABLE_LOGGING) {
        console.error('API Error:', error);
        console.error('Request URL:', url);
      }
      throw error;
    }
  },

  post: async (endpoint, data) => {
    const url = `${API_URL}${endpoint}`;
    if (import.meta.env.DEV) {
      console.log('POST Request:', url);
      console.log('Request data:', data);
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        credentials: 'include',
        headers: getHeaders(),
        body: JSON.stringify(data),
        mode: 'cors',
        cache: 'no-cache',
      });
      return handleResponse(response);
    } catch (error) {
      if (env.ENABLE_LOGGING) {
        console.error('API Error:', error);
        console.error('Request URL:', url);
        console.error('Request data:', data);
      }
      throw error;
    }
  },

  put: async (endpoint, data) => {
    const url = `${API_URL}${endpoint}`;
    if (import.meta.env.DEV) {
      console.log('PUT Request:', url);
      console.log('Request data:', data);
    }

    try {
      const response = await fetch(url, {
        method: 'PUT',
        credentials: 'include',
        headers: getHeaders(),
        body: JSON.stringify(data),
        mode: 'cors',
        cache: 'no-cache',
      });
      return handleResponse(response);
    } catch (error) {
      if (env.ENABLE_LOGGING) {
        console.error('API Error:', error);
        console.error('Request URL:', url);
        console.error('Request data:', data);
      }
      throw error;
    }
  },

  delete: async (endpoint) => {
    const url = `${API_URL}${endpoint}`;
    if (import.meta.env.DEV) {
      console.log('DELETE Request:', url);
    }

    try {
      const response = await fetch(url, {
        method: 'DELETE',
        credentials: 'include',
        headers: getHeaders(),
        body: JSON.stringify({}),
        mode: 'cors',
        cache: 'no-cache',
      });
      return handleResponse(response);
    } catch (error) {
      if (env.ENABLE_LOGGING) {
        console.error('API Error:', error);
        console.error('Request URL:', url);
      }
      throw error;
    }
  },
};

export default api;

