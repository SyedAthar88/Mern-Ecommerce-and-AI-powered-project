import { Router } from "express";
import {
    getMyOrders,
    getMyOrderById,
} from "../controllers/order.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// All order routes require authentication
router.use(verifyJWT);

// List orders
router.get("/", getMyOrders);

// Get single order
router.get("/:id", getMyOrderById);

export default router;