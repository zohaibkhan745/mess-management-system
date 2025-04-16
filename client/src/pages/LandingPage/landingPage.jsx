import React from 'react';
import './landingPage.css';
import { Link, useNavigate } from 'react-router-dom';
// Use the same image path you've already implemented
const foodImage = '../../assets/landingPage.jpg';
const LogoImg = '../../assets/logo-pic.png';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/signup');
  };

  return (
    <div className="landing-page">
      <header className="header">
        <div className="logo">
          <div className="logo-icon">
          <img className="logo-icn" src={LogoImg} alt="Delicious meal in a blue-rimmed bowl" />
          </div>
          <span className="logo-text">Giki Mess Management System</span>
        </div>
        <nav className="nav-menu">
          <ul>
            <li><a href="#about">about</a></li>
            <li><a href="#pricing">pricing</a></li>
            <li><a href="#contact">contact</a></li>
          </ul>
        </nav>
        <div className="auth-buttons">
          <Link to="/signin">
            <button className="sign-in">Sign In</button>
          </Link>
          <Link to="/signup">
            <button className="sign-up">Sign Up</button>
          </Link>
        </div>
      </header>

      <main className="hero-section">
        <div className="hero-content">
          <h1>Simplify Your Daily<br />Mess Tasks with Ease</h1>
          <p>Efficiently manage mess operations, from attendance<br />to billing, all in one place.</p>
          <button className="get-started" onClick={handleGetStarted}>Get Started</button>
        </div>
        <div className="hero-image">
          <img src={foodImage} alt="Delicious meal in a blue-rimmed bowl" />
        </div>
      </main>
    </div>
  );
};

export default LandingPage;