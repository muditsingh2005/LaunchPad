import React from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Button from "../../components/common/Button";
import "./Dashboard.css";

const StartupDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Startup Dashboard</h1>
        <Button onClick={handleLogout} variant="secondary" size="small">
          Logout
        </Button>
      </div>

      <div className="dashboard-content">
        <div className="welcome-card">
          <h2>Welcome, {user?.name}! 🚀</h2>
          <p>Email: {user?.email}</p>
          <p>Founder: {user?.founderName}</p>
          {user?.description && (
            <p>
              <strong>About:</strong> {user.description}
            </p>
          )}
        </div>

        <div className="info-card">
          <h3>📋 Post Your First Project</h3>
          <p>
            Start hiring talented students from your campus by posting projects.
          </p>
        </div>
      </div>
    </div>
  );
};

export default StartupDashboard;
