import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";

export default function Header({ title = "Giki Mess Management System" }) {
  const userData = JSON.parse(localStorage.getItem("userData")) || {
    name: "Guest",
  };

  return (
    <header className="app-header">
      <div className="logo">
        <img
          src={process.env.PUBLIC_URL + "/assets/logo-pic.png"}
          alt="Logo"
          className="logo-img"
        />
        <span>{title}</span>
      </div>

      <div className="profile-section">
        <span className="user-fullname">{userData.name}</span>
      </div>
    </header>
  );
}
