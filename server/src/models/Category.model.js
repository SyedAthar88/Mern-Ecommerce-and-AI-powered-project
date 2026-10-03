import mongoose from "mongoose";
import { generateUniqueSlug } from "../utils/slugify.js";

// ==========================================
// Category schema
// ==========================================
const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Category name is required"],
            trim: true,
            minlength: [2, "Name must be at least 2 characters"],
            maxlength: [50, "Name must be under 50 characters"],
        },
        slug: {
            type: String,
            unique: true,
            lowercase: true,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
            maxlength: [500, "Description must be under 500 characters"],
            default: "",
        },
        image: {
            url: { type: String, default: "" },
            publicId: { type: String, default: "" },
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

// ==========================================
// Pre-save hook: auto-generate slug
// ==========================================
categorySchema.pre("save", async function () {
    // Only regenerate slug if name changed OR slug doesn't exist
    if (!this.slug || this.isModified("name")) {
        this.slug = await generateUniqueSlug(
            mongoose.model("Category"),
            this.name,
            this._id
        );
    }
});

export const Category = mongoose.model("Category", categorySchema);