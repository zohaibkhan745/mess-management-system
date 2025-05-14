import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Feedback.css";

export default function Feedback() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get user data from localStorage
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      const parsedUser = JSON.parse(storedUserData);
      setUserData(parsedUser);
      // Pre-fill email if available
      if (parsedUser.email) {
        setEmail(parsedUser.email);
      }
    } else {
      // Redirect to login if no user data found
      navigate("/signin");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:4000/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, message }),
      });

      if (response.ok) {
        setSubmitted(true);
        setTimeout(() => {
          setEmail(userData?.email || "");
          setMessage("");
          setSubmitted(false);
        }, 3000);
      } else {
        const errorData = await response.json();
        console.error("Error:", errorData.error);
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
    }
  };

  return (
    <div className="feedback-container">
      <header className="feedback-header">
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

      <div className="feedback-content">
        <div className="feedback-card">
          <Link to="/dashboard" className="back-button">
            <span>←</span>
          </Link>

          <h1 className="card-title">Complaints/Feedbacks</h1>

          {submitted ? (
            <div className="success-message">
              <p>
                Thank you for your feedback! Your message has been submitted.
              </p>
            </div>
          ) : (
            <form className="feedback-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <input
                  type="email"
                  id="email"
                  placeholder="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <textarea
                  id="message"
                  placeholder="Write your complaint or Feedback here...."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  rows="10"
                ></textarea>
              </div>
              <div className="form-group submit-group">
                <button type="submit" className="submit-btn">
                  Submit
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
