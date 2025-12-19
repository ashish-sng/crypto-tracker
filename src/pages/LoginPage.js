import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * LoginPage Component
 * Serves as the public entry point for user authentication.
 * Integrates Google OAuth authentication and redirects authenticated users to the dashboard.
 */
export default function LoginPage() {
  // Extract the login function from AuthContext
  const { login } = useAuth();

  // Initialize navigation hook for redirecting after successful login
  const navigate = useNavigate();

  /**
   * handleLoginSuccess Function
   * Handles successful Google OAuth authentication.
   * Extracts the JWT token from the credential response and initiates the login process.
   * @param {Object} credentialResponse - The response object from Google OAuth containing the credential token
   */
  const handleLoginSuccess = (credentialResponse) => {
    // Log the credential response for debugging purposes
    console.log(credentialResponse);

    // Extract the JWT token from the credential response
    const token = credentialResponse.credential;

    // Call the login function with the credential token to update authentication state
    login(token);

    // Redirect the user to the dashboard after successful login
    navigate('/');
  };

  /**
   * handleLoginError Function
   * Handles failed Google OAuth authentication.
   * Logs the error and provides feedback to the user.
   */
  const handleLoginError = () => {
    // Log the login failure for debugging purposes
    console.log('Login Failed');
    // This could include a toast notification, modal dialog, or inline error message
  };

  return (
    <div className="login-container">
      <h1 className="login-title">Welcome to Crypto Tracker</h1>
      <p className="login-subtitle">Please sign in to continue</p>
      <GoogleLogin
        onSuccess={handleLoginSuccess}
        onError={handleLoginError}
        useOneTap
      />
    </div>
  );
}
