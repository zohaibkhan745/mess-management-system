import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Menu.css";

export default function Menu() {
  const [menuData, setMenuData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get user data from localStorage
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      const parsedUser = JSON.parse(storedUserData);
      setUserData(parsedUser);
    } else {
      // Redirect to login if no user data found
      navigate("/signin");
    }

    // Fetch menu data
    fetch("http://localhost:4000/menu")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch menu");
        return res.json();
      })
      .then((data) => {
        setMenuData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [navigate]);

  return (
    <div className="menu-container">
      <header className="menu-header">
        <div className="logo">
          <img
            src={process.env.PUBLIC_URL + "/assets/logo-pic.png"}
            alt="Logo"
            className="logo-img"
          />
          <span>Giki Mess Management System</span>
        </div>
        <div className="profile-icon">
          <div className="avatar">{userData?.name?.[0] || "A"}</div>
        </div>
      </header>

      <div className="menu-content">
        <div className="menu-card">
          <Link to="/dashboard" className="back-button">
            <span>←</span>
          </Link>

          <h1 className="card-title">Mess Menu</h1>

          <div className="menu-table-container">
            {loading ? (
              <p>Loading menu...</p>
            ) : error ? (
              <p style={{ color: "red" }}>{error}</p>
            ) : (
              <table className="menu-table">
                <thead>
                  <tr>
                    <th>Days</th>
                    <th>Breakfast</th>
                    <th>Lunch</th>
                    <th>Dinner</th>
                  </tr>
                </thead>
                <tbody>
                  {menuData.map((item, index) => (
                    <tr key={index}>
                      <td>{item.day}</td>
                      <td>{item.breakfast}</td>
                      <td>{item.lunch}</td>
                      <td>{item.dinner}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
