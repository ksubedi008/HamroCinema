import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authTokens, setAuthTokens] = useState(() => 
    sessionStorage.getItem('authTokens') ? JSON.parse(sessionStorage.getItem('authTokens')) : null
  );
  
  // FIX: Initialize user synchronously from sessionStorage to prevent ProtectedRoute from kicking the user to /login on first render
  const [user, setUser] = useState(() => 
    sessionStorage.getItem('authTokens') ? JSON.parse(sessionStorage.getItem('authTokens')).user : null
  );
  
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loginUser = async (username, password) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/login/`, {
        username,
        password
      });
      if (response.status === 200) {
        setAuthTokens(response.data);
        setUser(response.data.user);
        sessionStorage.setItem('authTokens', JSON.stringify(response.data));
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
        return { success: true, user: response.data.user };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.detail || error.response?.data?.non_field_errors?.[0] || 'Invalid username or password.';
      return { success: false, error: errorMessage };
    }
  };

  const logoutUser = () => {
    setAuthTokens(null);
    setUser(null);
    sessionStorage.removeItem('authTokens');
    delete axios.defaults.headers.common['Authorization'];
    navigate('/login');
  };

  const updateToken = async () => {
    if (!authTokens?.refresh) {
      setLoading(false);
      return;
    }
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/refresh/`, {
        refresh: authTokens.refresh
      });
      if (response.status === 200) {
        const newTokens = { ...authTokens, access: response.data.access };
        setAuthTokens(newTokens);
        sessionStorage.setItem('authTokens', JSON.stringify(newTokens));
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
      } else {
        logoutUser();
      }
    } catch (error) {
      logoutUser();
    }
    
    if (loading) {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (loading) {
      updateToken();
    }
  }, [loading]);

  useEffect(() => {
    const fourMinutes = 1000 * 60 * 4;
    const interval = setInterval(() => {
      if (authTokens) {
        updateToken();
      }
    }, fourMinutes);
    return () => clearInterval(interval);
  }, [authTokens]);

  useEffect(() => {
    if (authTokens?.user && !user) {
      setUser(authTokens.user);
      axios.defaults.headers.common['Authorization'] = `Bearer ${authTokens.access}`;
    }
  }, [authTokens, user]);

  const updateUserPoints = (newPoints) => {
    if (user) {
      const updatedUser = { ...user, loyalty_points: newPoints };
      setUser(updatedUser);
      if (authTokens) {
        const updatedTokens = { ...authTokens, user: updatedUser };
        setAuthTokens(updatedTokens);
        sessionStorage.setItem('authTokens', JSON.stringify(updatedTokens));
      }
    }
  };

  const updateUserProfile = (newProfileData) => {
    if (user) {
      const updatedUser = { ...user, ...newProfileData };
      setUser(updatedUser);
      if (authTokens) {
        const updatedTokens = { ...authTokens, user: updatedUser };
        setAuthTokens(updatedTokens);
        sessionStorage.setItem('authTokens', JSON.stringify(updatedTokens));
      }
    }
  };

  const fetchCurrentUser = async () => {
    if (authTokens) {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/users/me/`, {
          headers: { Authorization: `Bearer ${authTokens.access}` }
        });
        updateUserProfile(response.data);
      } catch (error) {
        console.error("Failed to fetch current user profile", error);
      }
    }
  };

  const contextData = {
    user,
    authTokens,
    loginUser,
    logoutUser,
    updateUserPoints,
    updateUserProfile,
    fetchCurrentUser
  };

  return (
    <AuthContext.Provider value={contextData}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
};
