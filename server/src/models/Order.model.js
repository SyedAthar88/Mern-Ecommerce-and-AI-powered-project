import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
    {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        // ---- Snapshots (frozen at purchase time) ----
        name: {
            type: String,
            required: true,
            trim: true,
        },
        price: {
            type: Number,
            required: true,
            min: [0, "Price cannot be negative"],
        },
        quantity: {
            type: Number,
            required: true,
            min: [1, "Quantity must be at least 1"],
        },
        image: {
            type: String,
            default: "",
        },
        currency: {
            type: String,
            default: "USD",
            uppercase: true,
        },
    },
    { _id: false }
);

// ==========================================
// Shipping address sub-schema
// ==========================================
const shippingAddressSchema = new mongoose.Schema(
    {
        fullName: { type: String, required: true, trim: true },
        email: { type: String, required: true, trim: true, lowercase: true },
        phone: { type: String, required: true, trim: true },
        addressLine1: { type: String, required: true, trim: true },
        addressLine2: { type: String, trim: true, default: "" },
        city: { type: String, required: true, trim: true },
        state: { type: String, required: true, trim: true },
        postalCode: { type: String, required: true, trim: true },
        country: { type: String, required: true, trim: true, default: "US" },
    },
    { _id: false }
);

// ==========================================
// Order schema
// ==========================================
const orderSchema = new mongoose.Schema(
    {
        // ---- WHO ----
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        // ---- WHAT (snapshot items) ----
        items: {
            type: [orderItemSchema],
            required: true,
            validate: {
                validator: (items) => items.length > 0,
                message: "Order must have at least one item",
            },
        },

        // ---- WHERE ----
        shippingAddress: {
            type: shippingAddressSchema,
            required: true,
        },

        // ---- MONEY ----
        subtotal: {
            type: Number,
            required: true,
            min: [0, "Subtotal cannot be negative"],
        },
        shippingCost: {
            type: Number,
            default: 0,
            min: [0, "Shipping cost cannot be negative"],
        },
        tax: {
            type: Number,
            default: 0,
            min: [0, "Tax cannot be negative"],
        },
        total: {
            type: Number,
            required: true,
            min: [0, "Total cannot be negative"],
        },
        currency: {
            type: String,
            default: "USD",
            uppercase: true,
        },

        // ---- STRIPE / PAYMENT ----
        paymentIntentId: {
            type: String,
            sparse: true,
            unique: true,
            index: true,
        },
        paymentStatus: {
            type: String,
            enum: ["pending", "paid", "failed", "refunded"],
            default: "pending",
            index: true,
        },

        // ---- ORDER STATUS ----
        status: {
            type: String,
            enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
            default: "pending",
            index: true,
        },

        // ---- TIMESTAMPS (beyond createdAt/updatedAt) ----
        paidAt: {
            type: Date,
            default: null,
        },
        cancelledAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true, // adds createdAt and updatedAt
    }
);

// ==========================================
// Compound indexes for common queries
// ==========================================
orderSchema.index({ user: 1, createdAt: -1 });   // user's orders, newest first
orderSchema.index({ status: 1, createdAt: -1 }); // admin filter by status

export const Order = mongoose.model("Order", orderSchema);