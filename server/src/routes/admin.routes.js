import { Router } from "express";
import {
  getAdminMe,
  getAdminStats,
  getAllUsers,       // ← NEW
  getUserById,       // ← NEW
  updateUser,        // ← NEW
  deleteUser,        // ← NEW
} from "../controllers/admin.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";   // ← NEW
import { updateUserSchema } from "../validators/admin.validator.js"; // ← NEW

const router = Router();

// All routes below: verifyJWT + authorize("admin")
router.use(verifyJWT);
router.use(authorize("admin"));

// ==========================================
// Existing (Phase 6)
// ==========================================
router.get("/me", getAdminMe);
router.get("/stats", getAdminStats);

// ==========================================
// Users CRUD (Phase 7)
// ==========================================
router.get("/users", getAllUsers);
router.get("/users/:id", getUserById);
router.patch("/users/:id", validate(updateUserSchema), updateUser);
router.delete("/users/:id", deleteUser);

export default router;