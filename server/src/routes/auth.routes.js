import { Router } from "express";
import {
  signup,
  login,
  logout,
  refreshAccessToken,       // ← NEW
} from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { signupSchema, loginSchema } from "../validators/auth.validator.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/signup", validate(signupSchema), signup);
router.post("/login", validate(loginSchema), login);
router.post("/logout", verifyJWT, logout);

// NEW ⬇️ — no auth middleware! The refresh token IS the auth.
router.post("/refresh", refreshAccessToken);

export default router;