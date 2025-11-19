import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./DashBoard.css";

export default function Dashboard() {
  const [user, setUser] = useState({ name: "" });
  const navigate = useNavigate();

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem("userData");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
    } else {
      // Redirect to login if no user data found
      navigate("/signin");
    }
  }, [navigate]);

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");

    // Redirect to landing page
    navigate("/");
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="logo">
          <img
            src={process.env.PUBLIC_URL + "/assets/logo-pic.png"}
            alt="Logo"
            className="logo-img"
          />
          <span>Giki Mess Management System</span>
        </div>
        <div className="profile-section">
          <div className="avatar">{user?.name?.[0] || "A"}</div>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="menu-grid">
          <Link to="/mess-inout" className="menu-item">
            <div className="menu-content">
              <h2>Mess In/Out</h2>
            </div>
          </Link>

          <Link to="/menu" className="menu-item">
            <div className="menu-content">
              <h2>Menu</h2>
            </div>
          </Link>

          <Link to="/mess-bill" className="menu-item">
            <div className="menu-content">
              <h2>Mess Bill</h2>
            </div>
          </Link>

          <Link to="/rules" className="menu-item">
            <div className="menu-content">
              <h2>Rules</h2>
            </div>
          </Link>

          <Link to="/faqs" className="menu-item">
            <div className="menu-content">
              <h2>FAQs</h2>
            </div>
          </Link>

          <Link to="/feedback" className="menu-item">
            <div className="menu-content">
              <h2>
                Complaints/
                <br />
                Feedbacks
              </h2>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}
