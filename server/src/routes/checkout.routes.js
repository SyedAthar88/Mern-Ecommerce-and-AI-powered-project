import { Router } from "express";
import { createPaymentIntent } from "../controllers/checkout.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { createCheckoutSchema } from "../validators/order.validator.js";

const router = Router();

// Require login
router.use(verifyJWT);

// Create payment intent
router.post(
  "/create-payment-intent",
  validate(createCheckoutSchema),
  createPaymentIntent
);

export default router;