import React from "react";
import "../styles/components/Button.css"; // Optional: Style the button

const Button = ({ text, onClick, className }) => {
  return (
    <button className={`btn ${className}`} onClick={onClick}>
      {text}
    </button>
  );
};

export default Button;
