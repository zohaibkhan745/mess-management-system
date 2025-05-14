// ✅ SignIn.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./SignIn.css";
import Button from "../../components/button.jsx";

const SignIn = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isReceptionist, setIsReceptionist] = useState(false);
  const navigate = useNavigate();

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
      // Use different endpoint based on user type
      const endpoint = isReceptionist 
        ? "http://localhost:4000/receptionist/signin" 
        : "http://localhost:4000/signin";
      
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        if (data.token) {
          localStorage.setItem("authToken", data.token);
          localStorage.setItem("userData", JSON.stringify(data.user));
          localStorage.setItem("userRole", isReceptionist ? "receptionist" : "student");
        }
        
        // Navigate based on user type
        if (isReceptionist) {
          navigate("/receptionist-dashboard");
        } else {
          // Check if profile is complete for students
          if (!data.user.profileComplete) {
            navigate("/complete-profile");
          } else {
            navigate("/dashboard");
          }
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
    <div className="container">
      <div className="content-wrapper">
        <img className="meal-image" src="/assets/sigininmeal.png" alt="Delicious Meal" />
        <div className="left-panel">
          <h1 className="createtext">Sign In</h1>
          <img className="image-container" src="/assets/background.png" alt="Hello" />
        </div>
        <div className="right-panel">
          <div className="form-container">
            <h1>Sign In</h1>
            
            {/* User type toggle */}
            <div className="user-type-toggle">
              <div className="toggle-container">
                <span className={!isReceptionist ? "active" : ""}>Student</span>
                <label className="switch">
                  <input 
                    type="checkbox" 
                    checked={isReceptionist} 
                    onChange={() => setIsReceptionist(!isReceptionist)}
                  />
                  <span className="slider round"></span>
                </label>
                <span className={isReceptionist ? "active" : ""}>Receptionist</span>
              </div>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? "error-input" : ""}
                  placeholder={isReceptionist ? "Receptionist email" : "Student email"}
                  autoComplete="username"
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
                  autoComplete="current-password"
                />
                {errors.password && <span className="error-message">{errors.password}</span>}
                <div className="forgot-password">
                  <Link to="/forgotpassword">Forgot Password?</Link>
                </div>
              </div>
              {errors.serverError && (
                <div className="server-error-message">{errors.serverError}</div>
              )}
              <div className="input-group">
                <Button
                  text={isSubmitting ? "Signing In..." : `Sign In as ${isReceptionist ? 'Receptionist' : 'Student'}`}
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
              Don't have an account? <Link to="/signup">Create Account</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;