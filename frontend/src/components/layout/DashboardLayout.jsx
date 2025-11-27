import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import "./DashboardLayout.css";

const DashboardLayout = () => {
  const { user: authUser, logout } = useAuth();
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const fetchUserProfile = React.useCallback(async () => {
    if (!authUser?.role) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Determine endpoint based on role
      const endpoint =
        authUser.role === "student"
          ? "/api/v2/student/profile"
          : "/api/v3/startup/profile";

      const response = await api.get(endpoint);

      if (response.data && response.data.success) {
        setUserProfile(response.data.data);
      } else {
        setError("Failed to load profile");
      }
    } catch (err) {
      console.error("Error fetching user profile:", err);
      setError(err.response?.data?.message || "Failed to load profile data");

      // If profile fetch fails with 401/403, logout
      if (err.response?.status === 401 || err.response?.status === 403) {
        await logout();
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  }, [authUser, logout, navigate]);

  React.useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      console.error("Logout error:", err);
      navigate("/login");
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="dashboard-layout">
      <Sidebar
        user={userProfile || authUser}
        loading={loading}
        onLogout={handleLogout}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onProfileUpdate={fetchUserProfile}
      />

      <div className="dashboard-main">
        <Topbar user={userProfile || authUser} onMenuToggle={toggleSidebar} />

        <Motion.main
          className="dashboard-content-wrapper"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {loading ? (
            <div className="dashboard-loading">
              <div className="loading-spinner"></div>
              <p>Loading your dashboard...</p>
            </div>
          ) : error ? (
            <div className="dashboard-error">
              <div className="error-icon">⚠️</div>
              <h3>Unable to load dashboard</h3>
              <p>{error}</p>
              <button onClick={fetchUserProfile} className="retry-btn">
                Retry
              </button>
            </div>
          ) : (
            <Outlet
              context={{ userProfile, refreshProfile: fetchUserProfile }}
            />
          )}
        </Motion.main>
      </div>
    </div>
  );
};

export default DashboardLayout;
