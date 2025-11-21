import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Landing
import { LandingPage } from "./components/landing";

// Auth Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import RoleSelection from "./pages/auth/RoleSelection";

// Dashboard Pages
import StudentDashboard from "./pages/dashboard/StudentDashboard";
import StartupDashboard from "./pages/dashboard/StartupDashboard";

import "./App.css";

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<RoleSelection />} />
            <Route path="/register/:role" element={<Register />} />

            {/* Protected Student Routes */}
            <Route
              path="/student/dashboard"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />

            {/* Protected Startup Routes */}
            <Route
              path="/startup/dashboard"
              element={
                <ProtectedRoute allowedRoles={["startup"]}>
                  <StartupDashboard />
                </ProtectedRoute>
              }
            />

            {/* Catch all - redirect to landing */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
