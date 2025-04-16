// ✅ ForgotPassword.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ForgotPassword.css";
import Button from "../../components/button.jsx";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      setStep(2);
      setSuccess("Reset code sent to your email");
    } catch (error) {
      setError("Error sending reset email. Please try again.");
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    try {
      const response = await fetch("http://localhost:4000/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword }),
      });

      if (response.ok) {
        setSuccess("Password reset successfully!");
        setTimeout(() => navigate("/signin"), 2000);
      } else {
        const errorData = await response.json();
        setError(errorData.message);
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="container">
      <div className="content-wrapper">
        <img className="meal-image" src="/assets/sigininmeal.png" alt="Delicious Meal" />
        <div className="left-panel">
          <h1 className="createtext">Reset Password</h1>
          <img className="image-container" src="/assets/background.png" alt="Hello" />
        </div>
        <div className="right-panel">
          <div className="form-container">
            <h1>Forgot Password</h1>
            {step === 1 ? (
              <form onSubmit={handleEmailSubmit}>
                <div className="input-group">
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                {error && <p className="error-text">{error}</p>}
                <div className="input-group">
                  <Button text="Send Reset Link" className="create-btn" />
                </div>
              </form>
            ) : (
              <form onSubmit={handlePasswordSubmit}>
                <div className="input-group">
                  <label htmlFor="newPassword">New Password</label>
                  <input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                {error && <p className="error-text">{error}</p>}
                {success && <p className="success-text">{success}</p>}
                <div className="input-group">
                  <Button text="Reset Password" className="create-btn" />
                </div>
              </form>
            )}
            <p className="login-text">
              Remember your password? <a href="/signin">Sign In</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
