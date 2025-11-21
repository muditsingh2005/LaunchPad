import React from "react";
import { useOutletContext } from "react-router-dom";
import { motion } from "framer-motion";
import "./Dashboard.css";

const StartupDashboard = () => {
  const { userProfile } = useOutletContext();

  return (
    <div className="dashboard">
      <motion.div
        className="dashboard-content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="welcome-card">
          <h2>Welcome back, {userProfile?.name}! 🚀</h2>
          <div className="user-details">
            <p>
              <strong>Email:</strong> {userProfile?.email}
            </p>
            <p>
              <strong>Founder:</strong> {userProfile?.founderName}
            </p>
            {userProfile?.website && (
              <p>
                <strong>Website:</strong>{" "}
                <a
                  href={userProfile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {userProfile.website}
                </a>
              </p>
            )}
            {userProfile?.description && (
              <p>
                <strong>About:</strong> {userProfile.description}
              </p>
            )}
          </div>
        </div>

        <div className="info-card">
          <h3>📋 Post Your First Project</h3>
          <p>
            Start hiring talented students from your campus by posting projects.
          </p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📋</div>
            <h4>Posted Projects</h4>
            <p className="stat-number">0</p>
          </div>
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <h4>Hired Students</h4>
            <p className="stat-number">0</p>
          </div>
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <h4>Completed</h4>
            <p className="stat-number">0</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default StartupDashboard;
