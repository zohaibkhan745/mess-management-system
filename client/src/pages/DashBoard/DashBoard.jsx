import React from 'react';
import { Link } from 'react-router-dom';
import './DashBoard.css';

export default function Dashboard() {
  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="logo">
          <img src={process.env.PUBLIC_URL + '/assets/logo-pic.png'} alt="Logo" className="logo-img" />
          <span>Giki Mess Management System</span>
        </div>
        <nav className="dashboard-nav">
          <ul>
            <li><a href="#about">about</a></li>
            <li><a href="#pricing">pricing</a></li>
            <li><a href="#contact">contact</a></li>
          </ul>
        </nav>
        <div className="profile-icon">
          <div className="avatar">A</div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="menu-grid">
          <Link to="/mess-inout" className="menu-item">
            <div className="menu-content">
              <h2>Mes In/Out</h2>
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
              <h2>Complaints/<br />Feedbacks</h2>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}
