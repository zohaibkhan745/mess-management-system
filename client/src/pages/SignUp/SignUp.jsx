import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./SignUp.css";
import Button from "../../components/button.jsx";

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: "",
    regNumber: "",
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
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.regNumber.trim()) {
      newErrors.regNumber = "Registration number is required";
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
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          regNumber: formData.regNumber,
          email: formData.email,
          password: formData.password
        })
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
      <div className="content-wrapper">
        <img className="meal-image" src="/assets/frontimage.png" alt="Delicious Meal" />
        <div className="left-panel">
          <h1 className="createtext">Sign Up</h1>
          <img className="image-container" src="/assets/background.png" alt="Hello" />
        </div>
        <div className="right-panel">
          <div className="form-container">
            <h1>Create Account</h1>
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label htmlFor="name">Full Name</label>
                <input id="name" type="text" value={formData.name} onChange={handleChange} className={errors.name ? "error-input" : ""} />
                {errors.name && <span className="error-message">{errors.name}</span>}
              </div>

              <div className="input-group">
                <label htmlFor="regNumber">Registration Number</label>
                <input id="regNumber" type="text" value={formData.regNumber} onChange={handleChange} className={errors.regNumber ? "error-input" : ""} />
                {errors.regNumber && <span className="error-message">{errors.regNumber}</span>}
              </div>

              <div className="input-group">
                <label htmlFor="email">Email</label>
                <input id="email" type="email" value={formData.email} onChange={handleChange} className={errors.email ? "error-input" : ""} />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>

              <div className="input-group">
                <label htmlFor="password">Password</label>
                <input id="password" type="password" value={formData.password} onChange={handleChange} className={errors.password ? "error-input" : ""} />
                {errors.password && <span className="error-message">{errors.password}</span>}
                <div className="password-hint">(Must be at least 8 characters)</div>
              </div>

              <div className="input-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input id="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} className={errors.confirmPassword ? "error-input" : ""} />
                {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
              </div>

              {errors.serverError && <div className="server-error-message">{errors.serverError}</div>}
              {successMessage && <div className="success-message">{successMessage}</div>}

              <div className="input-group">
                <Button text={isSubmitting ? "Creating Account..." : "Create Account"} className="create-btn" disabled={isSubmitting} />
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
    </div>
  );
}

export default SignUp;
