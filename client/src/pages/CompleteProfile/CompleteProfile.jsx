import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/button.jsx";
import "./CompleteProfile.css";

const CompleteProfile = () => {
  const [formData, setFormData] = useState({
    degree: "",
    hostelName: ""
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  
  // Predefined lists of departments and hostels
  const departments = [
    "Software Engineering",
    "Computer Science",
    "Electrical Engineering",
    "Mechanical Engineering",
    "Materials Engineering",
    "Engineering Sciences",
    "Management Sciences",
    "Artificial Intelligence"
  ];
  
  const hostels = [
    "H1",
    "H2",
    "H3",
    "H4",
    "H5",
    "H6",
    "H7",
    "H8",
    "H9",
    "H10",
    "H11",
    "H12",
    "Hostel 9"
  ];
  
  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("authToken");
    const userData = localStorage.getItem("userData");
    
    if (!token || !userData) {
      navigate("/signin");
    }
  }, [navigate]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.degree) {
      newErrors.degree = "Department is required";
    }
    if (!formData.hostelName) {
      newErrors.hostelName = "Hostel name is required";
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
      const userData = JSON.parse(localStorage.getItem("userData"));
      const regNo = userData?.regNo;
      
      if (!regNo) {
        setErrors({ serverError: "User information not found. Please log in again." });
        return;
      }

      console.log("Sending profile completion data:", {
        regNo,
        degree: formData.degree,
        hostelName: formData.hostelName
      });

      const response = await fetch("http://localhost:4000/complete-profile", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("authToken")}`
        },
        body: JSON.stringify({
          regNo: regNo,
          degree: formData.degree,
          hostelName: formData.hostelName
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        // Update local storage with new user data
        localStorage.setItem("userData", JSON.stringify({
          ...userData,
          degree: formData.degree,
          hostelName: formData.hostelName,
          profileComplete: true
        }));
        
        navigate("/dashboard");
      } else {
        // Show more detailed error info
        console.error("Profile completion error:", data);
        setErrors({ 
          serverError: data.message || "Failed to complete profile" 
        });
      }
    } catch (error) {
      console.error("Network error:", error);
      setErrors({ serverError: "Network error. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="complete-profile-container">
      <div className="form-wrapper">
        <h1>Complete Your Profile</h1>
        <p>Please provide the following information to complete your registration</p>
        
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="degree">Department</label>
            <select
              id="degree"
              value={formData.degree}
              onChange={handleChange}
              className={errors.degree ? "error-input" : ""}
            >
              <option value="">Select your department</option>
              {departments.map((dept, index) => (
                <option key={index} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
            {errors.degree && <span className="error-message">{errors.degree}</span>}
          </div>

          <div className="input-group">
            <label htmlFor="hostelName">Hostel Name</label>
            <select
              id="hostelName"
              value={formData.hostelName}
              onChange={handleChange}
              className={errors.hostelName ? "error-input" : ""}
            >
              <option value="">Select your hostel</option>
              {hostels.map((hostel, index) => (
                <option key={index} value={hostel}>
                  {hostel}
                </option>
              ))}
            </select>
            {errors.hostelName && <span className="error-message">{errors.hostelName}</span>}
          </div>

          {errors.serverError && <div className="server-error">{errors.serverError}</div>}

          <div className="button-container">
            <Button
              text={isSubmitting ? "Saving..." : "Complete Profile"}
              className="submit-btn"
              disabled={isSubmitting}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompleteProfile;