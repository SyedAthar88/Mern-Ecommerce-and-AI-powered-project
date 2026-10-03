import mongoose from "mongoose";
import { generateUniqueSlug } from "../utils/slugify.js";

const imageSchema = new mongoose.Schema(
    {
        url: { type: String, required: true },
        publicId: { type: String, required: true },
    },
    { _id: false }  // no _id for subdocuments
);

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Product name is required"],
            trim: true,
            minlength: [2, "Name must be at least 2 characters"],
            maxlength: [200, "Name must be under 200 characters"],
        },
        slug: {
            type: String,
            unique: true,
            lowercase: true,
            trim: true,
        },
        description: {
            type: String,
            required: [true, "Description is required"],
            trim: true,
            maxlength: [5000, "Description must be under 5000 characters"],
        },
        shortDescription: {
            type: String,
            trim: true,
            maxlength: [200, "Short description must be under 200 characters"],
            default: "",
        },
        sku: {
            type: String,
            trim: true,
            uppercase: true,
            sparse: true,   // allows multiple docs with no sku
            unique: true,   // but enforces uniqueness when present
        },

        // ---------- Pricing ----------
        price: {
            type: Number,
            required: [true, "Price is required"],
            min: [0, "Price cannot be negative"],
        },
        compareAtPrice: {
            type: Number,
            min: [0, "Compare price cannot be negative"],
            default: null,
        },
        currency: {
            type: String,
            default: "USD",
            uppercase: true,
            enum: ["USD", "EUR", "GBP", "PKR", "INR"],
        },

        // ---------- Inventory ----------
        stock: {
            type: Number,
            required: true,
            min: [0, "Stock cannot be negative"],
            default: 0,
        },

        // ---------- Organization ----------
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: [true, "Category is required"],
        },
        tags: {
            type: [String],
            default: [],
        },

        // ---------- Media ----------
        images: {
            type: [imageSchema],
            default: [],
        },

        // ---------- Status ----------
        isActive: {
            type: Boolean,
            default: true,
        },
        isFeatured: {
            type: Boolean,
            default: false,
        },

        // ---------- Ratings (populated by reviews later) ----------
        ratings: {
            average: { type: Number, default: 0, min: 0, max: 5 },
            count: { type: Number, default: 0, min: 0 },
        },

        // ---------- Audit ----------
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

// ==========================================
// Indexes for query performance
// ==========================================
productSchema.index({ name: "text", description: "text" });   // full-text search
productSchema.index({ category: 1, isActive: 1 });            // filter by category
productSchema.index({ price: 1 });                             // price sort
productSchema.index({ createdAt: -1 });                        // newest first
productSchema.index({ isFeatured: 1, isActive: 1 });          // featured products

// ==========================================
// Pre-save hook: auto-generate slug
// ==========================================
productSchema.pre("save", async function () {
    if (!this.slug) {
        this.slug = await generateUniqueSlug(
            mongoose.model("Product"),
            this.name,
            this._id
        );
    }
});

export const Product = mongoose.model("Product", productSchema);