import api from "./axios.js";

// ==========================================
// Checkout API
// ==========================================
export const checkoutApi = {
    // Create a Stripe PaymentIntent (with order)
    createPaymentIntent: (data) =>
        api.post("/checkout/create-payment-intent", data),
};