import api from "./axios.js";

// ==========================================
// Cart API — all cart endpoints
// ==========================================
export const cartApi = {
    // Get current cart
    get: () => api.get("/cart"),

    // Add item to cart
    addItem: (productId, quantity = 1) =>
        api.post("/cart/items", { productId, quantity }),

    // Update item quantity
    updateItem: (productId, quantity) =>
        api.patch(`/cart/items/${productId}`, { quantity }),

    // Remove item
    removeItem: (productId) => api.delete(`/cart/items/${productId}`),

    // Clear all
    clear: () => api.delete("/cart"),
};