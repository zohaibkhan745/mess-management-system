import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./FAQs.css";

export default function FAQs() {
  const [faqsList, setFaqsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/faqs");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setFaqsList(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching FAQs:", error);
        setError("Failed to load FAQs. Please try again later.");
        setLoading(false);
      }
    };

    fetchFAQs();
  }, []);

  return (
    <div className="faqs-container">
      <header className="faqs-header">
        <div className="logo">
          <img
            src={process.env.PUBLIC_URL + "/assets/logo-pic.png"}
            alt="Logo"
            className="logo-img"
          />
          <span>Giki Mess Management System</span>
        </div>
        <nav className="faqs-nav">
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

      <div className="faqs-content">
        <div className="faqs-card">
          <Link to="/dashboard" className="back-button">
            <span>←</span>
          </Link>

          <h1 className="card-title">FAQs (Frequently Asked Questions)</h1>

          {loading ? (
            <div className="loading">Loading FAQs...</div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : (
            <div className="faqs-list">
              {faqsList.map((faq, index) => (
                <div key={faq.faq_id} className="faq-item">
                  <div className="faq-question">
                    <p>
                      <strong>
                        Q{index + 1}: {faq.question}
                      </strong>
                    </p>
                  </div>
                  <div className="faq-answer">
                    <p>A: {faq.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
