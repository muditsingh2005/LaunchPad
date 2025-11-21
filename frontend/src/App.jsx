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

// Dashboard Layout
import DashboardLayout from "./components/layout/DashboardLayout";
import DashboardRouter from "./pages/dashboard/DashboardRouter";

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

            {/* Protected Dashboard with Layout */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<DashboardRouter />} />
            </Route>

            {/* Legacy Routes - Redirect to /dashboard */}
            <Route
              path="/student/dashboard"
              element={<Navigate to="/dashboard" replace />}
            />
            <Route
              path="/startup/dashboard"
              element={<Navigate to="/dashboard" replace />}
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
