import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./MessInOut.css";

export default function MessInOut() {
  const [messStatus, setMessStatus] = useState(false); // false means "out", true means "in"
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [daysStatus, setDaysStatus] = useState({});
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [summary, setSummary] = useState({ daysIn: 0, estimatedBill: 0 });
  const [isRestricted, setIsRestricted] = useState(false);

  const navigate = useNavigate();

  // Get today's date
  const today = new Date();
  const todayDate = today.getDate();
  const todayMonth = today.getMonth();
  const todayYear = today.getFullYear();
  const todayFormatted = today.toISOString().split("T")[0]; // YYYY-MM-DD format

  // Days of the week
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  useEffect(() => {
    // Check if the current time is in restricted hours (10 AM to 12 PM)
    const currentHour = new Date().getHours();
    if (currentHour >= 10 && currentHour < 12) {
      setIsRestricted(true);
    } else {
      setIsRestricted(false);
    }

    // Check for user data in local storage
    const storedUserData = localStorage.getItem("userData");
    if (!storedUserData) {
      navigate("/signin");
      return;
    }

    const user = JSON.parse(storedUserData);
    setUserData(user);

    // Fetch attendance data for the current month
    fetchAttendanceData(user.regNo, currentMonth + 1, currentYear);
    fetchAttendanceSummary(user.regNo, currentMonth + 1, currentYear);
  }, [navigate, currentMonth, currentYear]);

  const fetchAttendanceData = async (regNo, month, year) => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:4000/api/attendance/${regNo}?month=${month}&year=${year}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch attendance data");
      }

      const data = await response.json();

      // Convert to the format our component uses
      const statusMap = {};
      const daysInMonth = getDaysInMonth(month - 1, year);

      // Initialize all days to null (undecided)
      for (let i = 1; i <= daysInMonth; i++) {
        statusMap[i] = null;
      }

      // Update with actual data
      data.forEach((record) => {
        const day = new Date(record.date).getDate();
        statusMap[day] = record.status === "in";
      });

      setDaysStatus(statusMap);

      // Set today's status if available
      const todayRecord = data.find((record) => record.date === todayFormatted);
      if (todayRecord) {
        setMessStatus(todayRecord.status === "in");
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching attendance:", error);
      setError("Failed to load attendance data. Please try again.");
      setLoading(false);
    }
  };

  const fetchAttendanceSummary = async (regNo, month, year) => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/attendance/summary/${regNo}?month=${month}&year=${year}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch attendance summary");
      }

      const data = await response.json();
      setSummary(data);
    } catch (error) {
      console.error("Error fetching attendance summary:", error);
    }
  };

  // Toggle the mess status for today
  const toggleMessStatus = async () => {
    // Check if time is restricted
    if (isRestricted) {
      setError("Attendance changes are not allowed between 10 AM and 12 PM");
      setTimeout(() => setError(null), 3000);
      return;
    }

    const newStatus = !messStatus;
    setMessStatus(newStatus);

    try {
      const response = await fetch("http://localhost:4000/api/attendance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({
          regNo: userData.regNo,
          date: todayFormatted,
          status: newStatus ? "in" : "out",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update attendance");
      }

      // Update days status for today
      setDaysStatus((prev) => ({
        ...prev,
        [todayDate]: newStatus,
      }));

      // Show success message
      setSuccessMessage(
        `Status updated to ${newStatus ? "Mess In" : "Mess Out"}`
      );
      setTimeout(() => setSuccessMessage(""), 3000);

      // Refresh summary data
      fetchAttendanceSummary(userData.regNo, currentMonth + 1, currentYear);
    } catch (error) {
      console.error("Error updating attendance:", error);
      setError(error.message || "Failed to update attendance");
      setTimeout(() => setError(null), 3000);

      // Revert the UI change if there was an error
      setMessStatus(!newStatus);
    }
  };

  // Get the number of days in the month
  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Get month name
  const getMonthName = (month) => {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return monthNames[month];
  };

  // Get the first day of the month (0 = Sunday, 1 = Monday, etc.)
  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
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
      const isToday =
        day === todayDate &&
        currentMonth === todayMonth &&
        currentYear === todayYear;
      const isPast =
        currentYear < todayYear ||
        (currentYear === todayYear && currentMonth < todayMonth) ||
        (currentYear === todayYear &&
          currentMonth === todayMonth &&
          day < todayDate);
      const isFuture = !isToday && !isPast;

      calendarDays.push(
        <div
          key={day}
          className={`calendar-day ${isToday ? "today" : ""} ${
            isPast ? "past" : ""
          } ${isFuture ? "future" : ""}`}
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

  return (
    <div className="mess-inout-container">
      <header className="mess-inout-header">
        <div className="logo">
          <img
            src={process.env.PUBLIC_URL + "/assets/logo-pic.png"}
            alt="Logo"
            className="logo-img"
          />
          <span>Giki Mess Management System</span>
        </div>
        <div className="profile-icon">
          <div className="avatar">{userData?.name?.[0] || "A"}</div>
        </div>
      </header>

      <div className="mess-inout-content">
        <div className="mess-inout-card">
          <Link to="/dashboard" className="back-button">
            <span>←</span>
          </Link>

          <h1 className="card-title">Mess IN/OUT</h1>

          {error && <div className="error-message">{error}</div>}
          {successMessage && (
            <div className="success-message">{successMessage}</div>
          )}
          {isRestricted && (
            <div className="restricted-notice">
              Note: Attendance changes are not allowed between 10 AM and 12 PM
            </div>
          )}

          {loading ? (
            <div className="loading">Loading attendance data...</div>
          ) : (
            <>
              <div className="calendar-container">
                <div className="calendar-header">
                  <button className="month-nav" onClick={goToPreviousMonth}>
                    ←
                  </button>
                  <h2>
                    {getMonthName(currentMonth)} {currentYear}
                  </h2>
                  <button className="month-nav" onClick={goToNextMonth}>
                    →
                  </button>
                </div>

                <div className="weekday-header">{renderCalendarHeader()}</div>

                <div className="calendar-grid">{renderCalendar()}</div>

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
                  {messStatus
                    ? "You are currently in mess"
                    : "You are currently out of mess"}
                </span>
                <div className="toggle-switch">
                  <input
                    type="checkbox"
                    id="mess-toggle"
                    checked={messStatus}
                    onChange={toggleMessStatus}
                    disabled={isRestricted}
                  />
                  <label
                    htmlFor="mess-toggle"
                    className={`toggle-label ${isRestricted ? "disabled" : ""}`}
                  ></label>
                </div>
                <span className="mess-status-text">
                  Toggle to change today's status
                </span>
              </div>

              <div className="mess-summary">
                <p>
                  Mess In Days:{" "}
                  <span className="count-number">{summary.daysIn}</span> |
                  Estimated Bill: {summary.estimatedBill} Rupees
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
