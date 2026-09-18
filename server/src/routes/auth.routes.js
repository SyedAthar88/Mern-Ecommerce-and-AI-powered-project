import { Router } from "express";
import {
  signup,
  login,
  logout,
  refreshAccessToken,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  signupSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "../validators/auth.validator.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  authLimiter,
  forgotPasswordLimiter,
  refreshLimiter,
} from "../middlewares/rateLimit.middleware.js";

const router = Router();

// Public + strict limits
router.post("/signup", authLimiter, validate(signupSchema), signup);
router.post("/login", authLimiter, validate(loginSchema), login);
router.post("/forgot-password", forgotPasswordLimiter,validate(forgotPasswordSchema),forgotPassword);
router.post("/reset-password/:token", validate(resetPasswordSchema), resetPassword);

// Auth-required, more lenient
router.post("/logout", verifyJWT, logout);
router.post("/refresh", refreshLimiter, refreshAccessToken);

export default router;