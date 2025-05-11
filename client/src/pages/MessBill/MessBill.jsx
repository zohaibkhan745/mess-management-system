import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './MessBill.css';

export default function MessBill() {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [billData, setBillData] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // Current month (1-12)
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [billHistory, setBillHistory] = useState([]);
    const [showHistory, setShowHistory] = useState(false);
    
    const navigate = useNavigate();
    
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    
    // Create array of years from 2020 to current year
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: currentYear - 2019 }, (_, i) => 2020 + i);
    
    useEffect(() => {
        // Check if user is logged in
        const storedUserData = localStorage.getItem('userData');
        if (!storedUserData) {
            navigate('/signin');
            return;
        }
        
        const user = JSON.parse(storedUserData);
        setUserData(user);
        
        // Fetch bill for current selection
        fetchBillData(user.regNo, selectedMonth, selectedYear);
    }, [navigate, selectedMonth, selectedYear]);
    
    const fetchBillData = async (regNo, month, year) => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:4000/api/bill/${regNo}?month=${month}&year=${year}`);
            if (!response.ok) {
                throw new Error('Failed to fetch bill data');
            }
            
            const data = await response.json();
            setBillData(data);
            
            // Also fetch bill history if showing history
            if (showHistory) {
                fetchBillHistory(regNo);
            }
        } catch (error) {
            console.error('Error fetching bill:', error);
            setError('Failed to load bill data. Please try again later.');
        } finally {
            setLoading(false);
        }
    };
    
    const fetchBillHistory = async (regNo) => {
        try {
            const response = await fetch(`http://localhost:4000/api/bill/history/${regNo}`);
            if (!response.ok) {
                throw new Error('Failed to fetch bill history');
            }
            
            const data = await response.json();
            setBillHistory(data);
        } catch (error) {
            console.error('Error fetching bill history:', error);
        }
    };
    
    const handleMonthChange = (e) => {
        setSelectedMonth(parseInt(e.target.value));
    };
    
    const handleYearChange = (e) => {
        setSelectedYear(parseInt(e.target.value));
    };
    
    const toggleHistory = () => {
        const newShowHistory = !showHistory;
        setShowHistory(newShowHistory);
        if (newShowHistory && userData) {
            fetchBillHistory(userData.regNo);
        }
    };
    
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    return (
        <div className="messbill-container">
            <header className="messbill-header">
                <div className="logo">
                    <img src={process.env.PUBLIC_URL + '/assets/logo-pic.png'} alt="Logo" className="logo-img" />
                    <span>Giki Mess Management System</span>
                </div>
                <nav className="messbill-nav">
                    <ul>
                        <li><a href="#about">about</a></li>
                        <li><a href="#pricing">pricing</a></li>
                        <li><a href="#contact">contact</a></li>
                    </ul>
                </nav>
                <div className="profile-icon">
                    <div className="avatar">{userData?.name?.[0] || 'A'}</div>
                </div>
            </header>

            <div className="messbill-content">
                <div className="messbill-card">
                    <Link to="/dashboard" className="back-button">
                        <span>←</span>
                    </Link>

                    <h1 className="card-title">Mess Bill Statement</h1>

                    <div className="bill-filter">
                        <div className="period-selector">
                            <div className="select-group">
                                <label htmlFor="month-select">Month:</label>
                                <select 
                                    id="month-select" 
                                    value={selectedMonth} 
                                    onChange={handleMonthChange}
                                >
                                    {monthNames.map((month, index) => (
                                        <option key={month} value={index + 1}>
                                            {month}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            
                            <div className="select-group">
                                <label htmlFor="year-select">Year:</label>
                                <select 
                                    id="year-select" 
                                    value={selectedYear} 
                                    onChange={handleYearChange}
                                >
                                    {years.map(year => (
                                        <option key={year} value={year}>
                                            {year}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {loading ? (
                        <div className="loading">Loading bill data...</div>
                    ) : error ? (
                        <div className="error-message">{error}</div>
                    ) : billData ? (
                        <div className="bill-details">
                            <div className="bill-info-grid">
                                <div className="bill-info-item">
                                    <span className="bill-label">Student Name:</span>
                                    <span className="bill-value">{userData?.name}</span>
                                </div>
                                <div className="bill-info-item">
                                    <span className="bill-label">Registration Number:</span>
                                    <span className="bill-value">{userData?.regNo}</span>
                                </div>
                                <div className="bill-info-item">
                                    <span className="bill-label">Billing Period:</span>
                                    <span className="bill-value">{monthNames[selectedMonth - 1]} {selectedYear}</span>
                                </div>
                                <div className="bill-info-item">
                                    <span className="bill-label">Total Days:</span>
                                    <span className="bill-value">{billData.totalDays} days</span>
                                </div>
                                <div className="bill-info-item">
                                    <span className="bill-label">Days In Mess:</span>
                                    <span className="bill-value">{billData.daysIn} days</span>
                                </div>
                                <div className="bill-info-item">
                                    <span className="bill-label">Daily Rate:</span>
                                    <span className="bill-value">₨ 500 / day</span>
                                </div>
                            </div>
                            
                            <div className="bill-calculation">
                                <div className="calculation-item">
                                    <div className="calculation-detail">
                                        <span>{billData.daysIn} days × ₨ 500 = </span>
                                        <span className="amount">₨ {billData.totalBill}</span>
                                    </div>
                                </div>
                                <div className="bill-total">
                                    <span>Total Mess Bill:</span>
                                    <span className="total-amount">₨ {billData.totalBill}</span>
                                </div>
                            </div>
                            
                            <div className="payment-status">
                                <div className={`status ${billData.isPaid ? 'paid' : 'unpaid'}`}>
                                    {billData.isPaid ? 'PAID' : 'UNPAID'}
                                </div>
                            </div>
                            
                            {!billData.isPaid && (
                                <div className="payment-actions">
                                    <button className="pay-button">Pay Now</button>
                                </div>
                            )}
                            
                            <div className="bill-notes">
                                <p>Note: Your bill is calculated based on days you were marked "in" the mess.</p>
                                <p>Daily mess rate: ₨ 500</p>
                            </div>
                        </div>
                    ) : (
                        <div className="no-bill">
                            <p>No bill data available for the selected month.</p>
                        </div>
                    )}
                    
                    <div className="history-toggle">
                        <button 
                            className="toggle-button"
                            onClick={toggleHistory}
                        >
                            {showHistory ? 'Hide Bill History' : 'Show Bill History'}
                        </button>
                    </div>
                    
                    {showHistory && (
                        <div className="bill-history">
                            <h2>Bill History</h2>
                            {billHistory.length > 0 ? (
                                <div className="history-table-container">
                                    <table className="history-table">
                                        <thead>
                                            <tr>
                                                <th>Period</th>
                                                <th>Days In Mess</th>
                                                <th>Total Bill</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {billHistory.map((bill, index) => (
                                                <tr key={index}>
                                                    <td>{monthNames[bill.month - 1]} {bill.year}</td>
                                                    <td>{bill.daysIn} days</td>
                                                    <td>₨ {bill.totalBill}</td>
                                                    <td>
                                                        <span className={`status-badge ${bill.isPaid ? 'paid' : 'unpaid'}`}>
                                                            {bill.isPaid ? 'Paid' : 'Unpaid'}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p className="no-history">No bill history available.</p>
                            )}
                        </div>
                    )}
                    
                    <div className="bill-actions">
                        <button className="print-button" onClick={() => window.print()}>
                            Print Bill
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}