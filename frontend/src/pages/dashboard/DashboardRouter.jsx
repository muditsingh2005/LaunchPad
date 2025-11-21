import React from "react";
import { useAuth } from "../../context/AuthContext";
import StudentDashboard from "./StudentDashboard";
import StartupDashboard from "./StartupDashboard";

const DashboardRouter = () => {
  const { user } = useAuth();

  if (user?.role === "student") {
    return <StudentDashboard />;
  } else if (user?.role === "startup") {
    return <StartupDashboard />;
  }

  return (
    <div style={{ padding: "2rem", color: "white", textAlign: "center" }}>
      <h2>Unknown Role</h2>
      <p>Please contact support.</p>
    </div>
  );
};

export default DashboardRouter;
