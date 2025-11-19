import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./FAQs.css";

export default function FAQs() {
  const [faqsList, setFaqsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get user data from localStorage
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      const parsedUser = JSON.parse(storedUserData);
      setUserData(parsedUser);
    } else {
      // Redirect to login if no user data found
      navigate("/signin");
      return;
    }

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
  }, [navigate]);

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
        <div className="profile-icon">
          <div className="avatar">{userData?.name?.[0] || "A"}</div>
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
                <div key={faq.faq_id || index} className="faq-item">
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
