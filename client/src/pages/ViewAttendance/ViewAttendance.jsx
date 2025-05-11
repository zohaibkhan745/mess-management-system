import React, { useState } from 'react';
import ReceptionistLayout from '../../components/receptionist/ReceptionistLayout';
import './ViewAttendance.css';

export default function ViewAttendance() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedStatus, setSelectedStatus] = useState('all');
  
  // Demo data
  const attendanceData = [
    { regNo: '2023003', name: 'Azeeb Ali Malik', hostel: 'H7', status: 'in', date: '2023-05-11' },
    { regNo: '2023007', name: 'Abdul Hakeem', hostel: 'H11', status: 'out', date: '2023-05-11' },
    { regNo: '2023009', name: 'Abdul Moeed', hostel: 'H3', status: 'in', date: '2023-05-11' },
    { regNo: '2023039', name: 'Abdullah Ihsan', hostel: 'H9', status: 'in', date: '2023-05-11' },
    { regNo: '2023066', name: 'Ali Hyder', hostel: 'H4', status: 'in', date: '2023-05-11' },
    { regNo: '2023076', name: 'Aleeza Nasir', hostel: 'H8', status: 'out', date: '2023-05-11' },
    { regNo: '2023101', name: 'Faizan Khan', hostel: 'H2', status: 'in', date: '2023-05-11' },
  ];
  
  // Filter attendance based on selected options
  const filteredAttendance = attendanceData.filter(record => {
    const dateMatch = record.date === selectedDate;
    const statusMatch = selectedStatus === 'all' || record.status === selectedStatus;
    return dateMatch && statusMatch;
  });
  
  // Calculate summary statistics
  const totalStudents = attendanceData.length;
  const presentStudents = filteredAttendance.filter(record => record.status === 'in').length;
  const absentStudents = filteredAttendance.filter(record => record.status === 'out').length;
  
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
              onChange={e => setSelectedDate(e.target.value)}
            />
          </div>
          
          <div className="status-filter">
            <label htmlFor="statusSelect">Status:</label>
            <select 
              id="statusSelect"
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
            >
              <option value="all">All</option>
              <option value="in">In Mess</option>
              <option value="out">Out of Mess</option>
            </select>
          </div>
          
          <button className="btn primary">
            <i className="fas fa-filter"></i> Filter
          </button>
          
          <button className="btn secondary">
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
              {filteredAttendance.map((record, index) => (
                <tr key={index}>
                  <td>{record.regNo}</td>
                  <td>{record.name}</td>
                  <td>{record.hostel}</td>
                  <td className={`status ${record.status}`}>
                    {record.status === 'in' ? 'Present' : 'Absent'}
                  </td>
                  <td>{record.date}</td>
                  <td className="actions">
                    <button className="btn icon-btn small">
                      <i className="fas fa-exchange-alt"></i>
                    </button>
                    <button className="btn icon-btn small">
                      <i className="fas fa-history"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </ReceptionistLayout>
  );
}