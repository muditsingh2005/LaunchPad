import React from "react";
import { Link, useLocation } from "react-router-dom";
import { motion as Motion, AnimatePresence } from "framer-motion";
import "./Sidebar.css";

const Sidebar = ({ user, loading, onLogout, isOpen, onClose }) => {
  const location = useLocation();

  // Navigation items based on role
  const getNavItems = () => {
    const baseItems = [{ path: "/dashboard", label: "Dashboard", icon: "📊" }];

    if (user?.role === "student") {
      return [
        ...baseItems,
        { path: "/dashboard/projects", label: "Browse Projects", icon: "🔍" },
        {
          path: "/dashboard/applications",
          label: "My Applications",
          icon: "📝",
        },
        { path: "/dashboard/profile", label: "Profile", icon: "👤" },
      ];
    } else if (user?.role === "startup") {
      return [
        ...baseItems,
        { path: "/dashboard/post-project", label: "Post Project", icon: "➕" },
        { path: "/dashboard/my-projects", label: "My Projects", icon: "📋" },
        {
          path: "/dashboard/hired-students",
          label: "Hired Students",
          icon: "👥",
        },
        { path: "/dashboard/profile", label: "Profile", icon: "👤" },
      ];
    }

    return baseItems;
  };

  const navItems = getNavItems();

  return (
    <>
      {/* Overlay for mobile */}
      <AnimatePresence>
        {isOpen && (
          <Motion.div
            className="sidebar-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <Motion.aside
        className={`sidebar ${isOpen ? "sidebar-open" : ""}`}
        initial={{ x: -280 }}
        animate={{ x: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="sidebar-header">
          <h2 className="sidebar-logo">Campus Freelance Hub</h2>
          <button className="sidebar-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* User Profile Section */}
        <div className="sidebar-profile">
          {loading ? (
            <div className="profile-skeleton">
              <div className="skeleton-avatar"></div>
              <div className="skeleton-text"></div>
            </div>
          ) : (
            <>
              <div className="profile-avatar">
                {user?.profileImage ? (
                  <img src={user.profileImage} alt={user?.name} />
                ) : (
                  <div className="avatar-placeholder">
                    {user?.name?.charAt(0).toUpperCase() || "?"}
                  </div>
                )}
              </div>
              <div className="profile-info">
                <h3 className="profile-name">{user?.name || "User"}</h3>
                <span className="profile-role">
                  {user?.role === "student" ? "🎓 Student" : "🚀 Startup"}
                </span>
                {user?.department && (
                  <p className="profile-meta">{user.department}</p>
                )}
                {user?.founderName && (
                  <p className="profile-meta">Founder: {user.founderName}</p>
                )}
              </div>
            </>
          )}
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${
                location.pathname === item.path ? "nav-item-active" : ""
              }`}
              onClick={onClose}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="sidebar-footer">
          <button className="logout-btn" onClick={onLogout}>
            <span className="logout-icon">🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </Motion.aside>
    </>
  );
};

export default Sidebar;
