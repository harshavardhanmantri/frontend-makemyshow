import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import LoadingSpinner from './LoadingSpinner.jsx';

const ProtectedRoute = ({ 
  requiredRole = null, 
  redirectPath = '/login'
}) => {
  const { isAuthenticated, hasRole, loading } = useAuth();

  // Show loading spinner while checking authentication
  if (loading) {
    return <LoadingSpinner />;
  }

  // Check if user is authenticated
  if (!isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  // If a specific role is required, check if the user has it
  if (requiredRole && !hasRole(requiredRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // If the user is authenticated and has the required role (if any), render the child routes
  return <Outlet />;
};

export default ProtectedRoute;