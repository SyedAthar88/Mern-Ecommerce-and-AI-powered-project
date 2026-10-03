import { Router } from "express";
import {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
} from "../controllers/category.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
    createCategorySchema,
    updateCategorySchema,
} from "../validators/category.validator.js";

const router = Router();

// All routes below require admin
router.use(verifyJWT);
router.use(authorize("admin"));

// List
router.get("/", getAllCategories);

// Create
router.post("/", validate(createCategorySchema), createCategory);

// Read one
router.get("/:id", getCategoryById);

// Update
router.patch("/:id", validate(updateCategorySchema), updateCategory);

// Delete
router.delete("/:id", deleteCategory);

export default router;