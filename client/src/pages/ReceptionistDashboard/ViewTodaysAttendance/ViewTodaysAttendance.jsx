import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './ViewTodaysAttendance.css';
import Navbar from '../../../components/Navbar';

export default function ViewTodaysAttendance() {
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [mealType, setMealType] = useState('all');
    const [summary, setSummary] = useState({
        total: 0,
        present: 0,
        absent: 0,
        percentage: 0
    });

    // Mock data for demonstration
    const mockAttendanceData = [
        { id: 1, studentId: '2021-ME-101', name: 'John Doe', regNo: '2021-ME-101', hostel: 'Hostel A', status: true },
        { id: 2, studentId: '2021-ME-102', name: 'Jane Smith', regNo: '2021-ME-102', hostel: 'Hostel B', status: true },
        { id: 3, studentId: '2021-ME-103', name: 'Bob Johnson', regNo: '2021-ME-103', hostel: 'Hostel C', status: false },
        { id: 4, studentId: '2021-ME-104', name: 'Alice Brown', regNo: '2021-ME-104', hostel: 'Hostel A', status: true },
        { id: 5, studentId: '2021-ME-105', name: 'Charlie Davis', regNo: '2021-ME-105', hostel: 'Hostel B', status: false }
    ];

    useEffect(() => {
        fetchAttendanceData();
    }, [mealType]);

    const fetchAttendanceData = async () => {
        setLoading(true);
        setError(null);

        try {
            // Here you would make an API call to fetch attendance data
            // For now, we'll just use the mock data
            await new Promise(resolve => setTimeout(resolve, 1000));

            const filteredData = mealType === 'all'
                ? mockAttendanceData
                : mockAttendanceData.filter((_, index) => index % 2 === 0); // Just for simulation

            setAttendanceRecords(filteredData);

            // Calculate summary
            const total = filteredData.length;
            const present = filteredData.filter(record => record.status).length;
            const absent = total - present;
            const percentage = total > 0 ? Math.round((present / total) * 100) : 0;

            setSummary({
                total,
                present,
                absent,
                percentage
            });
        } catch (err) {
            console.error('Error fetching attendance records:', err);
            setError('Failed to load attendance records. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleMealTypeChange = (e) => {
        setMealType(e.target.value);
    };

    const handleStatusToggle = (id) => {
        setAttendanceRecords(prevRecords =>
            prevRecords.map(record =>
                record.id === id
                    ? { ...record, status: !record.status }
                    : record
            )
        );

        // Recalculate summary
        const updatedRecords = attendanceRecords.map(record =>
            record.id === id ? { ...record, status: !record.status } : record
        );

        const total = updatedRecords.length;
        const present = updatedRecords.filter(record => record.status).length;
        const absent = total - present;
        const percentage = total > 0 ? Math.round((present / total) * 100) : 0;

        setSummary({
            total,
            present,
            absent,
            percentage
        });
    };

    const handleExport = () => {
        alert('Export functionality would be implemented here');
        // In a real implementation, this would generate a CSV or PDF with attendance data
    }; return (
        <div className="todays-attendance-container">
            <Navbar />

            <div className="todays-attendance-content">
                <div className="todays-attendance-card">
                    <Link to="/receptionist-dashboard" className="back-button">
                        <span>←</span>
                    </Link>

                    <h1 className="card-title">Today's Attendance</h1>

                    <div className="attendance-controls">
                        <div className="meal-selector">
                            <label htmlFor="mealType">Meal:</label>
                            <select
                                id="mealType"
                                value={mealType}
                                onChange={handleMealTypeChange}
                                disabled={loading}
                            >
                                <option value="all">All Meals</option>
                                <option value="breakfast">Breakfast</option>
                                <option value="lunch">Lunch</option>
                                <option value="dinner">Dinner</option>
                            </select>
                        </div>

                        <button
                            className="export-button"
                            onClick={handleExport}
                            disabled={loading || attendanceRecords.length === 0}
                        >
                            Export Data
                        </button>
                    </div>

                    <div className="attendance-summary">
                        <div className="summary-box total">
                            <span className="summary-value">{summary.total}</span>
                            <span className="summary-label">Total</span>
                        </div>
                        <div className="summary-box present">
                            <span className="summary-value">{summary.present}</span>
                            <span className="summary-label">Present</span>
                        </div>
                        <div className="summary-box absent">
                            <span className="summary-value">{summary.absent}</span>
                            <span className="summary-label">Absent</span>
                        </div>
                        <div className="summary-box percentage">
                            <span className="summary-value">{summary.percentage}%</span>
                            <span className="summary-label">Attendance</span>
                        </div>
                    </div>

                    {loading ? (
                        <div className="loading-indicator">Loading attendance records...</div>
                    ) : error ? (
                        <div className="error-message">{error}</div>
                    ) : attendanceRecords.length === 0 ? (
                        <div className="no-records">No attendance records found for today.</div>
                    ) : (
                        <div className="attendance-table-container">
                            <table className="attendance-table">
                                <thead>
                                    <tr>
                                        <th>Reg No</th>
                                        <th>Name</th>
                                        <th>Hostel</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {attendanceRecords.map(record => (
                                        <tr key={record.id} className={record.status ? 'present-row' : 'absent-row'}>
                                            <td>{record.regNo}</td>
                                            <td>{record.name}</td>
                                            <td>{record.hostel}</td>
                                            <td>
                                                <span className={`status-badge ${record.status ? 'present' : 'absent'}`}>
                                                    {record.status ? 'Present' : 'Absent'}
                                                </span>
                                            </td>
                                            <td>
                                                <button
                                                    className={`toggle-button ${record.status ? 'mark-absent' : 'mark-present'}`}
                                                    onClick={() => handleStatusToggle(record.id)}
                                                >
                                                    {record.status ? 'Mark Absent' : 'Mark Present'}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
