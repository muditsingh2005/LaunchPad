import React from "react";
import { motion as Motion } from "framer-motion";
import "./Topbar.css";

const Topbar = ({ user, onMenuToggle }) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <Motion.header
      className="topbar"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="topbar-left">
        <button className="menu-toggle-btn" onClick={onMenuToggle}>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>

        <div className="topbar-greeting">
          <h2>
            <span className="greeting-text">
              {getGreeting()}, {user?.name?.split(" ")[0] || "User"}!
            </span>{" "}
            <span className="greeting-emoji">👋</span>
          </h2>
          <p>
            {user?.role === "student"
              ? "Ready to explore projects?"
              : "Manage your projects"}
          </p>
        </div>
      </div>

      <div className="topbar-right">
        {/* Notifications */}
        <button className="topbar-icon-btn" title="Notifications">
          <span className="notification-icon">🔔</span>
          <span className="notification-badge">3</span>
        </button>

        {/* User Avatar */}
        <div className="topbar-user">
          {user?.profileImage ? (
            <img
              src={user.profileImage}
              alt={user?.name}
              className="topbar-avatar"
            />
          ) : (
            <div className="topbar-avatar-placeholder">
              {user?.name?.charAt(0).toUpperCase() || "?"}
            </div>
          )}
        </div>
      </div>
    </Motion.header>
  );
};

export default Topbar;
