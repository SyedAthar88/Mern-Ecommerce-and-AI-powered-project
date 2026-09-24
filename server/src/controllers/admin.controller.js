import { User } from "../models/User.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
// ==========================================
// GET /api/admin/me
// Purpose: confirm the admin auth chain works
// ==========================================
export const getAdminMe = asyncHandler(async (req, res) => {
    // req.user is attached by verifyJWT
    // At this point, we KNOW role === "admin" (authorize passed)
    return res.status(200).json(
        new ApiResponse(
            200,
            { user: req.user },
            "Admin access confirmed"
        )
    );
});

// ==========================================
// GET /api/admin/stats
// Purpose: basic dashboard stats
// ==========================================
export const getAdminStats = asyncHandler(async (req, res) => {
    // Run queries in parallel for speed
    const [totalUsers, totalAdmins] = await Promise.all([
        User.countDocuments({ role: "user" }),
        User.countDocuments({ role: "admin" }),
    ]);

    const stats = {
        totalUsers,
        totalAdmins,
        totalAccounts: totalUsers + totalAdmins,
    };

    return res.status(200).json(
        new ApiResponse(200, { stats }, "Stats fetched successfully")
    );
});

// getall users api 

export const getAllUsers = asyncHandler(async (req, res) => {
    // Parse query params
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 10));
    const skip = (page - 1) * limit;

    // Fetch paginated users (newest first)
    const [users, total] = await Promise.all([
        User.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
        User.countDocuments(),
    ]);

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                users,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                    hasNext: page * limit < total,
                    hasPrev: page > 1,
                },
            },
            "Users fetched successfully"
        )
    );
});

// Get one user by id

export const getUserById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    return res.status(200).json(
        new ApiResponse(
            200,
            { user },
            "user fetched successfully"
        )
    )
});
// Update user (name, email, role)

export const updateUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    const targetUser = await User.findById(id);
    if (!targetUser) {
        throw new ApiError(404, "User not found");
    }
    // 2. Guard: admin cannot demote themselves
    if (
        req.user._id.equals(targetUser._id) &&
        updates.role &&
        updates.role !== "admin"
    ) {
        throw new ApiError(400, "You cannot change your own role");
    }
    if (updates.email && updates.email !== targetUser.email) {
        const emailTaken = await User.findOne({ email: updates.email });
        if (emailTaken) {
            throw new ApiError(409, "Email already in use");
        }
    }
    const updatedUser = await User.findByIdAndUpdate(id, updates, {
        new: true,
        runValidators: true,
    });

    return res.status(200).json(
        new ApiResponse(200, { user: updatedUser }, "User updated successfully")
    );
})



export const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params;

    // 1. Find target user
    const targetUser = await User.findById(id);
    if (!targetUser) {
        throw new ApiError(404, "User not found");
    }

    // 2. Guard: cannot delete yourself
    if (req.user._id.equals(targetUser._id)) {
        throw new ApiError(400, "You cannot delete your own account");
    }

    // 3. Guard: cannot delete the last admin
    if (targetUser.role === "admin") {
        const adminCount = await User.countDocuments({ role: "admin" });
        if (adminCount <= 1) {
            throw new ApiError(400, "Cannot delete the last admin account");
        }
    }

    // 4. Delete
    await User.findByIdAndDelete(id);

    return res.status(200).json(
        new ApiResponse(200, {}, "User deleted successfully")
    );
});