import { Router } from "express";
import {
  getPublicCategories,
  getPublicCategoryBySlug,
} from "../controllers/category.controller.js";

const router = Router();

// Public — no auth required
router.get("/", getPublicCategories);
router.get("/:slug", getPublicCategoryBySlug);

export default router;