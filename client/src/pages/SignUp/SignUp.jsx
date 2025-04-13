import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./SignUp.css";
import Button from "../../components/button.jsx";

const SignUp = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    } else if (formData.firstName.length < 2) {
      newErrors.firstName = "First name must be at least 2 characters";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
    
    // Clear error when user starts typing
    if (errors[id]) {
      setErrors({ ...errors, [id]: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setSuccessMessage("");

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

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage("Account created successfully! Redirecting to login...");
        setTimeout(() => navigate("/signin"), 2000);
      } else {
        setErrors({ 
          ...errors, 
          serverError: data.message || "Failed to create account" 
        });
      }
    } catch (error) {
      setErrors({ 
        ...errors, 
        serverError: "Network error. Please try again." 
      });
    } finally {
      setIsSubmitting(false);
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
                  className={errors.firstName ? "error-input" : ""}
                />
                {errors.firstName && <span className="error-message">{errors.firstName}</span>}
              </div>
              <div className="input-group">
                <label htmlFor="lastName">Last Name</label>
                <input
                  id="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={errors.lastName ? "error-input" : ""}
                />
                {errors.lastName && <span className="error-message">{errors.lastName}</span>}
              </div>
            </div>
            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? "error-input" : ""}
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>
            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? "error-input" : ""}
              />
              {errors.password && <span className="error-message">{errors.password}</span>}
              <div className="password-hint">
                (Must be at least 8 characters)
              </div>
            </div>
            <div className="input-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={errors.confirmPassword ? "error-input" : ""}
              />
              {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
            </div>

            {errors.serverError && (
              <div className="server-error-message">{errors.serverError}</div>
            )}

            {successMessage && (
              <div className="success-message">{successMessage}</div>
            )}

            <div className="input-group">
              <Button 
                text={isSubmitting ? "Creating Account..." : "Create Account"} 
                className="create-btn" 
                disabled={isSubmitting}
              />
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
}

export default SignUp;