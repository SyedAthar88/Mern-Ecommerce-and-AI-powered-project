import { Router } from "express";
import express from "express";
import { handleStripeWebhook } from "../controllers/webhook.controller.js";

const router = Router();

// ==========================================
// Stripe webhook — MUST use raw body
// ==========================================
router.post(
  "/stripe",
  express.raw({ type: "application/json" }),  // parse as Buffer, not JSON
  handleStripeWebhook
);

export default router;