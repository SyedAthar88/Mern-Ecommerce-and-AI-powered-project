import axios from "axios";

// ==========================================
// Axios instance
// ==========================================
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  withCredentials: true,   // ⚠️ sends cookies automatically
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,          // 15s timeout — fail fast if backend is down
});

// ==========================================
// Response interceptor (scaffold — real logic in Phase 13)
// ==========================================
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Phase 13 will add auto-refresh on 401 here.
    // For now, just pass the error through.
    return Promise.reject(error);
  }
);

export default api;