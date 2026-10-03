import { z } from "zod";
const imageSchema = z.object({
  url: z.string().url("Invalid image URL").or(z.literal("")),
  publicId: z.string().or(z.literal("")),
});

// ==========================================
// CREATE CATEGORY
// ==========================================
export const createCategorySchema = z.object({
  name: z
    .string({ required_error: "Category name is required" })
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be under 50 characters"),

  description: z
    .string()
    .trim()
    .max(500, "Description must be under 500 characters")
    .optional()
    .default(""),

  image: imageSchema.optional(),

  isActive: z.boolean().optional().default(true),
});


export const updateCategorySchema = createCategorySchema
  .partial()
  .refine(
    (data) => Object.keys(data).length > 0,
    { message: "At least one field must be provided" }
  );