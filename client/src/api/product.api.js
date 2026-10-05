import api from "./axios.js";

// ==========================================
// Product API — all product endpoints
// ==========================================
export const productApi = {
  // ---- Public ----
  getPublic: (params) => api.get("/products", { params }),
  getPublicBySlug: (slug) => api.get(`/products/${slug}`),

  // ---- Admin ----
  getAll: (params) => api.get("/admin/products", { params }),
  getById: (id) => api.get(`/admin/products/${id}`),
  create: (data) => api.post("/admin/products", data),
  update: (id, data) => api.patch(`/admin/products/${id}`, data),
  delete: (id) => api.delete(`/admin/products/${id}`),
};