import { useState } from "react";
import { Link } from "react-router-dom";

import { useCart } from "../../hooks/useCart.js";

// ==========================================
// Format price helper
// ==========================================
const formatPrice = (price, currency = "USD") => {
    const symbols = { USD: "$", EUR: "€", GBP: "£", PKR: "Rs ", INR: "₹" };
    const symbol = symbols[currency] || "$";
    return `${symbol}${Number(price).toFixed(2)}`;
};

// ==========================================
// CartItem — full cart item row (for cart page)
// ==========================================
export const CartItem = ({ item }) => {
    const { updateItem, removeItem } = useCart();
    const [updating, setUpdating] = useState(false);
    const [removing, setRemoving] = useState(false);

    const { product, quantity, subtotal } = item;
    const isOutOfStock = product.stock === 0;
    const isAtMax = quantity >= product.stock;

    // ==========================================
    // Handlers
    // ==========================================
    const handleDecrement = async () => {
        if (updating || quantity <= 1) return;
        setUpdating(true);
        await updateItem(product._id, quantity - 1);
        setUpdating(false);
    };

    const handleIncrement = async () => {
        if (updating || isAtMax) return;
        setUpdating(true);
        await updateItem(product._id, quantity + 1);
        setUpdating(false);
    };

    const handleRemove = async () => {
        if (removing) return;
        setRemoving(true);
        await removeItem(product._id);
        setRemoving(false);
    };

    // ==========================================
    // Render
    // ==========================================
    return (
        <div
            className={`
        bg-white rounded-2xl border border-neutral-100 shadow-soft
        p-4 sm:p-6
        transition-opacity
        ${updating || removing ? "opacity-60" : ""}
      `}
        >
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                {/* ==========================================
            IMAGE
        ========================================== */}
                <Link
                    to={`/product/${product.slug}`}
                    className="shrink-0 w-full sm:w-24 h-48 sm:h-24 rounded-lg bg-neutral-100 overflow-hidden border border-neutral-100"
                >
                    {product.images?.[0]?.url ? (
                        <img
                            src={product.images[0].url}
                            alt={product.name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-neutral-300">
                            <ImagePlaceholderIcon />
                        </div>
                    )}
                </Link>

                {/* ==========================================
            INFO
        ========================================== */}
                <div className="flex-1 min-w-0 flex flex-col">
                    {/* Name */}
                    <Link
                        to={`/product/${product.slug}`}
                        className="text-base font-semibold text-neutral-900 hover:text-primary-600 transition-colors"
                    >
                        {product.name}
                    </Link>

                    {/* Category + Price */}
                    <div className="flex items-center gap-2 text-sm text-neutral-500 mt-1">
                        {product.category?.name && (
                            <>
                                <span>{product.category.name}</span>
                                <span className="text-neutral-300">·</span>
                            </>
                        )}
                        <span>{formatPrice(product.price, product.currency)} each</span>
                    </div>

                    {/* Stock warnings */}
                    {(isOutOfStock || isAtMax) && (
                        <div className="mt-2">
                            {isOutOfStock ? (
                                <span className="inline-block text-xs font-medium text-error-600 bg-error-50 px-2 py-0.5 rounded">
                                    Out of stock
                                </span>
                            ) : (
                                <span className="inline-block text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                                    Only {product.stock} available
                                </span>
                            )}
                        </div>
                    )}

                    {/* Quantity + Remove — pushed to bottom on mobile */}
                    <div className="flex items-center gap-4 mt-4 sm:mt-auto pt-4 sm:pt-0">
                        {/* Quantity selector */}
                        <div className="inline-flex items-center border border-neutral-300 rounded-lg overflow-hidden">
                            <button
                                type="button"
                                onClick={handleDecrement}
                                disabled={updating || removing || quantity <= 1}
                                className="w-9 h-9 flex items-center justify-center text-neutral-600 hover:bg-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                aria-label="Decrease quantity"
                            >
                                <MinusIcon />
                            </button>
                            <span className="w-10 text-center text-sm font-medium text-neutral-900 tabular-nums">
                                {quantity}
                            </span>
                            <button
                                type="button"
                                onClick={handleIncrement}
                                disabled={updating || removing || isAtMax}
                                className="w-9 h-9 flex items-center justify-center text-neutral-600 hover:bg-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                aria-label="Increase quantity"
                            >
                                <PlusIcon />
                            </button>
                        </div>

                        {/* Remove — text version */}
                        <button
                            type="button"
                            onClick={handleRemove}
                            disabled={updating || removing}
                            className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-500 hover:text-error-600 disabled:opacity-40 transition-colors"
                        >
                            <TrashIcon />
                            <span className="hidden sm:inline">Remove</span>
                        </button>
                    </div>
                </div>

                {/* ==========================================
            SUBTOTAL (right column on desktop)
        ========================================== */}
                <div className="sm:shrink-0 sm:text-right flex sm:flex-col justify-between sm:justify-start items-center sm:items-end gap-2">
                    <span className="text-xs text-neutral-500 sm:hidden">
                        Subtotal
                    </span>
                    <span className="text-lg font-semibold text-neutral-900 tabular-nums">
                        {formatPrice(subtotal, product.currency)}
                    </span>
                </div>
            </div>
        </div>
    );
};

// ==========================================
// Inline icons
// ==========================================
const MinusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
);

const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
);

const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 6h18" />
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
        <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
);

const ImagePlaceholderIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
        <circle cx="9" cy="9" r="2" />
        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
    </svg>
);