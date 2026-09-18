import { Router } from "express";
import {
  signup,
  login,
  logout,
  refreshAccessToken,
  forgotPassword,          // ← NEW
  resetPassword,           // ← NEW
} from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  signupSchema,
  loginSchema,
  forgotPasswordSchema,    // ← NEW
  resetPasswordSchema,     // ← NEW
} from "../validators/auth.validator.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/signup", validate(signupSchema), signup);
router.post("/login", validate(loginSchema), login);
router.post("/logout", verifyJWT, logout);
router.post("/refresh", refreshAccessToken);

// NEW ⬇️ — public endpoints (no auth needed)
router.post("/forgot-password", validate(forgotPasswordSchema), forgotPassword);
router.post("/reset-password/:token", validate(resetPasswordSchema), resetPassword);

export default router;