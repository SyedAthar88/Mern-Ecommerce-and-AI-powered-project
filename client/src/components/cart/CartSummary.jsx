import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { Button } from "../ui/Button.jsx";

// ==========================================
// CartSummary — order summary sidebar
// ==========================================
export const CartSummary = ({ cart }) => {
    const navigate = useNavigate();
    const [checkingOut, setCheckingOut] = useState(false);

    const subtotal = cart?.subtotal || 0;
    const itemCount = cart?.itemCount || 0;

    // ==========================================
    // Checkout (Phase 20)
    // ==========================================
    const handleCheckout = () => {
        if (itemCount === 0) return;

        setCheckingOut(true);
        // Simulate brief delay for UX feedback
        setTimeout(() => {
            setCheckingOut(false);
            toast("Checkout coming in Phase 20", { icon: "💳" });
        }, 400);
    };

    return (
        <div className="bg-white rounded-2xl border border-neutral-100 shadow-soft p-6 lg:sticky lg:top-24">
            {/* ==========================================
          HEADING
      ========================================== */}
            <h2 className="text-lg font-semibold text-neutral-900 mb-6">
                Order Summary
            </h2>

            {/* ==========================================
          LINE ITEMS
      ========================================== */}
            <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                    <span className="text-neutral-600">
                        Subtotal
                        <span className="text-neutral-400 ml-1">
                            ({itemCount} {itemCount === 1 ? "item" : "items"})
                        </span>
                    </span>
                    <span className="font-medium text-neutral-900 tabular-nums">
                        ${subtotal.toFixed(2)}
                    </span>
                </div>

                <div className="flex items-center justify-between">
                    <span className="text-neutral-600">Shipping</span>
                    <span className="text-xs text-neutral-400 italic">
                        Calculated at checkout
                    </span>
                </div>

                <div className="flex items-center justify-between">
                    <span className="text-neutral-600">Tax</span>
                    <span className="text-xs text-neutral-400 italic">
                        Calculated at checkout
                    </span>
                </div>
            </div>

            {/* ==========================================
          TOTAL
      ========================================== */}
            <div className="my-5 pt-5 border-t border-neutral-100">
                <div className="flex items-center justify-between">
                    <span className="text-base font-semibold text-neutral-900">
                        Total
                    </span>
                    <span className="text-xl font-bold text-neutral-900 tabular-nums">
                        ${subtotal.toFixed(2)}
                    </span>
                </div>
            </div>

            {/* ==========================================
          CHECKOUT
      ========================================== */}
            <Button
                variant="primary"
                size="lg"
                fullWidth
                loading={checkingOut}
                disabled={itemCount === 0}
                onClick={handleCheckout}
                rightIcon={!checkingOut ? <ArrowRightIcon /> : null}
            >
                Proceed to Checkout
            </Button>

            {/* ==========================================
          TRUST SIGNAL
      ========================================== */}
            <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-neutral-500">
                <LockIcon />
                <span>Secure checkout</span>
            </div>

            {/* ==========================================
          CONTINUE SHOPPING (mobile only)
      ========================================== */}
            <button
                type="button"
                onClick={() => navigate("/shop")}
                className="mt-4 w-full text-center text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors lg:hidden"
            >
                ← Continue shopping
            </button>
        </div>
    );
};

// ==========================================
// Inline icons
// ==========================================
const ArrowRightIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="12 5 19 12 12 19" />
    </svg>
);

const LockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
);