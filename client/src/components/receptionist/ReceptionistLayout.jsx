import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./ReceptionistLayout.css";

export default function ReceptionistLayout({ children, activeTab }) {
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
    <div className="receptionist-layout">
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

      <div className="layout-container">
        <aside className="sidebar">
          <nav className="nav-menu">
            <Link 
              to="/receptionist-dashboard" 
              className={!activeTab ? "active" : ""}
            >
              <i className="fas fa-tachometer-alt"></i>
              Dashboard
            </Link>
            <Link 
              to="/manage-meals" 
              className={activeTab === "meals" ? "active" : ""}
            >
              <i className="fas fa-utensils"></i>
              Manage Meals
            </Link>
            <Link 
              to="/manage-rules" 
              className={activeTab === "rules" ? "active" : ""}
            >
              <i className="fas fa-gavel"></i>
              Manage Rules
            </Link>
            <Link 
              to="/manage-faqs" 
              className={activeTab === "faqs" ? "active" : ""}
            >
              <i className="fas fa-question-circle"></i>
              Manage FAQs
            </Link>
            <Link 
              to="/view-attendance" 
              className={activeTab === "attendance" ? "active" : ""}
            >
              <i className="fas fa-calendar-check"></i>
              View Attendance
            </Link>
            <Link 
              to="/manage-students" 
              className={activeTab === "students" ? "active" : ""}
            >
              <i className="fas fa-user-graduate"></i>
              Manage Students
            </Link>
          </nav>
        </aside>

        <main className="layout-content">
          {children}
        </main>
      </div>
    </div>
  );
}