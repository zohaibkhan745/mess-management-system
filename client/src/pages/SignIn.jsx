import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // For navigation
import "../styles/pages/SignIn.css";
import Button from "../components/button.jsx";

const SignIn = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:4000/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Sign-in successful:", result);
        // Redirect to the testing page
        navigate("/testing");
      } else {
        const errorData = await response.json();
        setError(errorData.message);
      }
    } catch (error) {
      console.error("Error during sign-in:", error);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="container">
      <img
        className="SignIn-meal-image"
        src="/assets/sigininmeal.png"
        alt="Delicious Meal"
      />

      <div className="right-panel">
        <div className="form-container">
          <h1>Sign In</h1>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            {error && <p className="error-text">{error}</p>}

            <div className="input-group">
              <Button text="Sign In" className="create-btn" />
            </div>
          </form>

          <div className="separator">
            <div className="line"></div>
            <span>or</span>
            <div className="line"></div>
          </div>

          <p className="login-text">
            Don't have an account? <a href="/">Create Account</a>
          </p>
        </div>
      </div>

      <div className="left-panel">
        <h1 className="createtext">Sign In</h1>
        <img
          className="image-container"
          src="/assets/background.png"
          alt="Hello"
        />
      </div>
    </div>
  );
};

export default SignIn;
