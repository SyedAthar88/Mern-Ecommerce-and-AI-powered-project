import { Router } from "express";
import {
  getMe,
  updateProfile,
  changePassword,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// All routes in this file require login
router.use(verifyJWT);

router.get("/me", getMe);
router.patch("/me", updateProfile);
router.patch("/me/password", changePassword);

export default router;