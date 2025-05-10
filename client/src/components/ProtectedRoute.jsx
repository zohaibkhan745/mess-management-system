import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * ProtectedRoute component to restrict access to pages based on user authentication and role
 * 
 * @param {Object} props - Component props
 * @param {JSX.Element} props.children - The child component to render if user is authenticated
 * @param {string} props.requiredRole - The role required to access this route (optional)
 * @returns {JSX.Element} The protected component or redirect to login
 */
const ProtectedRoute = ({ children, requiredRole }) => {
    const { currentUser } = useAuth();

    // If user is not logged in, redirect to sign in page
    if (!currentUser) {
        return <Navigate to="/signin" />;
    }

    // If a specific role is required and the user doesn't have it, redirect to the appropriate dashboard
    if (requiredRole && currentUser.role !== requiredRole) {
        // Redirect students trying to access receptionist pages to student dashboard
        if (requiredRole === 'receptionist' && currentUser.role === 'student') {
            return <Navigate to="/dashboard" />;
        }

        // Redirect receptionists trying to access student pages to receptionist dashboard
        if (requiredRole === 'student' && currentUser.role === 'receptionist') {
            return <Navigate to="/receptionist-dashboard" />;
        }
    }

    // If all checks pass, render the protected component
    return children;
};

export default ProtectedRoute;
