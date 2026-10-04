import api from "./axios.js";

// ==========================================
// Category API — all category endpoints
// ==========================================
export const categoryApi = {
    // ---- Public ----
    getPublic: () => api.get("/categories"),
    getPublicBySlug: (slug) => api.get(`/categories/${slug}`),

    // ---- Admin ----
    getAll: () => api.get("/admin/categories"),
    getById: (id) => api.get(`/admin/categories/${id}`),
    create: (data) => api.post("/admin/categories", data),
    update: (id, data) => api.patch(`/admin/categories/${id}`, data),
    delete: (id) => api.delete(`/admin/categories/${id}`),
    getDropdown: () => api.get("/admin/categories/dropdown"),
};