import React from "react";
import {Link } from "react-router-dom"; // Import Link for navigation
import "../styles/pages/AccountCreation.css"; // Import the CSS file for styling
import Button from "../components/button.jsx";
const AccountCreationPage = () => {
  return (
    <div className="container">
     {/* Add the meal image here */}
     <img
        className="meal-image"
        src="/assets/frontimage.png" // Replace with the correct path to your meal image
        alt="Delicious Meal"
      />
      {/* Left side with image */}
      <div className="left-panel">
        <h1 className="createtext">Create Account</h1>
        
          <img className="image-container"
            src="/assets/background.png"
            alt="Hello"
          />
    
      </div>

      {/* Right side with form */}
      <div className="right-panel">
        <div className="form-container">
          <h1>Create Account</h1>
          <form>
            <div className="name">
              <div className="input-group">
                <label htmlFor="firstName" className="">
                  First Name
                </label>
                <input id="firstName" type="text" />
              </div>

              <div className="input-group">
                <label htmlFor="lastName">Last Name</label>
                <input id="lastName" type="text" />
              </div>
            </div>
            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input id="email" type="email" />
            </div>

            <div className="input-group">
              <label htmlFor="regNo">Reg No</label>
              <input id="regNo" type="text" />
            </div>
            <div className="input-group">
            <Button text="Create Account" className="create-btn" />
            </div>
          </form>

          <div className="separator">
            <div className="line"></div>
            <span>or</span>
            <div className="line"></div>
          </div>

          <p className="login-text">
            Already have an Account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AccountCreationPage;
