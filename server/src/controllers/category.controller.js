import { Category } from "../models/Category.model.js";
import { Product } from "../models/Product.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// ==========================================
// PUBLIC ENDPOINTS
// ==========================================

// ==========================================
// GET /api/categories
// List active categories (public)
// ==========================================
export const getPublicCategories = asyncHandler(async (req, res) => {
    const categories = await Category.find({ isActive: true })
        .select("name slug description image")
        .sort({ name: 1 })
        .lean();

    return res.status(200).json(
        new ApiResponse(200, { categories }, "Categories fetched successfully")
    );
});

// ==========================================
// GET /api/categories/:slug
// Get one category by slug (public)
// ==========================================
export const getPublicCategoryBySlug = asyncHandler(async (req, res) => {
    const { slug } = req.params;

    const category = await Category.findOne({ slug, isActive: true })
        .select("name slug description image")
        .lean();

    if (!category) {
        throw new ApiError(404, "Category not found");
    }

    return res.status(200).json(
        new ApiResponse(200, { category }, "Category fetched successfully")
    );
});

// ==========================================
// ADMIN ENDPOINTS
// ==========================================

// ==========================================
// GET /api/admin/categories
// List all categories with product counts
// ==========================================
export const getAllCategories = asyncHandler(async (req, res) => {
    const categories = await Category.aggregate([
        // Join with products
        {
            $lookup: {
                from: "products",
                localField: "_id",
                foreignField: "category",
                as: "products",
            },
        },
        // Add productCount
        {
            $addFields: {
                productCount: { $size: "$products" },
            },
        },
        // Remove the joined products array
        {
            $project: {
                products: 0,
            },
        },
        // Sort by name
        {
            $sort: { name: 1 },
        },
    ]);

    return res.status(200).json(
        new ApiResponse(
            200,
            { categories, count: categories.length },
            "Categories fetched successfully"
        )
    );
});

// ==========================================
// GET /api/admin/categories/:id
// Get one category by ID
// ==========================================
export const getCategoryById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const category = await Category.findById(id);
    if (!category) {
        throw new ApiError(404, "Category not found");
    }

    // Count products in this category
    const productCount = await Product.countDocuments({ category: id });

    return res.status(200).json(
        new ApiResponse(
            200,
            { category: { ...category.toObject(), productCount } },
            "Category fetched successfully"
        )
    );
});

// ==========================================
// POST /api/admin/categories
// Create a new category
// ==========================================
export const createCategory = asyncHandler(async (req, res) => {
    const { name, description, image, isActive } = req.body;

    // Check if a category with the same name already exists
    const existing = await Category.findOne({ name: name.trim() });
    if (existing) {
        throw new ApiError(409, "Category with this name already exists");
    }

    const category = await Category.create({
        name,
        description,
        image: image || { url: "", publicId: "" },
        isActive,
    });

    return res.status(201).json(
        new ApiResponse(201, { category }, "Category created successfully")
    );
});

// ==========================================
// PATCH /api/admin/categories/:id
// Update a category
// ==========================================
export const updateCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    // Find category
    const category = await Category.findById(id);
    if (!category) {
        throw new ApiError(404, "Category not found");
    }

    // If name is being changed, check for conflicts
    if (updates.name && updates.name.trim() !== category.name) {
        const existing = await Category.findOne({
            name: updates.name.trim(),
            _id: { $ne: id },
        });
        if (existing) {
            throw new ApiError(409, "Category with this name already exists");
        }
    }

    // Prevent slug changes
    delete updates.slug;

    // Apply updates
    Object.assign(category, updates);
    await category.save();

    return res.status(200).json(
        new ApiResponse(200, { category }, "Category updated successfully")
    );
});

// ==========================================
// DELETE /api/admin/categories/:id
// Delete a category (guarded)
// ==========================================
export const deleteCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const category = await Category.findById(id);
    if (!category) {
        throw new ApiError(404, "Category not found");
    }

    // Guard: cannot delete category with products
    const productCount = await Product.countDocuments({ category: id });
    if (productCount > 0) {
        throw new ApiError(
            400,
            `Cannot delete category with ${productCount} product${productCount === 1 ? "" : "s"
            }. Move or delete the products first, or deactivate the category instead.`
        );
    }

    await Category.findByIdAndDelete(id);

    return res.status(200).json(
        new ApiResponse(200, {}, "Category deleted successfully")
    );
});
// ==========================================
// GET /api/admin/categories/dropdown
// Simplified list for select inputs
// ==========================================
export const getCategoryDropdown = asyncHandler(async (req, res) => {
  const categories = await Category.find({ isActive: true })
    .select("_id name")
    .sort({ name: 1 })
    .lean();

  return res.status(200).json(
    new ApiResponse(200, { categories }, "Categories fetched successfully")
  );
});