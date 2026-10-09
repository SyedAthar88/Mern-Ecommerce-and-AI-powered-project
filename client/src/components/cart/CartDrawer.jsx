import { useEffect } from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useCart } from "../../hooks/useCart.js";
import { CartDrawerItem } from "./CartDrawerItem.jsx";
import { Button } from "../ui/Button.jsx";

// ==========================================
// CartDrawer — slide-in panel
// ==========================================
export const CartDrawer = () => {
    const {
        cart,
        isDrawerOpen,
        loading,
        closeDrawer,
    } = useCart();
    const navigate = useNavigate();

    const items = cart?.items || [];
    const hasItems = items.length > 0;

    // ==========================================
    // ESC key → close
    // ==========================================
    useEffect(() => {
        if (!isDrawerOpen) return;

        const handler = (e) => {
            if (e.key === "Escape") closeDrawer();
        };

        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, [isDrawerOpen, closeDrawer]);

    // ==========================================
    // Lock body scroll when open
    // ==========================================
    useEffect(() => {
        if (!isDrawerOpen) return;

        const original = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = original;
        };
    }, [isDrawerOpen]);

    // ==========================================
    // View cart → navigate + close
    // ==========================================
    const handleViewCart = () => {
        closeDrawer();
        navigate("/cart");
    };

    // ==========================================
    // Checkout (Phase 20)
    // ==========================================
    const handleCheckout = () => {
        toast("Checkout coming in Phase 20", { icon: "💳" });
    };

    // ==========================================
    // Render via portal
    // ==========================================
    return createPortal(
        <div
            className={`fixed inset-0 z-50 ${isDrawerOpen ? "" : "pointer-events-none"
                }`}
            aria-hidden={!isDrawerOpen}
        >
            {/* ==========================================
          BACKDROP
      ========================================== */}
            <div
                className={`absolute inset-0 bg-neutral-900/50 backdrop-blur-sm transition-opacity duration-300 ${isDrawerOpen ? "opacity-100" : "opacity-0"
                    }`}
                onClick={closeDrawer}
            />

            {/* ==========================================
          PANEL
      ========================================== */}
            <div
                className={`
          absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl
          flex flex-col
          transition-transform duration-300 ease-out
          ${isDrawerOpen ? "translate-x-0" : "translate-x-full"}
        `}
                role="dialog"
                aria-label="Shopping cart"
            >
                {/* ==========================================
            HEADER
        ========================================== */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100">
                    <h2 className="text-lg font-semibold text-neutral-900">
                        Your Cart
                        {cart?.itemCount > 0 && (
                            <span className="ml-2 text-sm font-normal text-neutral-500">
                                ({cart.itemCount} {cart.itemCount === 1 ? "item" : "items"})
                            </span>
                        )}
                    </h2>

                    <button
                        type="button"
                        onClick={closeDrawer}
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
                        aria-label="Close cart"
                    >
                        <CloseIcon />
                    </button>
                </div>

                {/* ==========================================
            BODY
        ========================================== */}
                {loading && !hasItems ? (
                    // Initial load
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-center">
                            <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                            <p className="text-sm text-neutral-500">Loading cart...</p>
                        </div>
                    </div>
                ) : !hasItems ? (
                    // Empty state
                    <div className="flex-1 flex items-center justify-center px-6">
                        <div className="text-center">
                            <div className="mx-auto w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mb-4">
                                <CartEmptyIcon />
                            </div>
                            <h3 className="text-lg font-semibold text-neutral-900 mb-1">
                                Your cart is empty
                            </h3>
                            <p className="text-sm text-neutral-500 mb-6">
                                Add some products to get started.
                            </p>
                            <Button
                                variant="primary"
                                onClick={() => {
                                    closeDrawer();
                                    navigate("/shop");
                                }}
                            >
                                Start shopping
                            </Button>
                        </div>
                    </div>
                ) : (
                    // Items list
                    <div className="flex-1 overflow-y-auto px-5">
                        {items.map((item) => (
                            <CartDrawerItem
                                key={item.product._id}
                                item={item}
                                onCloseDrawer={closeDrawer}
                            />
                        ))}
                    </div>
                )}

                {/* ==========================================
            FOOTER
        ========================================== */}
                {hasItems && (
                    <div className="border-t border-neutral-100 px-5 py-4 bg-neutral-50/50">
                        {/* Subtotal */}
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-sm font-medium text-neutral-600">
                                Subtotal
                            </span>
                            <span className="text-lg font-bold text-neutral-900 tabular-nums">
                                ${cart.subtotal.toFixed(2)}
                            </span>
                        </div>

                        <p className="text-xs text-neutral-500 mb-4">
                            Shipping and taxes calculated at checkout.
                        </p>

                        {/* Actions */}
                        <div className="flex gap-2">
                            <Button
                                variant="secondary"
                                onClick={handleViewCart}
                                fullWidth
                            >
                                View Cart
                            </Button>
                            <Button
                                variant="primary"
                                onClick={handleCheckout}
                                fullWidth
                                disabled={loading}
                            >
                                Checkout
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>,
        document.body
    );
};

// ==========================================
// Inline icons
// ==========================================
const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
);

const CartEmptyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-400">
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
);