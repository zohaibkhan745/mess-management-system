// ✅ SignIn.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./SignIn.css";
import { useAuth } from "../../contexts/AuthContext";

const SignIn = () => {
  const [formData, setFormData] = useState({ email: "", password: "", role: "student" });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
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

    try {
      const response = await fetch("http://localhost:4000/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          role: formData.role
        }),
      });
      const data = await response.json(); if (response.ok) {
        // Use the AuthContext login function
        login(data.user);

        // Redirect based on user role
        if (data.user.role === "receptionist") {
          navigate("/receptionist-dashboard");
        } else {
          navigate("/dashboard");
        }
      } else {
        setErrors({ ...errors, serverError: data.message || "Invalid email or password" });
      }
    } catch (error) {
      setErrors({ ...errors, serverError: "Network error. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="signin-container">
      <div className="signin-card">
        <h2 className="signin-heading">Sign In</h2>
        <form className="signin-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? "error-input" : ""}
              autoComplete="username"
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>              <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? "error-input" : ""}
              autoComplete="current-password"
            />                {errors.password && <span className="error-message">{errors.password}</span>}
          </div>
          <div className="forgot-password-link">
            <Link to="/forgotpassword">Forgot Password?</Link>
          </div><div className="input-group">
            <label>Sign in as</label>
            <div className="role-selection">
              <label className="role-option">
                <input
                  type="radio"
                  name="role"
                  value="student"
                  checked={formData.role === "student"}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                />
                Student
              </label>
              <label className="role-option">
                <input
                  type="radio"
                  name="role"
                  value="receptionist"
                  checked={formData.role === "receptionist"} onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                />
                Receptionist
              </label>
            </div>
          </div>
          {errors.serverError && (
            <div className="server-error-message">{errors.serverError}</div>
          )}              <div className="input-group">
            <button
              type="submit"
              className="signin-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Signing In..." : "Sign In"}
            </button>
          </div>
        </form>            <div className="signin-links">
          <p>Don't have an account? <Link to="/signup">Create Account</Link></p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;