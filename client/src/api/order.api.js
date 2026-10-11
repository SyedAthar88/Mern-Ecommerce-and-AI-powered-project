import api from "./axios.js";

// ==========================================
// Order API
// ==========================================
export const orderApi = {
    // Get current user's orders
    getMyOrders: (params) => api.get("/orders", { params }),

    // Get single order (must belong to user)
    getById: (orderId) => api.get(`/orders/${orderId}`),

    // ---- Admin (Phase 21) ----
    getAllAdmin: (params) => api.get("/admin/orders", { params }),
    updateStatus: (orderId, status) =>
        api.patch(`/admin/orders/${orderId}/status`, { status }),
};