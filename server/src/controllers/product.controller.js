import { Product } from "../models/Product.model.js";
import { Category } from "../models/Category.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// ==========================================
// Escape special regex characters
// ==========================================
const escapeRegex = (str) => {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

// ==========================================
// GET /api/admin/products
// List products with pagination + filters
// ==========================================
export const getAllProducts = asyncHandler(async (req, res) => {
    // ---- Parse pagination ----
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 10));
    const skip = (page - 1) * limit;

    // ---- Build filter ----
    const filter = {};

    // Search: name OR description OR tags
    const search = (req.query.search || "").trim();
    if (search) {
        const escaped = escapeRegex(search);
        const regex = new RegExp(escaped, "i");
        filter.$or = [{ name: regex }, { description: regex }, { tags: regex }];
    }

    // Category filter
    const category = req.query.category;
    if (category && /^[0-9a-fA-F]{24}$/.test(category)) {
        filter.category = category;
    }

    // Status filter
    const status = req.query.status;
    if (status === "active") filter.isActive = true;
    else if (status === "inactive") filter.isActive = false;

    // ---- Build sort ----
    const sortOptions = {
        newest: { createdAt: -1 },
        oldest: { createdAt: 1 },
        price_asc: { price: 1 },
        price_desc: { price: -1 },
        name_asc: { name: 1 },
        name_desc: { name: -1 },
    };
    const sort = sortOptions[req.query.sort] || sortOptions.newest;

    // ---- Query ----
    const [products, total] = await Promise.all([
        Product.find(filter)
            .populate("category", "name slug")
            .sort(sort)
            .skip(skip)
            .limit(limit),
        Product.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limit);

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                products,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages,
                    hasNext: page < totalPages,
                    hasPrev: page > 1,
                },
            },
            "Products fetched successfully"
        )
    );
});

// ==========================================
// GET /api/admin/products/:id
// ==========================================
export const getProductById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const product = await Product.findById(id).populate("category", "name slug");
    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    return res.status(200).json(
        new ApiResponse(200, { product }, "Product fetched successfully")
    );
});

// ==========================================
// POST /api/admin/products
// ==========================================
export const createProduct = asyncHandler(async (req, res) => {
    const data = req.body;

    // ---- Validate category exists ----
    const category = await Category.findById(data.category);
    if (!category) {
        throw new ApiError(400, "Category not found");
    }

    // ---- SKU uniqueness (if provided) ----
    if (data.sku && data.sku.trim()) {
        const existing = await Product.findOne({ sku: data.sku.trim() });
        if (existing) {
            throw new ApiError(409, "SKU already exists");
        }
    }

    // ---- Create with createdBy ----
    const product = await Product.create({
        ...data,
        sku: data.sku?.trim() || undefined,
        createdBy: req.user._id,
    });

    // Populate category for consistent response shape
    await product.populate("category", "name slug");

    return res.status(201).json(
        new ApiResponse(201, { product }, "Product created successfully")
    );
});

// ==========================================
// PATCH /api/admin/products/:id
// ==========================================
export const updateProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    // ---- Find product ----
    const product = await Product.findById(id);
    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    // ---- Validate new category (if changing) ----
    if (updates.category && updates.category !== product.category.toString()) {
        const category = await Category.findById(updates.category);
        if (!category) {
            throw new ApiError(400, "Category not found");
        }
    }

    // ---- Validate compareAtPrice against (new or current) price ----
    const newPrice = updates.price !== undefined ? updates.price : product.price;
    const newCompareAtPrice =
        updates.compareAtPrice !== undefined
            ? updates.compareAtPrice
            : product.compareAtPrice;

    if (newCompareAtPrice !== null && newCompareAtPrice !== undefined) {
        if (newCompareAtPrice <= newPrice) {
            throw new ApiError(
                400,
                "Compare-at price must be higher than current price"
            );
        }
    }

    // ---- SKU uniqueness (if changing) ----
    if (updates.sku !== undefined) {
        const newSku = updates.sku?.trim();
        if (newSku && newSku !== product.sku) {
            const existing = await Product.findOne({
                sku: newSku,
                _id: { $ne: id },
            });
            if (existing) {
                throw new ApiError(409, "SKU already exists");
            }
        }
        // Normalize empty sku to undefined
        updates.sku = newSku || undefined;
    }

    // ---- Prevent slug change ----
    delete updates.slug;

    // ---- Apply updates ----
    Object.assign(product, updates);
    await product.save();

    await product.populate("category", "name slug");

    return res.status(200).json(
        new ApiResponse(200, { product }, "Product updated successfully")
    );
});

// ==========================================
// DELETE /api/admin/products/:id
// ==========================================
export const deleteProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    // TODO (Phase 17.4): Delete associated images from Cloudinary
    // TODO (Phase 21): Guard against deleting products referenced in orders

    await Product.findByIdAndDelete(id);

    return res.status(200).json(
        new ApiResponse(200, {}, "Product deleted successfully")
    );
});