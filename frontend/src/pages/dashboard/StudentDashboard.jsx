import React from "react";
import { useOutletContext } from "react-router-dom";
import { motion } from "framer-motion";
import "./Dashboard.css";

const StudentDashboard = () => {
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
          <h2>Welcome back, {userProfile?.name}! 🎓</h2>
          <div className="user-details">
            <p>
              <strong>Email:</strong> {userProfile?.email}
            </p>
            <p>
              <strong>Roll No:</strong> {userProfile?.rollNo}
            </p>
            <p>
              <strong>Department:</strong> {userProfile?.department}
            </p>
            <p>
              <strong>Year:</strong> {userProfile?.year}
            </p>
            {userProfile?.bio && (
              <p>
                <strong>Bio:</strong> {userProfile.bio}
              </p>
            )}
          </div>

          {userProfile?.skills && userProfile.skills.length > 0 && (
            <div className="skills-section">
              <p>
                <strong>Your Skills:</strong>
              </p>
              <div className="skills-tags">
                {userProfile.skills.map((skill, index) => (
                  <span key={index} className="skill-tag">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="info-card">
          <h3>🚀 Start Your Freelancing Journey</h3>
          <p>
            Browse available projects, apply, and start building your portfolio.
          </p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📝</div>
            <h4>Applications</h4>
            <p className="stat-number">0</p>
          </div>
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <h4>Accepted</h4>
            <p className="stat-number">0</p>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🏆</div>
            <h4>Completed</h4>
            <p className="stat-number">0</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default StudentDashboard;
