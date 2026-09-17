import { ApiError } from "../utils/ApiError.js";

// ==========================================
// ROLE CHECK — Restricts routes to specific roles
// Usage: authorize("admin")
//        authorize("admin", "moderator")
// ==========================================
export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      throw new ApiError(401, "Unauthorized: Please login first");
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new ApiError(
        403,
        `Access denied: ${req.user.role} cannot access this resource`
      );
    }

    next();
  };
};