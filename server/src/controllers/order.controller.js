import { Order } from "../models/Order.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// ==========================================
// GET /api/orders
// List current user's orders (paginated)
// ==========================================
export const getMyOrders = asyncHandler(async (req, res) => {
    // ---- Pagination ----
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 10));
    const skip = (page - 1) * limit;

    // ---- Filter ----
    const filter = { user: req.user._id };

    const status = req.query.status;
    const validStatuses = [
        "pending",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
    ];
    if (status && validStatuses.includes(status)) {
        filter.status = status;
    }

    // ---- Query ----
    const [orders, total] = await Promise.all([
        Order.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .select("-__v"),   // exclude version key
        Order.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limit);

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                orders,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages,
                    hasNext: page < totalPages,
                    hasPrev: page > 1,
                },
            },
            "Orders fetched successfully"
        )
    );
});

// ==========================================
// GET /api/orders/:id
// Get single order (must belong to user)
// ==========================================
export const getMyOrderById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    // Find order BY ID AND BY USER
    // Combining both in the query means:
    //   - If order exists but belongs to another user → no match → 404
    //   - If order doesn't exist → no match → 404
    // Same response for both (prevents info leakage)
    const order = await Order.findOne({
        _id: id,
        user: req.user._id,
    }).select("-__v");

    if (!order) {
        throw new ApiError(404, "Order not found");
    }

    return res.status(200).json(
        new ApiResponse(200, { order }, "Order fetched successfully")
    );
});