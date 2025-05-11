import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Rules.css";

export default function Rules() {
  const [messRules, setMessRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRules = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/rules");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setMessRules(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching rules:", error);
        setError("Failed to load mess rules. Please try again later.");
        setLoading(false);
      }
    };

    fetchRules();
  }, []);

  return (
    <div className="rules-container">
      <header className="rules-header">
        <div className="logo">
          <img
            src={process.env.PUBLIC_URL + "/assets/logo-pic.png"}
            alt="Logo"
            className="logo-img"
          />
          <span>Giki Mess Management System</span>
        </div>
        <nav className="rules-nav">
          <ul>
            <li>
              <a href="#about">about</a>
            </li>
            <li>
              <a href="#pricing">pricing</a>
            </li>
            <li>
              <a href="#contact">contact</a>
            </li>
          </ul>
        </nav>
        <div className="profile-icon">
          <div className="avatar">A</div>
        </div>
      </header>

      <div className="rules-content">
        <div className="rules-card">
          <Link to="/dashboard" className="back-button">
            <span>←</span>
          </Link>

          <h1 className="card-title">Mess Rules & Guidelines</h1>

          {loading ? (
            <div className="loading">Loading rules...</div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : (
            <div className="rules-list">
              {messRules.map((rule, index) => (
                <div key={rule.rule_id} className="rule-item">
                  <p>
                    <span className="rule-number">{index + 1}. </span>
                    <span className="rule-title">{rule.title} </span>
                    {rule.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
