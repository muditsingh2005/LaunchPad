import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import "./RoleSelection.css";

const RoleSelection = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(null);

  const roles = [
    {
      id: "student",
      title: "Student",
      icon: "🎓",
      description:
        "Find freelance projects, build your portfolio, and earn while learning",
      benefits: [
        "Browse projects",
        "Build portfolio",
        "Earn money",
        "Gain experience",
      ],
    },
    {
      id: "startup",
      title: "Startup",
      icon: "🚀",
      description: "Post projects and hire talented students from your campus",
      benefits: [
        "Post projects",
        "Hire students",
        "Manage team",
        "Track progress",
      ],
    },
  ];

  const handleRoleSelect = (roleId) => {
    setSelectedRole(roleId);
  };

  const handleContinue = () => {
    if (selectedRole) {
      navigate(`/register/${selectedRole}`);
    }
  };

  return (
    <div className="auth-container">
      <motion.div
        className="role-selection-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="auth-header">
          <motion.div
            className="auth-logo"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            🚀
          </motion.div>
          <h1 className="auth-title">Join Campus Freelance Hub</h1>
          <p className="auth-subtitle">Choose your role to get started</p>
        </div>

        {/* Role Cards */}
        <div className="role-cards">
          {roles.map((role, index) => (
            <motion.div
              key={role.id}
              className={`role-card ${
                selectedRole === role.id ? "role-card-selected" : ""
              }`}
              onClick={() => handleRoleSelect(role.id)}
              initial={{ opacity: 0, x: index === 0 ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
              whileHover={{ y: -8 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="role-card-header">
                <div className="role-icon">{role.icon}</div>
                <h3 className="role-title">{role.title}</h3>
              </div>
              <p className="role-description">{role.description}</p>
              <ul className="role-benefits">
                {role.benefits.map((benefit, idx) => (
                  <li key={idx}>
                    <span className="benefit-icon">✓</span>
                    {benefit}
                  </li>
                ))}
              </ul>
              {selectedRole === role.id && (
                <motion.div
                  className="role-selected-badge"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  Selected ✓
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Continue Button */}
        <motion.button
          className={`role-continue-btn ${
            selectedRole ? "role-continue-btn-active" : ""
          }`}
          onClick={handleContinue}
          disabled={!selectedRole}
          whileHover={{ scale: selectedRole ? 1.02 : 1 }}
          whileTap={{ scale: selectedRole ? 0.98 : 1 }}
        >
          Continue
        </motion.button>

        {/* Footer */}
        <div className="auth-footer">
          <p>
            Already have an account?{" "}
            <Link to="/login" className="auth-link-bold">
              Login
            </Link>
          </p>
        </div>
      </motion.div>

      {/* Background decoration */}
      <div className="auth-bg-decoration">
        <div className="auth-bg-circle circle-1"></div>
        <div className="auth-bg-circle circle-2"></div>
        <div className="auth-bg-circle circle-3"></div>
      </div>
    </div>
  );
};

export default RoleSelection;
