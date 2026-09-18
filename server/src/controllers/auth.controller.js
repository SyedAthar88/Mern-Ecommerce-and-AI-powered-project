import crypto from "crypto"; 
import jwt from "jsonwebtoken";   
import { User } from "../models/User.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { setAuthCookies, clearAuthCookies } from "../utils/tokens.js";
import { env } from "../config/env.js";
import { sendPasswordResetEmail } from "../utils/email.js";
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

// ==========================================
// FORGOT PASSWORD
// ==========================================
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  // 1. Find user by email
  const user = await User.findOne({ email });

  // 2. SECURITY: Never reveal if email exists or not
  //    Always return the same success message
  if (!user) {
    return res.status(200).json(
      new ApiResponse(
        200,
        {},
        "If an account exists with that email, a reset link has been sent"
      )
    );
  }

  // 3. Generate a random token (32 bytes = 256 bits)
  const rawToken = crypto.randomBytes(32).toString("hex");

  // 4. Hash the token with SHA256 before storing in DB
  const hashedToken = crypto
    .createHash("sha256")
    .update(rawToken)
    .digest("hex");

  // 5. Save hashed token + expiry to user
  user.passwordResetToken = hashedToken;
  user.passwordResetExpires = Date.now() + 15 * 60 * 1000; // 15 min from now
  await user.save({ validateBeforeSave: false });

  // 6. Build the reset URL (frontend route that will call our API)
  const resetUrl = `${env.CLIENT_URL}/reset-password/${rawToken}`;

  // 7. Send email
  try {
    await sendPasswordResetEmail({
      to: user.email,
      name: user.name,
      resetUrl,
    });
  } catch (err) {
    // If email fails, clear the token so user can retry cleanly
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    throw new ApiError(500, "Failed to send reset email. Please try again later");
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      {},
      "If an account exists with that email, a reset link has been sent"
    )
  );
});

// ==========================================
// RESET PASSWORD
// ==========================================
export const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!token) {
    throw new ApiError(400, "Reset token is required");
  }

  // 1. Hash the incoming token (same way we hashed it before storing)
  const hashedToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  // 2. Find user with matching token AND not expired
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  }).select("+passwordResetToken +passwordResetExpires");

  if (!user) {
    throw new ApiError(400, "Invalid or expired reset token");
  }

  // 3. Update password (pre-save hook will hash it)
  user.password = password;

  // 4. Clear reset token fields (one-time use)
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  // 5. Kill all existing sessions (security)
  user.refreshToken = undefined;

  await user.save();

  return res.status(200).json(
    new ApiResponse(200, {}, "Password reset successful. Please login.")
  );
});