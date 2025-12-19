import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * ProtectedRoute Component
 * Acts as a gatekeeper for authenticated routes.
 * Checks the authentication status from AuthContext and redirects unauthenticated users to the login page.
 * Uses React Router's Outlet pattern to render protected child routes only when the user is authenticated.
 */
export default function ProtectedRoute() {
  // Extract authentication status from the AuthContext
  const { isAuthenticated } = useAuth();

  // If user is not authenticated, redirect to login page
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If user is authenticated, render the nested child routes
  return <Outlet />;
}
