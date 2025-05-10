import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './ManualInStudent.css';
import Navbar from '../../../components/Navbar';

export default function ManualInStudent() {
    const [studentId, setStudentId] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [studentInfo, setStudentInfo] = useState(null);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!studentId.trim()) return;

        setLoading(true);
        setMessage('');
        setStudentInfo(null);

        try {
            // Here you would make an API call to search for the student
            // For now, we'll just simulate a successful response
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Dummy student data
            setStudentInfo({
                id: studentId,
                name: "John Doe",
                regNo: "2021-ME-123",
                hostleName: "Hostel A",
                profileImage: null
            });
        } catch (error) {
            setMessage('Student not found. Please check the ID and try again.');
            console.error('Error searching for student:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAttendance = async () => {
        if (!studentInfo) return;

        setLoading(true);
        setMessage('');

        try {
            // Here you would make an API call to mark the student as present
            await new Promise(resolve => setTimeout(resolve, 1000));

            setMessage(`Attendance marked successfully for ${studentInfo.name}!`);
        } catch (error) {
            setMessage('Failed to mark attendance. Please try again.');
            console.error('Error marking attendance:', error);
        } finally {
            setLoading(false);
        }
    }; return (
        <div className="manual-in-container">
            <Navbar />

            <div className="manual-in-content">
                <div className="manual-in-card">
                    <Link to="/receptionist-dashboard" className="back-button">
                        <span>←</span>
                    </Link>

                    <h1 className="card-title">Manual IN Student</h1>

                    <div className="manual-in-form">
                        <form onSubmit={handleSearch}>
                            <div className="form-group">
                                <label htmlFor="studentId">Enter Student ID/Reg No:</label>
                                <div className="search-input-container">
                                    <input
                                        type="text"
                                        id="studentId"
                                        value={studentId}
                                        onChange={(e) => setStudentId(e.target.value)}
                                        placeholder="e.g., 2021-ME-123"
                                        required
                                        disabled={loading}
                                    />
                                    <button
                                        type="submit"
                                        className="search-button"
                                        disabled={loading || !studentId.trim()}
                                    >
                                        {loading ? 'Searching...' : 'Search'}
                                    </button>
                                </div>
                            </div>
                        </form>

                        {message && (
                            <div className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>
                                {message}
                            </div>
                        )}

                        {studentInfo && (
                            <div className="student-info">
                                <div className="student-profile">
                                    <div className="student-avatar">
                                        {studentInfo.profileImage ? (
                                            <img src={studentInfo.profileImage} alt={studentInfo.name} />
                                        ) : (
                                            <div className="default-avatar">{studentInfo.name.charAt(0)}</div>
                                        )}
                                    </div>
                                    <div className="student-details">
                                        <h3>{studentInfo.name}</h3>
                                        <p><strong>Reg No:</strong> {studentInfo.regNo}</p>
                                        <p><strong>Hostel:</strong> {studentInfo.hostleName}</p>
                                    </div>
                                </div>

                                <button
                                    className="mark-attendance-button"
                                    onClick={handleMarkAttendance}
                                    disabled={loading}
                                >
                                    {loading ? 'Processing...' : 'Mark as Present'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
