import { z } from "zod";

export const updateUserSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name must be under 50 characters"),

    email: z
      .string()
      .trim()
      .toLowerCase()
      .email("Please provide a valid email"),

    role: z.enum(["user", "admin"], {
      message: "Role must be either 'user' or 'admin'",
    }),
  })
  .partial()   // ⚠️ KEY: makes ALL fields optional
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided to update",
  });