import { ApiError } from "../utils/ApiError.js";

export const validate = (schema) => (req, res, next) => {
  try {
    // Parse & replace body with validated/sanitized data
    req.body = schema.parse(req.body);
    next();
  } catch (error) {
    // Zod errors have `issues` array
    const errors = error.errors?.map((e) => ({
      field: e.path.join("."),
      message: e.message,
    })) || [];

    next(new ApiError(400, "Validation failed", errors));
  }
};