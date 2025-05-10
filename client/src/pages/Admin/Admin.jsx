import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Admin.css';

export default function Admin() {
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        date: '',
        mealType: '',
        studentName: ''
    });
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user is admin
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || user.id !== 1) {  // Assuming admin has ID 1 for simplicity
            navigate('/signin');
            return;
        }

        setUserData(user);
        fetchAttendanceData();
    }, [navigate]);

    const fetchAttendanceData = async () => {
        try {
            setLoading(true);
            const user = JSON.parse(localStorage.getItem('user'));

            if (!user) {
                setError('User not authenticated');
                setLoading(false);
                return;
            }

            // Construct the URL with query parameters
            let url = 'http://localhost:4000/attendance';
            const queryParams = [];

            if (filters.date) queryParams.push(`date=${filters.date}`);
            if (filters.mealType) queryParams.push(`mealType=${filters.mealType}`);
            if (filters.studentName) queryParams.push(`studentName=${encodeURIComponent(filters.studentName)}`);

            if (queryParams.length > 0) {
                url += `?${queryParams.join('&')}`;
            }

            const response = await fetch(url, {
                headers: {
                    'user-id': user.id
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch attendance records');
            }

            const data = await response.json();
            setAttendanceRecords(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const applyFilters = (e) => {
        e.preventDefault();
        fetchAttendanceData();
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const handleToggleStatus = async (id, currentStatus) => {
        try {
            const response = await fetch(`http://localhost:4000/attendance/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'user-id': userData.id
                },
                body: JSON.stringify({
                    status: !currentStatus
                })
            });

            if (!response.ok) {
                throw new Error('Failed to update status');
            }

            // Update local state
            setAttendanceRecords(prev =>
                prev.map(record =>
                    record.id === id
                        ? { ...record, status: !currentStatus }
                        : record
                )
            );
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDeleteRecord = async (id) => {
        if (!window.confirm('Are you sure you want to delete this record?')) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:4000/attendance/${id}`, {
                method: 'DELETE',
                headers: {
                    'user-id': userData.id
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete record');
            }

            // Remove from local state
            setAttendanceRecords(prev =>
                prev.filter(record => record.id !== id)
            );
        } catch (err) {
            setError(err.message);
        }
    };

    const exportToCSV = () => {
        if (attendanceRecords.length === 0) {
            alert('No data to export');
            return;
        }

        // Create CSV header
        const headers = ['ID', 'Student Name', 'Email', 'Date', 'Meal Type', 'Status'];

        // Create CSV rows
        const rows = attendanceRecords.map(record => [
            record.id,
            `${record.fname} ${record.lname}`,
            record.email,
            record.date,
            record.meal_type,
            record.status ? 'IN' : 'OUT'
        ]);

        // Combine header and rows
        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n');

        // Create a blob and download link
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('hidden', '');
        a.setAttribute('href', url);
        a.setAttribute('download', `attendance_export_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    return (
        <div className="admin-container">
            <header className="admin-header">
                <div className="logo">
                    <img src={process.env.PUBLIC_URL + '/assets/logo-pic.png'} alt="Logo" className="logo-img" />
                    <span>Giki Mess Management System - Admin</span>
                </div>
                <nav className="admin-nav">
                    <ul>
                        <li><Link to="/dashboard">Dashboard</Link></li>
                        <li><a href="#users">Users</a></li>
                        <li><a href="#reports">Reports</a></li>
                    </ul>
                </nav>
                <div className="profile-icon">
                    <div className="avatar">A</div>
                </div>
            </header>

            <div className="admin-content">
                <div className="admin-card">
                    <h1 className="card-title">Attendance Management</h1>

                    <div className="filter-form">
                        <form onSubmit={applyFilters}>
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="date">Date</label>
                                    <input
                                        type="date"
                                        id="date"
                                        name="date"
                                        value={filters.date}
                                        onChange={handleFilterChange}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="mealType">Meal Type</label>
                                    <select
                                        id="mealType"
                                        name="mealType"
                                        value={filters.mealType}
                                        onChange={handleFilterChange}
                                    >
                                        <option value="">All Meals</option>
                                        <option value="breakfast">Breakfast</option>
                                        <option value="lunch">Lunch</option>
                                        <option value="dinner">Dinner</option>
                                        <option value="all">Full Day</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="studentName">Student Name</label>
                                    <input
                                        type="text"
                                        id="studentName"
                                        name="studentName"
                                        placeholder="Search by name..."
                                        value={filters.studentName}
                                        onChange={handleFilterChange}
                                    />
                                </div>

                                <div className="form-group">
                                    <button type="submit" className="filter-button">
                                        Apply Filters
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>

                    <div className="admin-actions">
                        <button className="action-button export-button" onClick={exportToCSV}>
                            Export to CSV
                        </button>
                    </div>

                    {loading ? (
                        <div className="loading">Loading attendance records...</div>
                    ) : error ? (
                        <div className="error">{error}</div>
                    ) : (
                        <div className="attendance-table-container">
                            {attendanceRecords.length === 0 ? (
                                <p className="no-records">No attendance records found.</p>
                            ) : (
                                <table className="attendance-table">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Student</th>
                                            <th>Date</th>
                                            <th>Meal</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {attendanceRecords.map(record => (
                                            <tr key={record.id} className={record.status ? 'status-in' : 'status-out'}>
                                                <td>{record.id}</td>
                                                <td>{record.fname} {record.lname}</td>
                                                <td>{formatDate(record.date)}</td>
                                                <td>{record.meal_type.charAt(0).toUpperCase() + record.meal_type.slice(1)}</td>
                                                <td>
                                                    <span className={`status-badge ${record.status ? 'in' : 'out'}`}>
                                                        {record.status ? 'Present' : 'Absent'}
                                                    </span>
                                                </td>
                                                <td className="action-buttons">
                                                    <button
                                                        className="toggle-button"
                                                        onClick={() => handleToggleStatus(record.id, record.status)}
                                                    >
                                                        Toggle
                                                    </button>
                                                    <button
                                                        className="delete-button"
                                                        onClick={() => handleDeleteRecord(record.id)}
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
