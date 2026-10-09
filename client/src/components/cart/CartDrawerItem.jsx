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
// CartDrawerItem — one item row in the drawer
// ==========================================
export const CartDrawerItem = ({ item, onCloseDrawer }) => {
    const { updateItem, removeItem } = useCart();
    const [updating, setUpdating] = useState(false);
    const [removing, setRemoving] = useState(false);

    const { product, quantity, subtotal } = item;
    const isOutOfStock = product.stock === 0;
    const isAtMax = quantity >= product.stock;

    // ==========================================
    // Quantity handlers
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

    // ==========================================
    // Remove
    // ==========================================
    const handleRemove = async () => {
        if (removing) return;
        setRemoving(true);
        await removeItem(product._id);
        setRemoving(false);
    };

    return (
        <div
            className={`flex gap-3 py-4 border-b border-neutral-100 last:border-b-0 transition-opacity ${updating || removing ? "opacity-60" : ""
                }`}
        >
            {/* ==========================================
          IMAGE
      ========================================== */}
            <Link
                to={`/product/${product.slug}`}
                onClick={onCloseDrawer}
                className="shrink-0 w-16 h-16 rounded-lg bg-neutral-100 overflow-hidden border border-neutral-100"
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
                    onClick={onCloseDrawer}
                    className="text-sm font-medium text-neutral-900 hover:text-primary-600 transition-colors line-clamp-2"
                >
                    {product.name}
                </Link>

                {/* Unit price + stock warning */}
                <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-neutral-500">
                        {formatPrice(product.price, product.currency)}
                    </span>
                    {isOutOfStock && (
                        <span className="text-[10px] font-semibold uppercase tracking-wide text-error-600 bg-error-50 px-1.5 py-0.5 rounded">
                            Out of stock
                        </span>
                    )}
                    {!isOutOfStock && isAtMax && (
                        <span className="text-[10px] font-medium text-amber-600">
                            Max
                        </span>
                    )}
                </div>

                {/* Quantity + remove row */}
                <div className="flex items-center justify-between mt-2">
                    {/* Compact quantity selector */}
                    <div className="inline-flex items-center border border-neutral-200 rounded-lg overflow-hidden">
                        <button
                            type="button"
                            onClick={handleDecrement}
                            disabled={updating || removing || quantity <= 1}
                            className="w-7 h-7 flex items-center justify-center text-neutral-600 hover:bg-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            aria-label="Decrease quantity"
                        >
                            <MinusIcon />
                        </button>
                        <span className="w-8 text-center text-sm font-medium text-neutral-900 tabular-nums">
                            {quantity}
                        </span>
                        <button
                            type="button"
                            onClick={handleIncrement}
                            disabled={updating || removing || isAtMax}
                            className="w-7 h-7 flex items-center justify-center text-neutral-600 hover:bg-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            aria-label="Increase quantity"
                        >
                            <PlusIcon />
                        </button>
                    </div>

                    {/* Remove */}
                    <button
                        type="button"
                        onClick={handleRemove}
                        disabled={updating || removing}
                        className="p-1 text-neutral-400 hover:text-error-600 disabled:opacity-40 transition-colors"
                        aria-label="Remove from cart"
                    >
                        <TrashIcon />
                    </button>
                </div>
            </div>

            {/* ==========================================
          SUBTOTAL (right column)
      ========================================== */}
            <div className="shrink-0 text-right">
                <span className="text-sm font-semibold text-neutral-900 tabular-nums">
                    {formatPrice(subtotal, product.currency)}
                </span>
            </div>
        </div>
    );
};

// ==========================================
// Inline icons
// ==========================================
const MinusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
);

const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
);

const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 6h18" />
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
        <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
);

const ImagePlaceholderIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
        <circle cx="9" cy="9" r="2" />
        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
    </svg>
);