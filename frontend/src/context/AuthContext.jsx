import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [authTokens, setAuthTokens] = useState(() => localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const loginUser = async (username, password) => {
        try {
            const response = await axios.post('http://localhost:8000/api/auth/login/', {
                username,
                password
            });
            if (response.status === 200) {
                setAuthTokens(response.data);
                setUser(response.data.user);
                localStorage.setItem('authTokens', JSON.stringify(response.data));
                
                // Set default axios header
                axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
                
                if (response.data.user.role === 'Admin' || response.data.user.role === 'Manager') {
                    navigate('/admin/dashboard');
                } else {
                    navigate('/');
                }
                return { success: true };
            }
        } catch (error) {
            return { success: false, error: error.response?.data?.detail || "Login failed" };
        }
    };

    const logoutUser = () => {
        setAuthTokens(null);
        setUser(null);
        localStorage.removeItem('authTokens');
        delete axios.defaults.headers.common['Authorization'];
        navigate('/login');
    };

    const updateToken = async () => {
        if (!authTokens?.refresh) {
            setLoading(false);
            return;
        }
        try {
            const response = await axios.post('http://localhost:8000/api/auth/refresh/', {
                refresh: authTokens.refresh
            });
            if (response.status === 200) {
                const newTokens = { ...authTokens, access: response.data.access };
                setAuthTokens(newTokens);
                localStorage.setItem('authTokens', JSON.stringify(newTokens));
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

    // Set initial user if tokens exist and we haven't loaded yet
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
            
            // Also update the tokens in local storage so refresh persists it
            if (authTokens) {
                const updatedTokens = { ...authTokens, user: updatedUser };
                setAuthTokens(updatedTokens);
                localStorage.setItem('authTokens', JSON.stringify(updatedTokens));
            }
        }
    };

    const contextData = {
        user,
        authTokens,
        loginUser,
        logoutUser,
        updateUserPoints
    };

    return (
        <AuthContext.Provider value={contextData}>
            {loading ? null : children}
        </AuthContext.Provider>
    );
};
