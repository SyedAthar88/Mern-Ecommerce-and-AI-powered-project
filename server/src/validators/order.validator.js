import { z } from "zod";

// ==========================================
// Shipping address schema
// ==========================================
export const shippingAddressSchema = z.object({
    fullName: z
        .string({ required_error: "Full name is required" })
        .trim()
        .min(2, "Name must be at least 2 characters")
        .max(100, "Name must be under 100 characters"),

    email: z
        .string({ required_error: "Email is required" })
        .trim()
        .toLowerCase()
        .email("Please provide a valid email"),

    phone: z
        .string({ required_error: "Phone is required" })
        .trim()
        .min(7, "Phone must be at least 7 digits")
        .max(20, "Phone must be under 20 characters"),

    addressLine1: z
        .string({ required_error: "Address is required" })
        .trim()
        .min(5, "Address must be at least 5 characters")
        .max(200, "Address must be under 200 characters"),

    addressLine2: z
        .string()
        .trim()
        .max(200, "Address must be under 200 characters")
        .optional()
        .default(""),

    city: z
        .string({ required_error: "City is required" })
        .trim()
        .min(2, "City must be at least 2 characters")
        .max(100, "City must be under 100 characters"),

    state: z
        .string({ required_error: "State is required" })
        .trim()
        .min(2, "State must be at least 2 characters")
        .max(100, "State must be under 100 characters"),

    postalCode: z
        .string({ required_error: "Postal code is required" })
        .trim()
        .min(2, "Postal code must be at least 2 characters")
        .max(20, "Postal code must be under 20 characters"),

    country: z
        .string()
        .trim()
        .min(2, "Country must be at least 2 characters")
        .max(100, "Country must be under 100 characters")
        .optional()
        .default("US"),
});

// ==========================================
// Create checkout session schema
// (items are computed server-side, not sent by client)
// ==========================================
export const createCheckoutSchema = z.object({
    shippingAddress: shippingAddressSchema,
});