import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './SearchStudentRecord.css';
import Navbar from '../../../components/Navbar';

export default function SearchStudentRecord() {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchType, setSearchType] = useState('regNo');
    const [dateRange, setDateRange] = useState({
        startDate: '',
        endDate: ''
    });
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    // Mock data for demonstration
    const mockStudentRecords = [
        {
            id: 1,
            name: 'John Doe',
            regNo: '2021-ME-101',
            hostel: 'Hostel A',
            attendanceRecords: [
                { date: '2025-05-08', meal: 'Breakfast', status: true },
                { date: '2025-05-08', meal: 'Lunch', status: true },
                { date: '2025-05-08', meal: 'Dinner', status: false },
                { date: '2025-05-07', meal: 'Breakfast', status: true },
                { date: '2025-05-07', meal: 'Lunch', status: true },
                { date: '2025-05-07', meal: 'Dinner', status: true }
            ]
        },
        {
            id: 2,
            name: 'Jane Smith',
            regNo: '2021-ME-102',
            hostel: 'Hostel B',
            attendanceRecords: [
                { date: '2025-05-08', meal: 'Breakfast', status: false },
                { date: '2025-05-08', meal: 'Lunch', status: true },
                { date: '2025-05-08', meal: 'Dinner', status: true },
                { date: '2025-05-07', meal: 'Breakfast', status: false },
                { date: '2025-05-07', meal: 'Lunch', status: false },
                { date: '2025-05-07', meal: 'Dinner', status: true }
            ]
        }
    ];

    const handleSearch = (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        setLoading(true);
        setSearched(true);

        // Simulate API call
        setTimeout(() => {
            // Filter mock data based on search criteria
            const results = mockStudentRecords.filter(student => {
                if (searchType === 'regNo') {
                    return student.regNo.toLowerCase().includes(searchQuery.toLowerCase());
                } else if (searchType === 'name') {
                    return student.name.toLowerCase().includes(searchQuery.toLowerCase());
                } else if (searchType === 'hostel') {
                    return student.hostel.toLowerCase().includes(searchQuery.toLowerCase());
                }
                return false;
            });

            // Filter by date range if provided
            const filteredByDate = results.map(student => {
                const filteredRecords = student.attendanceRecords.filter(record => {
                    if (dateRange.startDate && dateRange.endDate) {
                        return record.date >= dateRange.startDate && record.date <= dateRange.endDate;
                    }
                    return true;
                });

                return {
                    ...student,
                    attendanceRecords: filteredRecords
                };
            });

            setSearchResults(filteredByDate);
            setLoading(false);
        }, 1000);
    };

    const handlePrint = (studentId) => {
        alert(`Printing attendance record for student ID: ${studentId}`);
        // In a real implementation, this would generate a printable report
    }; return (
        <div className="search-record-container">
            <Navbar />

            <div className="search-record-content">
                <div className="search-record-card">
                    <Link to="/receptionist-dashboard" className="back-button">
                        <span>←</span>
                    </Link>

                    <h1 className="card-title">Search Student Record</h1>

                    <div className="search-form">
                        <form onSubmit={handleSearch}>
                            <div className="form-row">
                                <div className="form-group search-input">
                                    <div className="search-input-wrapper">
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Enter search query..."
                                            required
                                            disabled={loading}
                                        />
                                        <button
                                            type="submit"
                                            className="search-button"
                                            disabled={loading || !searchQuery.trim()}
                                        >
                                            {loading ? 'Searching...' : 'Search'}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Search by:</label>
                                    <div className="radio-group">
                                        <label className="radio-label">
                                            <input
                                                type="radio"
                                                value="regNo"
                                                checked={searchType === 'regNo'}
                                                onChange={() => setSearchType('regNo')}
                                                disabled={loading}
                                            />
                                            Registration No
                                        </label>
                                        <label className="radio-label">
                                            <input
                                                type="radio"
                                                value="name"
                                                checked={searchType === 'name'}
                                                onChange={() => setSearchType('name')}
                                                disabled={loading}
                                            />
                                            Name
                                        </label>
                                        <label className="radio-label">
                                            <input
                                                type="radio"
                                                value="hostel"
                                                checked={searchType === 'hostel'}
                                                onChange={() => setSearchType('hostel')}
                                                disabled={loading}
                                            />
                                            Hostel
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="form-row date-filter">
                                <div className="form-group">
                                    <label htmlFor="startDate">From Date:</label>
                                    <input
                                        type="date"
                                        id="startDate"
                                        value={dateRange.startDate}
                                        onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                                        disabled={loading}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="endDate">To Date:</label>
                                    <input
                                        type="date"
                                        id="endDate"
                                        value={dateRange.endDate}
                                        onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                                        disabled={loading}
                                    />
                                </div>
                            </div>
                        </form>
                    </div>

                    {loading ? (
                        <div className="loading-indicator">Searching for records...</div>
                    ) : searched && searchResults.length === 0 ? (
                        <div className="no-results">No records found matching your search criteria.</div>
                    ) : searchResults.length > 0 && (
                        <div className="search-results">
                            {searchResults.map(student => (
                                <div key={student.id} className="student-record">
                                    <div className="student-info">
                                        <h3>{student.name}</h3>
                                        <div className="student-meta">
                                            <span><strong>Reg No:</strong> {student.regNo}</span>
                                            <span><strong>Hostel:</strong> {student.hostel}</span>
                                        </div>
                                        <button
                                            className="print-button"
                                            onClick={() => handlePrint(student.id)}
                                        >
                                            Print Record
                                        </button>
                                    </div>

                                    <div className="attendance-history">
                                        <h4>Attendance History</h4>
                                        {student.attendanceRecords.length === 0 ? (
                                            <p className="no-attendance">No attendance records in selected date range.</p>
                                        ) : (
                                            <table className="history-table">
                                                <thead>
                                                    <tr>
                                                        <th>Date</th>
                                                        <th>Meal</th>
                                                        <th>Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {student.attendanceRecords.map((record, index) => (
                                                        <tr key={index} className={record.status ? 'present-row' : 'absent-row'}>
                                                            <td>{record.date}</td>
                                                            <td>{record.meal}</td>
                                                            <td>
                                                                <span className={`status-badge ${record.status ? 'present' : 'absent'}`}>
                                                                    {record.status ? 'Present' : 'Absent'}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
