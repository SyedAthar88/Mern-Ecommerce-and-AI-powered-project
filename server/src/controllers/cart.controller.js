import { Cart } from "../models/Cart.model.js";
import { Product } from "../models/Product.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// ==========================================
// Helper: calculate totals from populated cart
// ==========================================
const buildCartResponse = (cart) => {
    if (!cart) {
        return { items: [], itemCount: 0, subtotal: 0 };
    }

    let subtotal = 0;
    let itemCount = 0;

    const items = cart.items.map((item) => {
        const product = item.product;
        const itemSubtotal = product.price * item.quantity;

        subtotal += itemSubtotal;
        itemCount += item.quantity;

        return {
            product,
            quantity: item.quantity,
            subtotal: Number(itemSubtotal.toFixed(2)),
            addedAt: item.addedAt,
        };
    });

    return {
        items,
        itemCount,
        subtotal: Number(subtotal.toFixed(2)),
        updatedAt: cart.updatedAt,
    };
};

// ==========================================
// GET /api/cart
// ==========================================
export const getCart = asyncHandler(async (req, res) => {
    let cart = await Cart.findOne({ user: req.user._id }).populate({
        path: "items.product",
        select:
            "name slug price compareAtPrice currency images stock category isActive",
        populate: {
            path: "category",
            select: "name slug",
        },
    });

    // No cart yet → return empty
    if (!cart) {
        return res.status(200).json(
            new ApiResponse(
                200,
                { cart: { items: [], itemCount: 0, subtotal: 0 } },
                "Cart fetched successfully"
            )
        );
    }

    // Cleanup: remove items whose product no longer exists
    const originalLength = cart.items.length;
    cart.items = cart.items.filter((item) => item.product);

    if (cart.items.length !== originalLength) {
        await cart.save();
    }

    const cartData = buildCartResponse(cart);

    return res.status(200).json(
        new ApiResponse(200, { cart: cartData }, "Cart fetched successfully")
    );
});

// ==========================================
// POST /api/cart/items
// Add product to cart (or increment)
// ==========================================
export const addToCart = asyncHandler(async (req, res) => {
    const { productId, quantity = 1 } = req.body;

    // ---- 1. Fetch product ----
    const product = await Product.findById(productId);
    if (!product) {
        throw new ApiError(404, "Product not found");
    }
    if (!product.isActive) {
        throw new ApiError(400, "Product is not available");
    }

    // ---- 2. Find or create user's cart ----
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
        cart = new Cart({ user: req.user._id, items: [] });
    }

    // ---- 3. Check if product already in cart ----
    const existingItem = cart.items.find(
        (item) => item.product.toString() === productId
    );

    const currentQuantity = existingItem ? existingItem.quantity : 0;
    const newQuantity = currentQuantity + quantity;

    // ---- 4. Stock validation ----
    if (product.stock === 0) {
        throw new ApiError(400, "Product is out of stock");
    }
    if (newQuantity > product.stock) {
        throw new ApiError(
            400,
            `Only ${product.stock} available${currentQuantity > 0
                ? ` (you already have ${currentQuantity} in cart)`
                : ""
            }`
        );
    }

    // ---- 5. Update or add item ----
    if (existingItem) {
        existingItem.quantity = newQuantity;
    } else {
        cart.items.push({ product: productId, quantity });
    }

    await cart.save();

    // ---- 6. Populate for response ----
    await cart.populate({
        path: "items.product",
        select:
            "name slug price compareAtPrice currency images stock category isActive",
        populate: {
            path: "category",
            select: "name slug",
        },
    });

    const cartData = buildCartResponse(cart);

    return res.status(200).json(
        new ApiResponse(200, { cart: cartData }, "Item added to cart")
    );
});

// ==========================================
// PATCH /api/cart/items/:productId
// Update quantity (0 removes)
// ==========================================
export const updateCartItem = asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const { quantity } = req.body;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
        throw new ApiError(404, "Cart not found");
    }

    const item = cart.items.find(
        (item) => item.product.toString() === productId
    );
    if (!item) {
        throw new ApiError(404, "Item not in cart");
    }

    // ---- Quantity 0 → remove item ----
    if (quantity === 0) {
        cart.items = cart.items.filter(
            (item) => item.product.toString() !== productId
        );
    } else {
        // ---- Stock validation ----
        const product = await Product.findById(productId);
        if (!product) {
            throw new ApiError(404, "Product not found");
        }
        if (quantity > product.stock) {
            throw new ApiError(400, `Only ${product.stock} available`);
        }

        item.quantity = quantity;
    }

    await cart.save();

    await cart.populate({
        path: "items.product",
        select:
            "name slug price compareAtPrice currency images stock category isActive",
        populate: {
            path: "category",
            select: "name slug",
        },
    });

    const cartData = buildCartResponse(cart);

    return res.status(200).json(
        new ApiResponse(200, { cart: cartData }, "Cart updated")
    );
});

// ==========================================
// DELETE /api/cart/items/:productId
// Remove item
// ==========================================
export const removeCartItem = asyncHandler(async (req, res) => {
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
        throw new ApiError(404, "Cart not found");
    }

    const originalLength = cart.items.length;
    cart.items = cart.items.filter(
        (item) => item.product.toString() !== productId
    );

    if (cart.items.length === originalLength) {
        throw new ApiError(404, "Item not in cart");
    }

    await cart.save();

    await cart.populate({
        path: "items.product",
        select:
            "name slug price compareAtPrice currency images stock category isActive",
        populate: {
            path: "category",
            select: "name slug",
        },
    });

    const cartData = buildCartResponse(cart);

    return res.status(200).json(
        new ApiResponse(200, { cart: cartData }, "Item removed")
    );
});

// ==========================================
// DELETE /api/cart
// Clear all items
// ==========================================
export const clearCart = asyncHandler(async (req, res) => {
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
        return res.status(200).json(
            new ApiResponse(
                200,
                { cart: { items: [], itemCount: 0, subtotal: 0 } },
                "Cart cleared"
            )
        );
    }

    cart.items = [];
    await cart.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            { cart: { items: [], itemCount: 0, subtotal: 0 } },
            "Cart cleared"
        )
    );
});