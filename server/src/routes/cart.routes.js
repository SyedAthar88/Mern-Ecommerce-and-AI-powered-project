import { Router } from "express";
import {
    getCart,
    addToCart,
    updateCartItem,
    removeCartItem,
    clearCart,
} from "../controllers/cart.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
    addCartItemSchema,
    updateCartItemSchema,
} from "../validators/cart.validator.js";

const router = Router();

// All cart routes require authentication
router.use(verifyJWT);

// Get cart
router.get("/", getCart);

// Add item
router.post("/items", validate(addCartItemSchema), addToCart);

// Update quantity
router.patch("/items/:productId", validate(updateCartItemSchema), updateCartItem);

// Remove item
router.delete("/items/:productId", removeCartItem);

// Clear cart
router.delete("/", clearCart);

export default router;