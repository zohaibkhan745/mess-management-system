import React from "react";
import { Link } from "react-router-dom"; // Import Link for navigation
import "../styles/pages/SignIn.css"; // Import the CSS file for styling
import Button from "../components/button.jsx";

const SignIn = () => {
  return (
    <div className="container">
      {/* Add the meal image here */}
      <img
        className="SignIn-meal-image"
        src="/assets/sigininmeal.png" // Replace with the correct path to your meal image
        alt="Delicious Meal"
      />

      {/* Right side with form */}
      <div className="right-panel">
        <div className="form-container">
          <h1>Sign In</h1>
          <form>
            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input id="email" type="email" placeholder="" />
            </div>

            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder=""
              />
            </div>

            <div className="input-group">
              <Button text="Sign In" className="create-btn" />
            </div>
          </form>

          <div className="separator">
            <div className="line"></div>
            <span>or</span>
            <div className="line"></div>
          </div>

          {/* Use Link for navigation */}
          <p className="login-text">
            Don't have an account? <Link to="/">Create Account</Link>
          </p>
        </div>
      </div>

      {/* Left side with image */}
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
