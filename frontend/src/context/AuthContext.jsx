"use client"

import { createContext, useContext, useState, useEffect } from "react"
import api from "../services/api"

const AuthContext = createContext(null)

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user')
      return savedUser ? JSON.parse(savedUser) : null
    } catch (error) {
      console.error('Error parsing user data:', error)
      return null
    }
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const token = localStorage.getItem("token")
        if (token) {
          api.defaults.headers.common["Authorization"] = `Bearer ${token}`
          // Try to get user data from localStorage first
          const savedUser = localStorage.getItem('user')
          if (savedUser) {
            const userData = JSON.parse(savedUser)
            setUser(userData)
            setLoading(false)
            return
          }
          
          // If no saved user, try to fetch from API
          try {
            const response = await api.get(`/student/profile`)
            if (response && response.data) {
              const userData = response.data
              setUser(userData)
              localStorage.setItem('user', JSON.stringify(userData))
            }
          } catch (error) {
            console.error("Error fetching user data:", error)
            // Don't clear user data if API call fails
            // This prevents logout on temporary API issues
          }
        }
      } catch (error) {
        console.error("Authentication error:", error)
        // Only clear data if token is invalid
        if (error.status === 401) {
          localStorage.removeItem("token")
          localStorage.removeItem("user")
          setUser(null)
        }
      } finally {
        setLoading(false)
      }
    }

    checkLoggedIn()
  }, [])

  const login = async (email, password, userType) => {
    try {
      // Validate input
      if (!email || !password || !userType) {
        throw new Error("Please fill in all required fields")
      }

      // Format the request data to match backend expectations
      const requestData = {
        email: email.trim(),
        password: password.trim()
      }

      // Make API request
      const response = await api.post(`/${userType}/login`, requestData)

      // Log the full response for debugging
      console.log('Login response:', response)

      if (!response || !response.success) {
        throw new Error(response?.message || "Login failed")
      }

      // Extract user data and tokens from the response
      const { data } = response
      if (!data || !data.user) {
        throw new Error("Invalid response format: missing user data")
      }

      // Get the token from the response
      const token = data.token || data.Token || response.token || response.Token
      
      if (!token) {
        console.error('No token found in response:', response)
        throw new Error("No authentication token received")
      }

      // Create complete user data object with role
      const userData = {
        ...data.user,
        role: userType,
        _id: data.user._id || data.user.id || data.user.userId || data.user.user_id
      }
      
      // Ensure we have an ID
      if (!userData._id) {
        console.error('User data missing ID:', userData)
        throw new Error("User data is incomplete: missing ID")
      }

      // Store token and user data in localStorage
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(userData))
      
      // Set default auth header for future requests
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`
      
      // Update user state
      setUser(userData)
      
      return userData
    } catch (error) {
      console.error("Login error:", error)
      if (error.status === 404) {
        throw new Error("Invalid email or password")
      } else if (error.status === 401) {
        throw new Error("Invalid credentials")
      } else if (error.status === 422) {
        throw new Error("Please check your input")
      }
      throw new Error(error.message || "Login failed")
    }
  }

  const register = async (userData) => {
    try {
      const response = await api.post("/register", userData)
      if (!response || !response.success) {
        throw new Error(response?.message || "Registration failed")
      }

      const { data } = response
      if (!data || !data.user || !data.token) {
        throw new Error("Invalid response format: missing user data or token")
      }

      localStorage.setItem("token", data.token)
      localStorage.setItem("user", JSON.stringify(data.user))
      api.defaults.headers.common["Authorization"] = `Bearer ${data.token}`
      setUser(data.user)
      return data.user
    } catch (error) {
      console.error("Registration error:", error)
      if (error.status === 422) {
        throw new Error("Please check your input")
      }
      throw new Error(error.message || "Registration failed")
    }
  }

  const logout = async () => {
    try {
      // Try to call the backend logout endpoint if there's a token
      const token = localStorage.getItem('token');
      if (token) {
        try {
          await api.post('/logout');
        } catch (err) {
          console.error('Error during logout API call:', err);
          // Continue with client-side logout even if API call fails
        }
      }
      
      // Clear local storage and state
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      
      // Clear auth header
      delete api.defaults.headers.common["Authorization"];
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local data even if there's an error
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
    }
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

