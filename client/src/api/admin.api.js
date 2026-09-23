import api from "./axios.js";

// ==========================================
// Admin API — all admin-only endpoints
// ==========================================
export const adminApi = {
  // ==========================================
  // Dashboard stats
  // ==========================================
  getStats: () => api.get("/admin/stats"),

  // ==========================================
  // Users list (paginated later)
  // ==========================================
  getUsers: () => api.get("/admin/users"),

  // ==========================================
  // Single user by id
  // ==========================================
  getUser: (id) => api.get(`/admin/users/${id}`),

  // ==========================================
  // Update user (name, email, role)
  // ==========================================
  updateUser: (id, data) => api.patch(`/admin/users/${id}`, data),

  // ==========================================
  // Delete user
  // ==========================================
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
};