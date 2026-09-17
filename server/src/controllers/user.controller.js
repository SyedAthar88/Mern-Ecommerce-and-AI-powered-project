import { User } from "../models/User.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// ==========================================
// GET /api/users/me — Get current user
// ==========================================
export const getMe = asyncHandler(async (req, res) => {
  // req.user is attached by verifyJWT middleware
  return res
    .status(200)
    .json(new ApiResponse(200, { user: req.user }, "User fetched successfully"));
});

// ==========================================
// PATCH /api/users/me — Update profile
// ==========================================
export const updateProfile = asyncHandler(async (req, res) => {
  const { name, email } = req.body;

  // Build update object only with provided fields
  const updateData = {};
  if (name) updateData.name = name;
  if (email) updateData.email = email;

  if (Object.keys(updateData).length === 0) {
    throw new ApiError(400, "No valid fields to update");
  }

  const user = await User.findByIdAndUpdate(req.user._id, updateData, {
    new: true,           // return updated doc
    runValidators: true, // run Mongoose validators
  }).select("-password -refreshToken");

  return res
    .status(200)
    .json(new ApiResponse(200, { user }, "Profile updated successfully"));
});

// ==========================================
// PATCH /api/users/me/password — Change password
// ==========================================
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    throw new ApiError(400, "Current and new password are required");
  }

  if (newPassword.length < 6) {
    throw new ApiError(400, "New password must be at least 6 characters");
  }

  // Fetch user WITH password
  const user = await User.findById(req.user._id).select("+password");

  // Verify current password
  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    throw new ApiError(401, "Current password is incorrect");
  }

  // Update password — pre-save hook will hash it
  user.password = newPassword;
  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
});