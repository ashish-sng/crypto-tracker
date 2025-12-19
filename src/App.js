import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from './components/auth/ProtectedRoute';

/**
 * App Component
 * Serves as the main router and layout component for the application.
 * Implements the routing structure using React Router's Routes and Route components.
 * Defines public /login route and protected / route using ProtectedRoute.
 */
function App() {
  return (
    <div className="coin-app">
      <Routes>
        {/* Public login route */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected routes using ProtectedRoute as a layout route */}
        <Route element={<ProtectedRoute />}>
          {/* Dashboard route - accessible only to authenticated users */}
          <Route path="/" element={<DashboardPage />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
