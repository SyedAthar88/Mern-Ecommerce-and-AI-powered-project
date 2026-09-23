import { createContext, useState, useEffect, useCallback } from "react";
import api from "../api/axios.js";
import { authApi } from "../api/auth.api.js";

// ==========================================
// Create the context
// ==========================================
export const AuthContext = createContext(null);

// ==========================================
// Module-level bootstrap promise
// Guarantees bootstrap runs only ONCE even with React StrictMode
// double-invoking effects in development.
// ==========================================
let bootstrapPromise = null;

const runBootstrap = () => {
  // Already started → return the same promise
  if (bootstrapPromise) return bootstrapPromise;

  // Start bootstrap and store the promise
  bootstrapPromise = (async () => {
    try {
      // 1. Try refresh — if refresh cookie is valid, we're logged in
      await authApi.refresh();

      // 2. Fetch user with fresh access token
      const res = await api.get("/users/me");
      return res.data.data.user;
    } catch {
      // No valid refresh cookie → user is not logged in
      return null;
    }
  })();

  return bootstrapPromise;
};

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
    let cancelled = false;

    runBootstrap().then((bootstrapUser) => {
      // Don't update state if component unmounted
      if (cancelled) return;
      setUser(bootstrapUser);
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  // ==========================================
  // Logout listener: clears user when interceptor
  // dispatches "auth:logout" (refresh failed)
  // ==========================================
  useEffect(() => {
    const handleLogout = () => setUser(null);
    window.addEventListener("auth:logout", handleLogout);
    return () => window.removeEventListener("auth:logout", handleLogout);
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
    return res.data.data.user; // note: signup doesn't auto-login
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
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};