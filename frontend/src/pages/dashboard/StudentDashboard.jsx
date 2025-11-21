import React from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Button from "../../components/common/Button";
import "./Dashboard.css";

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Student Dashboard</h1>
        <Button onClick={handleLogout} variant="secondary" size="small">
          Logout
        </Button>
      </div>

      <div className="dashboard-content">
        <div className="welcome-card">
          <h2>Welcome, {user?.name}! 🎓</h2>
          <p>Email: {user?.email}</p>
          <p>Department: {user?.department}</p>
          <p>Year: {user?.year}</p>
          {user?.skills && user.skills.length > 0 && (
            <div className="skills-section">
              <p>
                <strong>Skills:</strong>
              </p>
              <div className="skills-tags">
                {user.skills.map((skill, index) => (
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
      </div>
    </div>
  );
};

export default StudentDashboard;
