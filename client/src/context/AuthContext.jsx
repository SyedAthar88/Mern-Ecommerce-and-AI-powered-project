import { createContext, useState, useEffect, useCallback } from "react";
import api from "../api/axios.js";
import { authApi } from "../api/auth.api.js";

// ==========================================
// Create the context
// ==========================================
export const AuthContext = createContext(null);

// ==========================================
// Provider component
// ==========================================
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ==========================================
  // Bootstrap: check auth on app load
  // ==========================================
  useEffect(() => {
    const bootstrap = async () => {
      try {
        // Try to fetch current user. If access token expired,
        // the interceptor (Phase 13) will refresh it automatically.
        const res = await api.get("/users/me");
        setUser(res.data.data.user);
      } catch {
        // Not logged in → user stays null
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    bootstrap();
  }, []);

  // ==========================================
  // login
  // ==========================================
  const login = useCallback(async (email, password) => {
    const res = await authApi.login({ email, password });
    const loggedInUser = res.data.data.user;
    setUser(loggedInUser);
    return loggedInUser;
  }, []);

  // ==========================================
  // signup
  // ==========================================
  const signup = useCallback(async (data) => {
    const res = await authApi.signup(data);
    return res.data.data.user;   // note: signup doesn't auto-login
  }, []);

  // ==========================================
  // logout
  // ==========================================
  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } finally {
      setUser(null);
    }
  }, []);

  // ==========================================
  // refreshUser — re-fetch from backend
  // ==========================================
  const refreshUser = useCallback(async () => {
    const res = await api.get("/users/me");
    setUser(res.data.data.user);
    return res.data.data.user;
  }, []);

  // ==========================================
  // Context value
  // ==========================================
  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    refreshUser,
    setUser,   // exposed for special cases (used by guards)
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};