import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from 'react';

// Create the AuthContext with null as default value
const AuthContext = createContext(null);

/**
 * AuthProvider Component
 * Manages global authentication state and provides authentication methods to child components.
 * Persists session state in localStorage for session continuity across page reloads.
 */
export function AuthProvider({ children }) {
  // State to store the authenticated user object
  const [user, setUser] = useState(null);

  /**
   * useEffect Hook for Session Persistence
   * Runs only on component mount to restore user session from localStorage
   */
  useEffect(() => {
    // Retrieve the authToken from localStorage
    const authToken = localStorage.getItem('authToken');

    // If a token exists, restore the user state
    if (authToken) {
      setUser({ token: authToken });
    }
  }, []);

  /**
   * Login Function
   * Stores the authentication token in localStorage and updates user state
   * @param {string} token - The authentication token to store
   */
  const login = (token) => {
    localStorage.setItem('authToken', token);
    setUser({ token });
  };

  /**
   * Logout Function
   * Removes the authentication token from localStorage and resets user state
   */
  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
  };

  // Derived value: true if user is authenticated, false otherwise
  const isAuthenticated = Boolean(user);

  // Context value object containing authentication state and methods
  const memoValue = useMemo(
    () => ({
      isAuthenticated,
      user,
      login,
      logout,
    }),
    [isAuthenticated, user]
  );

  return (
    <AuthContext.Provider value={memoValue}>{children}</AuthContext.Provider>
  );
}

/**
 * useAuth Hook
 * Custom hook to access the authentication context from any component
 * @returns {Object} The authentication context value containing isAuthenticated, user, login, and logout
 */
export function useAuth() {
  return useContext(AuthContext);
}
