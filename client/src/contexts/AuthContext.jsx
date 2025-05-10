import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the authentication context
const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Load user from localStorage on component mount
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const user = JSON.parse(storedUser);
                setCurrentUser(user);
            } catch (error) {
                console.error('Error parsing user from localStorage:', error);
                localStorage.removeItem('user'); // Remove invalid data
            }
        }
        setLoading(false);
    }, []);

    // Login function
    const login = (userData) => {
        localStorage.setItem('user', JSON.stringify(userData));
        setCurrentUser(userData);
    };

    // Logout function
    const logout = () => {
        localStorage.removeItem('user');
        setCurrentUser(null);
    };

    // Check if user has a specific role
    const hasRole = (role) => {
        return currentUser && currentUser.role === role;
    };    // Update user profile function
    // This was previously used for CompleteProfile feature which has been removed
    // Keeping for potential future use
    const updateUserProfile = (profileData) => {
        if (currentUser) {
            const updatedUser = { ...currentUser, ...profileData };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setCurrentUser(updatedUser);
        }
    };

    const value = {
        currentUser,
        login,
        logout,
        hasRole,
        updateUserProfile,
        isStudent: currentUser?.role === 'student',
        isReceptionist: currentUser?.role === 'receptionist',
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
