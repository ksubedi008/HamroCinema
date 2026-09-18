import React from 'react';
import { Navigate } from 'react-router-dom'; 

const AdminRouteGuard = ({ children }) => { 
  // Check sessionStorage directly to ensure synchronous validation 
  const tokenStr = sessionStorage.getItem('authTokens'); 
  if (!tokenStr) { 
    return <Navigate to="/" replace />; 
  } 
  
  try { 
    const tokens = JSON.parse(tokenStr); 
    if (tokens?.user?.role === 'Admin' || tokens?.user?.role === 'Manager') { 
      return children; 
    } 
  } catch (e) { 
    console.error("Invalid token format in sessionStorage"); 
  } 
  
  return <Navigate to="/" replace />; 
}; 

export default AdminRouteGuard;
