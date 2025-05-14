import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./ReceptionistDashboard.css";

export default function ReceptionistDashboard() {
  const [receptionist, setReceptionist] = useState({ name: "" });
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in as receptionist
    const userData = localStorage.getItem("userData");
    const userRole = localStorage.getItem("userRole");

    if (userData && userRole === "receptionist") {
      const parsedUser = JSON.parse(userData);
      setReceptionist(parsedUser);
    } else {
      // Redirect to login if not authenticated as receptionist
      navigate("/signin");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    localStorage.removeItem("userRole");
    navigate("/signin");
  };

  return (
    <div className="receptionist-dashboard">
      <header className="dashboard-header">
        <div className="logo">
          <img src="/assets/logo-pic.png" alt="Logo" />
          <h2>GIKI Mess System</h2>
        </div>
        <div className="user-info">
          <span className="user-role">Receptionist</span>
          <span className="user-name">{receptionist.name}</span>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <div className="dashboard-container">
        <main className="dashboard-content">
          <h1 className="welcome-heading">
            Welcome, {receptionist.name || "Receptionist"}
          </h1>
          <p className="welcome-subtext">
            Select an option to manage mess operations
          </p>

          <div className="dashboard-cards">
            <Link to="/manage-meals" className="dashboard-card">
              <div className="card-icon">
                <i className="fas fa-utensils"></i>
              </div>
              <h3>Manage Meals</h3>
              <p>Update daily menu and special items</p>
            </Link>

            <Link to="/manage-rules" className="dashboard-card">
              <div className="card-icon">
                <i className="fas fa-gavel"></i>
              </div>
              <h3>Manage Rules</h3>
              <p>Update mess rules and regulations</p>
            </Link>

            <Link to="/manage-faqs" className="dashboard-card">
              <div className="card-icon">
                <i className="fas fa-question-circle"></i>
              </div>
              <h3>Manage FAQs</h3>
              <p>Update frequently asked questions</p>
            </Link>

            <Link to="/view-attendance" className="dashboard-card">
              <div className="card-icon">
                <i className="fas fa-calendar-check"></i>
              </div>
              <h3>View Attendance</h3>
              <p>Track daily mess attendance</p>
            </Link>

            <Link to="/manage-students" className="dashboard-card">
              <div className="card-icon">
                <i className="fas fa-user-graduate"></i>
              </div>
              <h3>Manage Students</h3>
              <p>View and update student profiles</p>
            </Link>
          </div>

          <div className="dashboard-stats">
            <div className="stat-box">
              <h3>Today's Attendance</h3>
              <div className="stat">
                <span>In: 42</span>
                <span>Out: 8</span>
              </div>
            </div>
            <div className="stat-box">
              <h3>Total Students</h3>
              <div className="stat">45</div>
            </div>
            <div className="stat-box">
              <h3>Today's Menu</h3>
              <div className="menu-preview">
                <p>
                  <strong>Breakfast:</strong> Paratha, Eggs
                </p>
                <p>
                  <strong>Lunch:</strong> Rice, Chicken
                </p>
                <p>
                  <strong>Dinner:</strong> Roti, Daal
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
