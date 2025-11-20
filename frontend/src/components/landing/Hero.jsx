import React from "react";
import "./Hero.css";

const Hero = () => {
  return (
    <section className="hero" id="home">
      <div className="hero-container">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Connect Campus <span className="gradient-text">Startups</span>{" "}
              with Talented <span className="gradient-text">Students</span>
            </h1>
            <p className="hero-subtitle">
              The ultimate platform where college students discover real
              freelancing opportunities from innovative campus startups. Build
              your portfolio, earn money, and grow your skills.
            </p>
            <div className="hero-buttons">
              <button className="btn-primary">
                <span>Find Projects</span>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M7.5 15L12.5 10L7.5 5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <button className="btn-secondary">
                <span>Post Project</span>
              </button>
            </div>
            <div className="hero-stats">
              <div className="stat-item">
                <div className="stat-number">500+</div>
                <div className="stat-label">Active Projects</div>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <div className="stat-number">2000+</div>
                <div className="stat-label">Students</div>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <div className="stat-number">150+</div>
                <div className="stat-label">Startups</div>
              </div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="visual-container">
              <div className="floating-card card-1">
                <div className="card-icon">💼</div>
                <div className="card-text">
                  <div className="card-title">Web Development</div>
                  <div className="card-subtitle">$500 - $1500</div>
                </div>
              </div>
              <div className="floating-card card-2">
                <div className="card-icon">🎨</div>
                <div className="card-text">
                  <div className="card-title">UI/UX Design</div>
                  <div className="card-subtitle">$400 - $1200</div>
                </div>
              </div>
              <div className="floating-card card-3">
                <div className="card-icon">📱</div>
                <div className="card-text">
                  <div className="card-title">App Development</div>
                  <div className="card-subtitle">$800 - $2000</div>
                </div>
              </div>
              <div className="hero-shape shape-1"></div>
              <div className="hero-shape shape-2"></div>
              <div className="hero-shape shape-3"></div>
            </div>
          </div>
        </div>
      </div>
      <div className="hero-gradient-bg"></div>
    </section>
  );
};

export default Hero;
