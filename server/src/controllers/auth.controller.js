import jwt from "jsonwebtoken";   
import { User } from "../models/User.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { setAuthCookies, clearAuthCookies } from "../utils/tokens.js";
import { env } from "../config/env.js";
// ==========================================
// SIGNUP
// ==========================================
export const signup = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // 1. Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, "User with this email already exists");
  }

  // 2. Create user (password is hashed by pre-save hook)
  const user = await User.create({
    name,
    email,
    password,
  });

  // 3. Remove sensitive fields before sending response
  const sanitizedUser = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  };

  return res
    .status(201)
    .json(
      new ApiResponse(201, { user: sanitizedUser }, "User registered successfully")
    );
});

// LOGIN
// ==========================================
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // 1. Find user & explicitly include password (select: false by default)
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  // 2. Verify password
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid email or password");
  }

  // 3. Generate tokens
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  // 4. Save refresh token in DB (for logout invalidation)
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  // 5. Set cookies
  setAuthCookies(res, accessToken, refreshToken);

  // 6. Sanitize user
  const sanitizedUser = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  };

  return res
    .status(200)
    .json(
      new ApiResponse(200, { user: sanitizedUser }, "Logged in successfully")
    );
});

// ==========================================
// LOGOUT
// ==========================================
export const logout = asyncHandler(async (req, res) => {
  // 1. Clear refresh token in DB
  await User.findByIdAndUpdate(
    req.user._id,
    { $unset: { refreshToken: 1 } },
    { new: true }
  );

  // 2. Clear cookies
  clearAuthCookies(res);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Logged out successfully"));
});

// ==========================================
// REFRESH ACCESS TOKEN
// ==========================================
export const refreshAccessToken = asyncHandler(async (req, res) => {
  // 1. Read refresh token from cookie
  const incomingRefreshToken = req.cookies?.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized: No refresh token provided");
  }

  // 2. Verify refresh token signature
  let decoded;
  try {
    decoded = jwt.verify(incomingRefreshToken, env.REFRESH_TOKEN_SECRET);
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new ApiError(401, "Refresh token expired. Please login again");
    }
    throw new ApiError(401, "Invalid refresh token");
  }

  // 3. Find user (with refreshToken field included)
  const user = await User.findById(decoded.id).select("+refreshToken");
  if (!user) {
    throw new ApiError(401, "User no longer exists");
  }

  // 4. Compare incoming token with the one stored in DB
  if (user.refreshToken !== incomingRefreshToken) {
    throw new ApiError(401, "Refresh token revoked. Please login again");
  }

  // 5. Generate NEW tokens (rotation)
  const newAccessToken = user.generateAccessToken();
  const newRefreshToken = user.generateRefreshToken();

  // 6. Save new refresh token in DB (replaces old)
  user.refreshToken = newRefreshToken;
  await user.save({ validateBeforeSave: false });

  // 7. Send both new cookies
  setAuthCookies(res, newAccessToken, newRefreshToken);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Access token refreshed"));
});