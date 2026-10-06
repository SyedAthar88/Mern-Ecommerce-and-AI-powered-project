import { Router } from "express";
import {
  getPublicProducts,
  getPublicProductBySlug,
} from "../controllers/product.controller.js";

const router = Router();

// Public — no auth required
router.get("/", getPublicProducts);
router.get("/:slug", getPublicProductBySlug);

export default router;