import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './StartAttendance.css';
import Navbar from '../../../components/Navbar';

export default function StartAttendance() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleStartAttendance = async () => {
        setLoading(true);
        setMessage('');

        try {
            // Here you would make an API call to start attendance tracking
            // For now, we'll just simulate a successful response
            await new Promise(resolve => setTimeout(resolve, 1000));

            setMessage('Attendance tracking started successfully!');
        } catch (error) {
            setMessage('Failed to start attendance tracking. Please try again.');
            console.error('Error starting attendance:', error);
        } finally {
            setLoading(false);
        }
    }; return (
        <div className="start-attendance-container">
            <Navbar />

            <div className="start-attendance-content">
                <div className="start-attendance-card">
                    <Link to="/receptionist-dashboard" className="back-button">
                        <span>←</span>
                    </Link>

                    <h1 className="card-title">Start Attendance</h1>

                    <div className="start-attendance-form">
                        <p>Click the button below to start attendance tracking for today's meal.</p>

                        <button
                            className={`start-button ${loading ? 'loading' : ''}`}
                            onClick={handleStartAttendance}
                            disabled={loading}
                        >
                            {loading ? 'Starting...' : 'Start Attendance'}
                        </button>

                        {message && (
                            <div className={`message ${message.includes('Failed') ? 'error' : 'success'}`}>
                                {message}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
