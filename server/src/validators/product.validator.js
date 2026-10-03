import { z } from "zod";

// ==========================================
// Image sub-schema
// ==========================================
const imageSchema = z.object({
    url: z.string().url("Invalid image URL"),
    publicId: z.string().min(1, "Public ID is required"),
});

// ==========================================
// CREATE PRODUCT
// ==========================================
export const createProductSchema = z
    .object({
        // ---- Basic info ----
        name: z
            .string({ required_error: "Product name is required" })
            .trim()
            .min(2, "Name must be at least 2 characters")
            .max(200, "Name must be under 200 characters"),

        description: z
            .string({ required_error: "Description is required" })
            .trim()
            .min(10, "Description must be at least 10 characters")
            .max(5000, "Description must be under 5000 characters"),

        shortDescription: z
            .string()
            .trim()
            .max(200, "Short description must be under 200 characters")
            .optional()
            .default(""),

        sku: z
            .string()
            .trim()
            .toUpperCase()
            .max(50, "SKU must be under 50 characters")
            .optional()
            .or(z.literal("")),

        // ---- Pricing ----
        price: z
            .number({ required_error: "Price is required" })
            .min(0, "Price cannot be negative")
            .max(1000000, "Price is too high"),

        compareAtPrice: z
            .number()
            .min(0, "Compare price cannot be negative")
            .max(1000000)
            .nullable()
            .optional(),

        currency: z.enum(["USD", "EUR", "GBP", "PKR", "INR"]).optional().default("USD"),

        // ---- Inventory ----
        stock: z
            .number({ required_error: "Stock is required" })
            .int("Stock must be a whole number")
            .min(0, "Stock cannot be negative")
            .max(1000000),

        // ---- Organization ----
        category: z
            .string({ required_error: "Category is required" })
            .regex(/^[0-9a-fA-F]{24}$/, "Invalid category ID"),

        tags: z.array(z.string().trim()).optional().default([]),

        // ---- Media ----
        images: z.array(imageSchema).optional().default([]),

        // ---- Status ----
        isActive: z.boolean().optional().default(true),
        isFeatured: z.boolean().optional().default(false),
    })
    .refine(
        (data) => {
            // If compareAtPrice is set, it must be greater than price
            if (data.compareAtPrice === null || data.compareAtPrice === undefined) {
                return true;
            }
            return data.compareAtPrice > data.price;
        },
        {
            message: "Compare-at price must be higher than current price",
            path: ["compareAtPrice"],
        }
    );

// ==========================================
// UPDATE PRODUCT
// All fields optional
// ==========================================
export const updateProductSchema = z
    .object({
        name: z
            .string()
            .trim()
            .min(2, "Name must be at least 2 characters")
            .max(200, "Name must be under 200 characters"),

        description: z
            .string()
            .trim()
            .min(10, "Description must be at least 10 characters")
            .max(5000, "Description must be under 5000 characters"),

        shortDescription: z
            .string()
            .trim()
            .max(200, "Short description must be under 200 characters"),

        sku: z
            .string()
            .trim()
            .toUpperCase()
            .max(50, "SKU must be under 50 characters")
            .or(z.literal("")),

        price: z.number().min(0, "Price cannot be negative").max(1000000),

        compareAtPrice: z
            .number()
            .min(0, "Compare price cannot be negative")
            .max(1000000)
            .nullable(),

        currency: z.enum(["USD", "EUR", "GBP", "PKR", "INR"]),

        stock: z.number().int("Stock must be a whole number").min(0, "Stock cannot be negative").max(1000000),

        category: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid category ID"),

        tags: z.array(z.string().trim()),

        images: z.array(imageSchema),

        isActive: z.boolean(),
        isFeatured: z.boolean(),
    })
    .partial()
    .refine((data) => Object.keys(data).length > 0, {
        message: "At least one field must be provided",
    });