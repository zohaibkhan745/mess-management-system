import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './MessInOut.css';
import Navbar from '../../components/Navbar';

export default function MessInOut() {
    const [messStatus, setMessStatus] = useState(false); // false means "out", true means "in"
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [daysStatus, setDaysStatus] = useState({});

    // Get today's date
    const today = new Date();
    const todayDate = today.getDate();
    const todayMonth = today.getMonth();
    const todayYear = today.getFullYear();

    // Days of the week
    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    // Load initial data (in a real app this would come from an API)
    useEffect(() => {
        // This is dummy data - in a real app, you'd fetch this from your backend
        const dummyData = generateInitialDummyData(currentMonth, currentYear);
        setDaysStatus(dummyData);
    }, [currentMonth, currentYear]);

    // Update only today's status when mess status changes
    useEffect(() => {
        // Only update if we're viewing the current month
        if (currentMonth === todayMonth && currentYear === todayYear) {
            setDaysStatus(prevStatus => ({
                ...prevStatus,
                [todayDate]: messStatus // Update only today's date based on mess status
            }));
        }
    }, [messStatus, currentMonth, currentYear, todayDate, todayMonth, todayYear]);

    // Generate initial dummy data with past days randomly marked and today/future undecided
    const generateInitialDummyData = (month, year) => {
        const result = {};
        const daysInMonth = getDaysInMonth(month, year);

        for (let i = 1; i <= daysInMonth; i++) {
            // If it's a past date (in current month), randomly set status
            if ((month === todayMonth && year === todayYear && i < todayDate) ||
                (month < todayMonth && year === todayYear) ||
                (year < todayYear)) {
                result[i] = Math.random() > 0.5;
            }
            // For today, set based on current mess status
            else if (month === todayMonth && year === todayYear && i === todayDate) {
                result[i] = messStatus;
            }
            // For future dates, set as undecided (null)
            else {
                result[i] = null;
            }
        }
        return result;
    };

    // Toggle the overall mess status (affects only today)
    const toggleMessStatus = () => {
        setMessStatus(!messStatus);
    };

    // Get the number of days in the current month
    const getDaysInMonth = (month, year) => {
        return new Date(year, month + 1, 0).getDate();
    };

    // Get month name
    const getMonthName = (month) => {
        const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        return monthNames[month];
    };

    // Get the first day of the month (0 = Sunday, 1 = Monday, etc.)
    const getFirstDayOfMonth = (month, year) => {
        return new Date(year, month, 1).getDay();
    };

    // Render the calendar header (days of the week)
    const renderCalendarHeader = () => {
        return weekDays.map((day, index) => (
            <div key={`weekday-${index}`} className="calendar-weekday">
                {day}
            </div>
        ));
    };

    // Render the calendar
    const renderCalendar = () => {
        const daysInMonth = getDaysInMonth(currentMonth, currentYear);
        const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
        const calendarDays = [];

        // Add empty cells for days before the start of the month
        for (let i = 0; i < firstDay; i++) {
            calendarDays.push(
                <div key={`empty-${i}`} className="calendar-day empty"></div>
            );
        }

        // Add cells for each day of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const status = daysStatus[day];
            const isToday = day === todayDate &&
                currentMonth === todayMonth &&
                currentYear === todayYear;
            const isPast = (currentYear < todayYear) ||
                (currentYear === todayYear && currentMonth < todayMonth) ||
                (currentYear === todayYear && currentMonth === todayMonth && day < todayDate);
            const isFuture = !isToday && !isPast;

            calendarDays.push(
                <div
                    key={day}
                    className={`calendar-day ${isToday ? 'today' : ''} ${isPast ? 'past' : ''} ${isFuture ? 'future' : ''}`}
                >
                    <div className="day-number">{day}</div>
                    {status === true ? (
                        <span className="day-status in">✓</span>
                    ) : status === false ? (
                        <span className="day-status out">✗</span>
                    ) : (
                        <span className="day-status undecided">?</span>
                    )}
                </div>
            );
        }

        return calendarDays;
    };

    // Navigation to previous month
    const goToPreviousMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
    };

    // Navigation to next month
    const goToNextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
    };

    // Count the number of mess-in days for the current month
    const countMessInDays = () => {
        let count = 0;
        const daysInMonth = getDaysInMonth(currentMonth, currentYear);

        for (let day = 1; day <= daysInMonth; day++) {
            if (daysStatus[day] === true) {
                count++;
            }
        }

        return count;
    };

    // Calculate the estimated mess bill (example calculation)
    const calculateEstimatedBill = () => {
        const perDayRate = 300; // Example: 300 rupees per day
        return countMessInDays() * perDayRate;
    }; return (
        <div className="mess-inout-container">
            <Navbar />

            <div className="mess-inout-content">
                <div className="mess-inout-card">
                    <Link to="/dashboard" className="back-button">
                        <span>←</span>
                    </Link>

                    <h1 className="card-title">Mess IN/OUT</h1>

                    <div className="calendar-container">
                        <div className="calendar-header">
                            <button className="month-nav" onClick={goToPreviousMonth}>←</button>
                            <h2>{getMonthName(currentMonth)} {currentYear}</h2>
                            <button className="month-nav" onClick={goToNextMonth}>→</button>
                        </div>

                        <div className="weekday-header">
                            {renderCalendarHeader()}
                        </div>

                        <div className="calendar-grid">
                            {renderCalendar()}
                        </div>

                        <div className="calendar-legend">
                            <div className="legend-item">
                                <span className="day-status in">✓</span>
                                <span>Mess In</span>
                            </div>
                            <div className="legend-item">
                                <span className="day-status out">✗</span>
                                <span>Mess Out</span>
                            </div>
                            <div className="legend-item">
                                <span className="day-status undecided">?</span>
                                <span>Not Yet Decided</span>
                            </div>
                        </div>
                    </div>

                    <div className="mess-toggle-container">
                        <span className="mess-status-label">
                            {messStatus ? 'You are currently in mess' : 'You are currently out of mess'}
                        </span>
                        <div className="toggle-switch">
                            <input
                                type="checkbox"
                                id="mess-toggle"
                                checked={messStatus}
                                onChange={toggleMessStatus}
                            />
                            <label htmlFor="mess-toggle" className="toggle-label"></label>
                        </div>
                        <span className="mess-status-text">
                            Toggle to change today's status
                        </span>
                    </div>

                    <div className="mess-summary">
                        <p>Mess In Days: <span className="count-number">{countMessInDays()}</span> | Estimated Bill: {calculateEstimatedBill()} Rupees</p>
                    </div>
                </div>
            </div>
        </div>
    );
}