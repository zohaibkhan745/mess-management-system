import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/pages/AccountCreation.css";
import Button from "../components/button.jsx";

const AccountCreationPage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Frontend validation for empty fields
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
        setError("All fields are required. Please fill out every field.");
        return;
    }

    try {
        const response = await fetch("http://localhost:4000/adduser", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                fname: formData.firstName,
                lname: formData.lastName,
                email: formData.email,
                password: formData.password,
            }),
        });

        if (response.ok) {
            const result = await response.json();
            console.log("Server Response:", result);
            alert("Account created successfully!");
            setError(""); // Clear any previous errors
        } else if (response.status === 409) {
            // Handle duplicate email error
            const errorData = await response.json();
            setError(errorData.message);
        } else {
            console.error("Error creating account:", response.statusText);
            alert("Failed to create account.");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("An error occurred while creating the account.");
    }
  };

  return (
    <div className="container">
      <img
        className="meal-image"
        src="/assets/frontimage.png"
        alt="Delicious Meal"
      />
      <div className="left-panel">
        <h1 className="createtext">Create Account</h1>
        <img
          className="image-container"
          src="/assets/background.png"
          alt="Hello"
        />
      </div>
      <div className="right-panel">
        <div className="form-container">
          <h1>Create Account</h1>
          <form onSubmit={handleSubmit}>
            <div className="name">
              <div className="input-group">
                <label htmlFor="firstName">First Name</label>
                <input
                  id="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </div>
              <div className="input-group">
                <label htmlFor="lastName">Last Name</label>
                <input
                  id="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>
            </div>
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

            {/* Display error message */}
            {error && <p className="error-text">{error}</p>}

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
            Already have an Account? <Link to="/signin">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AccountCreationPage;
