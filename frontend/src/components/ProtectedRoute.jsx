import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children, requiredRole = null }) => {
    const { user } = useContext(AuthContext);

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (requiredRole && user.role !== requiredRole && user.role !== 'Admin') {
        // If an Admin tries to access something, usually they have access to everything. 
        // Otherwise, kick them to home if they don't have the specific role.
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
