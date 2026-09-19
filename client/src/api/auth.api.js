import api from "./axios.js";

// ==========================================
// Auth API endpoints
// ==========================================
export const authApi = {
  // ==========================================
  // Signup — create new account
  // ==========================================
  signup: (data) => api.post("/auth/signup", data),

  // ==========================================
  // Login — authenticate & receive cookies
  // ==========================================
  login: (data) => api.post("/auth/login", data),

  // ==========================================
  // Logout — clear cookies & DB refresh token
  // ==========================================
  logout: () => api.post("/auth/logout"),

  // ==========================================
  // Refresh — get new access token
  // ==========================================
  refresh: () => api.post("/auth/refresh"),

  // ==========================================
  // Forgot password — send reset email
  // ==========================================
  forgotPassword: (data) => api.post("/auth/forgot-password", data),

  // ==========================================
  // Reset password — set new password with token
  // ==========================================
  resetPassword: (token, data) =>
    api.post(`/auth/reset-password/${token}`, data),
};