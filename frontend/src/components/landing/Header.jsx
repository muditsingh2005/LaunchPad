import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Header.css";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogin = () => {
    navigate("/login");
  };

  const handleSignup = () => {
    navigate("/register");
  };

  return (
    <header className={`header ${scrolled ? "scrolled" : ""}`}>
      <div className="header-container">
        <div className="logo" onClick={() => navigate("/")}>
          <span className="logo-icon">🚀</span>
          <span className="logo-text">Campus Freelance Hub</span>
        </div>

        <nav className="nav-links">
          <a href="#home" className="nav-link">
            Home
          </a>
          <a href="#projects" className="nav-link">
            Projects
          </a>
          <a href="#startups" className="nav-link">
            Startups
          </a>
          <a href="#students" className="nav-link">
            Students
          </a>
          <a href="#contact" className="nav-link">
            Contact
          </a>
        </nav>

        <div className="auth-buttons">
          <button className="btn-login" onClick={handleLogin}>
            Login
          </button>
          <button className="btn-signup" onClick={handleSignup}>
            Sign Up
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
