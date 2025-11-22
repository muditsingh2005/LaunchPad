import React, { createContext, useState, useEffect, useContext } from "react";
import authService from "../services/authService";
import useUserStore from "../store/useUserStore";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const {
    user: storeUser,
    setUser: setStoreUser,
    clearUser,
    setLoading: setStoreLoading,
  } = useUserStore();
  const [user, setUser] = useState(storeUser);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(!!storeUser);

  // Check authentication status on mount
  useEffect(() => {
    const initAuth = () => {
      const token = authService.getAccessToken();
      const userData = authService.getUser();

      if (token && userData) {
        setUser(userData);
        setStoreUser(userData);
        setIsAuthenticated(true);
      }

      setLoading(false);
      setStoreLoading(false);
    };

    initAuth();
  }, [setStoreUser, setStoreLoading]);

  // Sync local state with store
  useEffect(() => {
    if (storeUser) {
      setUser(storeUser);
      setIsAuthenticated(true);
    }
  }, [storeUser]);

  // Login function
  const login = async (email, password) => {
    const result = await authService.login(email, password);

    if (result.success) {
      setUser(result.user);
      setStoreUser(result.user);
      setIsAuthenticated(true);
    }

    return result;
  };

  // Register student function
  const registerStudent = async (userData) => {
    const result = await authService.registerStudent(userData);

    if (result.success) {
      setUser(result.user);
      setStoreUser(result.user);
      setIsAuthenticated(true);
    }

    return result;
  };

  // Register startup function
  const registerStartup = async (formData) => {
    const result = await authService.registerStartup(formData);

    if (result.success) {
      setUser(result.user);
      setStoreUser(result.user);
      setIsAuthenticated(true);
    }

    return result;
  };

  // Logout function
  const logout = async () => {
    await authService.logout();
    setUser(null);
    clearUser();
    setIsAuthenticated(false);
  };

  // Update user data
  const updateUser = (userData) => {
    setUser(userData);
    setStoreUser(userData);
    authService.setUser(userData);
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    registerStudent,
    registerStartup,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};

export default AuthContext;
