import Stripe from "stripe";
import { env } from "./env.js";

// ==========================================
// Stripe client (singleton)
// ==========================================
if (!env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not set in environment variables");
}
export const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-12-18.acacia",   // pinned version
  typescript: false,                  // we're using JavaScript
});