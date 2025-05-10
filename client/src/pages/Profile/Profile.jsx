import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Navbar from '../../components/Navbar';
import './Profile.css';

const Profile = () => {
    const { currentUser } = useAuth();

    if (!currentUser) {
        return <div>Loading profile...</div>;
    }

    return (
        <div className="profile-container">
            <Navbar />
            <div className="profile-content">
                <div className="profile-header">
                    <div className="profile-avatar">
                        {currentUser.fname?.charAt(0)}{currentUser.lname?.charAt(0)}
                    </div>
                    <h1>User Profile</h1>
                </div>

                <div className="profile-details">
                    <div className="profile-card">
                        <h2>Personal Information</h2>
                        <div className="profile-info">
                            <p><strong>Name:</strong> {currentUser.fname} {currentUser.lname}</p>
                            <p><strong>Email:</strong> {currentUser.email}</p>
                            <p><strong>Role:</strong> <span className="role-badge">{currentUser.role}</span></p>
                        </div>
                    </div>

                    {currentUser.role === 'receptionist' && (
                        <div className="profile-card">
                            <h2>Receptionist Permissions</h2>
                            <ul className="permissions-list">
                                <li>Start attendance sessions</li>
                                <li>Manually mark students as present</li>
                                <li>View all attendance records</li>
                                <li>Search student attendance history</li>
                                <li>Generate attendance reports</li>
                            </ul>
                        </div>
                    )}

                    {currentUser.role === 'student' && (
                        <div className="profile-card">
                            <h2>My Mess Information</h2>
                            <div className="profile-info">
                                <p><strong>Current Mess Status:</strong> <span className="status-badge">Active</span></p>
                                <p><strong>Attendance This Month:</strong> 22 days</p>
                                <p><strong>Current Bill:</strong> PKR 5,000</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
