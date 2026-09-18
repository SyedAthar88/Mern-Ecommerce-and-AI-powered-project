import { ApiError } from "../utils/ApiError.js";

export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    // 1. Ensure user is authenticated
    //    (must have verifyJWT BEFORE this middleware)
    if (!req.user) {
      throw new ApiError(401, "Unauthorized: Please login first");
    }

    // 2. Check role
    if (!allowedRoles.includes(req.user.role)) {
      throw new ApiError(
        403,
        `Access denied: '${req.user.role}' role cannot access this resource`
      );
    }

    // 3. Role matches → continue
    next();
  };
};