import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; 

const ProtectedRoute = ({ children, requiredRole = null }) => { 
  const { user } = useContext(AuthContext); 
  
  if (!user) { 
    return <Navigate to="/login" replace />; 
  } 
  
  if (user.role === 'Admin' || user.role === 'Manager' || user.is_staff) { 
    // Strict boundaries: Admins cannot use customer routes
    return <Navigate to="/k-subedi-08/dashboard" replace />; 
  }

  if (requiredRole && user.role !== requiredRole) { 
    return <Navigate to="/" replace />; 
  } 
  return children;
}; 

export default ProtectedRoute;
