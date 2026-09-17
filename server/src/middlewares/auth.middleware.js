import jwt from "jsonwebtoken";
import { User } from "../models/User.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { env } from "../config/env.js";

// ==========================================
// VERIFY JWT — Protects routes
// ==========================================
export const verifyJWT = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    throw new ApiError(401, "Unauthorized: No token provided");
  }

  let decoded;
  try {
    decoded = jwt.verify(token, env.ACCESS_TOKEN_SECRET);
  } catch (error) {
    // ⚠️ Important: distinguish expired from invalid
    if (error.name === "TokenExpiredError") {
      // Add a flag so frontend knows to try /refresh
      throw new ApiError(401, "TOKEN_EXPIRED");
    }
    throw new ApiError(401, "Invalid access token");
  }

  const user = await User.findById(decoded.id).select("-password -refreshToken");
  if (!user) {
    throw new ApiError(401, "User no longer exists");
  }

  req.user = user;
  next();
});