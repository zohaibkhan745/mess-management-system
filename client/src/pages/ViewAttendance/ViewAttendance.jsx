import React, { useState, useEffect } from "react";
import ReceptionistLayout from "../../components/receptionist/ReceptionistLayout";
import "./ViewAttendance.css";

export default function ViewAttendance() {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalStudents, setTotalStudents] = useState(0);

  // Fetch attendance data when date or status changes
  useEffect(() => {
    fetchAttendanceData();
  }, [selectedDate]);

  // Fetch total student count on component mount
  useEffect(() => {
    fetchTotalStudents();
  }, []);

  const fetchTotalStudents = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/students/count");
      if (!response.ok) {
        throw new Error("Failed to fetch student count");
      }
      const data = await response.json();
      setTotalStudents(data.count);
    } catch (err) {
      console.error("Error fetching student count:", err);
      setTotalStudents(0); // Default to 0 if error occurs
    }
  };

  const fetchAttendanceData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `http://localhost:4000/api/attendance/daily?date=${selectedDate}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch attendance data");
      }

      const data = await response.json();
      setAttendanceData(data);
    } catch (err) {
      console.error("Error fetching attendance data:", err);
      setError("Failed to load attendance data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle manual status change for a student
  const handleToggleStatus = async (regNo, currentStatus) => {
    const newStatus = currentStatus === "in" ? "out" : "in";

    try {
      const response = await fetch("http://localhost:4000/api/attendance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          regNo,
          date: selectedDate,
          status: newStatus,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update attendance status");
      }

      // Update local state after successful update
      setAttendanceData((prevData) =>
        prevData.map((record) =>
          record.reg_no === regNo ? { ...record, status: newStatus } : record
        )
      );
    } catch (err) {
      console.error("Error updating attendance status:", err);
      alert("Failed to update attendance status. Please try again.");
    }
  };

  // Filter attendance based on selected status
  const filteredAttendance = attendanceData.filter((record) => {
    return selectedStatus === "all" || record.status === selectedStatus;
  });

  // Calculate summary statistics
  const presentStudents = attendanceData.filter(
    (record) => record.status === "in"
  ).length;
  const absentStudents = attendanceData.filter(
    (record) => record.status === "out"
  ).length;

  // Handle export to CSV
  const exportToCSV = () => {
    const headers = ["Registration Number", "Name", "Hostel", "Status", "Date"];

    const csvData = filteredAttendance.map((record) => [
      record.reg_no,
      record.name,
      record.hostel_name,
      record.status === "in" ? "Present" : "Absent",
      selectedDate,
    ]);

    const csvContent = [
      headers.join(","),
      ...csvData.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");

    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `attendance-${selectedDate}.csv`);
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle viewing attendance history for a student
  const viewAttendanceHistory = (regNo, name) => {
    // This would typically navigate to a detailed view in a real application
    alert(`Viewing attendance history for ${name} (${regNo})`);
  };

  return (
    <ReceptionistLayout activeTab="attendance">
      <h1 className="page-title">View Mess Attendance</h1>

      <div className="attendance-container">
        <div className="filter-section">
          <div className="date-filter">
            <label htmlFor="dateSelect">Select Date:</label>
            <input
              id="dateSelect"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>

          <div className="status-filter">
            <label htmlFor="statusSelect">Status:</label>
            <select
              id="statusSelect"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="all">All</option>
              <option value="in">In Mess</option>
              <option value="out">Out of Mess</option>
            </select>
          </div>

          <button className="btn primary" onClick={fetchAttendanceData}>
            <i className="fas fa-filter"></i> Filter
          </button>

          <button className="btn secondary" onClick={exportToCSV}>
            <i className="fas fa-download"></i> Export
          </button>
        </div>

        <div className="attendance-summary">
          <div className="summary-card">
            <h3>Total Students</h3>
            <div className="summary-value">{totalStudents}</div>
          </div>

          <div className="summary-card">
            <h3>Present Today</h3>
            <div className="summary-value in">{presentStudents}</div>
          </div>

          <div className="summary-card">
            <h3>Absent Today</h3>
            <div className="summary-value out">{absentStudents}</div>
          </div>
        </div>

        {loading ? (
          <div className="loading-indicator">Loading attendance data...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <div className="attendance-table-container">
            <table className="attendance-table">
              <thead>
                <tr>
                  <th>Reg No.</th>
                  <th>Name</th>
                  <th>Hostel</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAttendance.length > 0 ? (
                  filteredAttendance.map((record, index) => (
                    <tr key={index}>
                      <td>{record.reg_no}</td>
                      <td>{record.name}</td>
                      <td>{record.hostel_name}</td>
                      <td className={`status ${record.status}`}>
                        {record.status === "in" ? "Present" : "Absent"}
                      </td>
                      <td>{selectedDate}</td>
                      <td className="actions">
                        <button
                          className="btn icon-btn small"
                          onClick={() =>
                            handleToggleStatus(record.reg_no, record.status)
                          }
                          title={
                            record.status === "in"
                              ? "Mark as Absent"
                              : "Mark as Present"
                          }
                        >
                          <i className="fas fa-exchange-alt"></i>
                        </button>
                        <button
                          className="btn icon-btn small"
                          onClick={() =>
                            viewAttendanceHistory(record.reg_no, record.name)
                          }
                          title="View Attendance History"
                        >
                          <i className="fas fa-history"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="no-data">
                      No attendance records found for this date
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </ReceptionistLayout>
  );
}
