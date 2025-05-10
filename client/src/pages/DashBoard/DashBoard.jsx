import React from 'react';
import { Link } from 'react-router-dom';
import './DashBoard.css';
import Navbar from '../../components/Navbar';
// Auth context imported but not used yet - will be needed for future features
// import { useAuth } from '../../contexts/AuthContext';

export default function Dashboard() {

  return (
    <div className="dashboard-container">
      <Navbar />

      <main className="dashboard-main">
        <div className="menu-grid">
          <Link to="/mess-inout" className="menu-item">
            <div className="menu-content">
              <h2>Mess In/Out</h2>
            </div>
          </Link>          <Link to="/menu" className="menu-item">
            <div className="menu-content">
              <h2>Menu</h2>
            </div>
          </Link>

          {/* Mess Bill feature coming soon */}
          <div className="menu-item disabled">
            <div className="menu-content">
              <h2>Mess Bill</h2>
              <small>(Coming Soon)</small>
            </div>
          </div>

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
              <h2>Complaints/<br />Feedbacks</h2>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}
