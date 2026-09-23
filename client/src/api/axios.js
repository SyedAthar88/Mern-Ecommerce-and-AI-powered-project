import axios from "axios";

// ==========================================
// Axios instance
// ==========================================
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

// ==========================================
// URLs that should NOT trigger a token refresh
// on 401 (because 401 means something else there)
// ==========================================
const SKIP_REFRESH_URLS = [
  "/auth/login",
  "/auth/signup",
  "/auth/refresh",
  "/auth/logout",
  "/auth/forgot-password",
  "/auth/reset-password",
];

// ==========================================
// Refresh queue state
// - isRefreshing: true while a refresh is in progress
// - pendingQueue: requests waiting for the refresh to finish
// ==========================================
let isRefreshing = false;
let pendingQueue = [];

// ==========================================
// Helper: resolve or reject all queued requests
// ==========================================
const processQueue = (error) => {
  pendingQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve();
  });
  pendingQueue = [];
};

// ==========================================
// RESPONSE INTERCEPTOR
// Handles 401 → refresh token → retry
// ==========================================
api.interceptors.response.use(
  // ------------------------------------------
  // Success handler — do nothing, pass through
  // ------------------------------------------
  (response) => response,

  // ------------------------------------------
  // Error handler — the interesting part
  // ------------------------------------------
  async (error) => {
    const originalRequest = error.config;

    // ---- Rule 1: No config → can't retry ----
    if (!originalRequest) {
      return Promise.reject(error);
    }

    // ---- Rule 2: Only handle 401 ----
    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    // ---- Rule 3: Skip certain URLs ----
    const url = originalRequest.url || "";
    const shouldSkip = SKIP_REFRESH_URLS.some((skip) => url.includes(skip));
    if (shouldSkip) {
      return Promise.reject(error);
    }

    // ---- Rule 4: Already retried → don't loop ----
    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    // ---- Rule 5: Another refresh is already running → queue ----
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        pendingQueue.push({ resolve, reject });
      })
        .then(() => api(originalRequest))
        .catch((err) => Promise.reject(err));
    }

    // ---- Rule 6: Start the refresh ----
    originalRequest._retry = true;
    isRefreshing = true;

    try {
      // Call refresh endpoint (cookies handle the rest)
      await api.post("/auth/refresh");

      // Success: resolve all queued requests
      processQueue(null);

      // Retry the original request
      return api(originalRequest);
    } catch (refreshError) {
      // Refresh failed (refresh token expired / revoked)
      // Reject all queued requests
      processQueue(refreshError);

      // Signal to the app that the user must log in again
      window.dispatchEvent(new Event("auth:logout"));

      return Promise.reject(refreshError);
    } finally {
      // Always reset the flag
      isRefreshing = false;
    }
  }
);

export default api;