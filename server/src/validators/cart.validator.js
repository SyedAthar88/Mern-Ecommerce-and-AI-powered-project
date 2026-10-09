import { z } from "zod";

// ==========================================
// Mongo ObjectId regex
// ==========================================
const objectIdRegex = /^[0-9a-fA-F]{24}$/;

// ==========================================
// ADD ITEM schema
// ==========================================
export const addCartItemSchema = z.object({
    productId: z
        .string({ required_error: "Product ID is required" })
        .regex(objectIdRegex, "Invalid product ID"),

    quantity: z
        .number({ required_error: "Quantity is required" })
        .int("Quantity must be a whole number")
        .min(1, "Quantity must be at least 1")
        .max(999, "Quantity is too high")
        .optional()
        .default(1),
});

// ==========================================
// UPDATE ITEM schema
// ==========================================
export const updateCartItemSchema = z.object({
    quantity: z
        .number({ required_error: "Quantity is required" })
        .int("Quantity must be a whole number")
        .min(0, "Quantity cannot be negative")
        .max(999, "Quantity is too high"),
});