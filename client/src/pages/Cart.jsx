import { Link } from "react-router-dom";
import { usePageTitle } from "../hooks/usePageTitle.js";
import { useCart } from "../hooks/useCart.js";
import { CartItem } from "../components/cart/CartItem.jsx";
import { CartSummary } from "../components/cart/CartSummary.jsx";
import { Button } from "../components/ui/Button.jsx";
import { Skeleton } from "../components/ui/Skeleton.jsx";

export default function Cart() {
    usePageTitle("Cart");

    const { cart, loading } = useCart();

    const items = cart?.items || [];
    const itemCount = cart?.itemCount || 0;
    const isEmpty = items.length === 0;

    // ==========================================
    // Loading (initial only)
    // ==========================================
    if (loading && items.length === 0) {
        return <CartSkeleton />;
    }

    // ==========================================
    // Empty state
    // ==========================================
    if (isEmpty) {
        return (
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center">
                    <div className="mx-auto w-20 h-20 rounded-full bg-neutral-100 flex items-center justify-center mb-6">
                        <CartEmptyIcon />
                    </div>
                    <h1 className="text-2xl font-bold text-neutral-900 mb-2">
                        Your cart is empty
                    </h1>
                    <p className="text-neutral-600 mb-8 max-w-md mx-auto">
                        Looks like you haven&apos;t added anything yet. Browse our shop and
                        find something you love.
                    </p>
                    <Link to="/shop">
                        <Button variant="primary" size="lg">
                            Browse products
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    // ==========================================
    // Cart with items
    // ==========================================
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {/* ==========================================
          HEADER
      ========================================== */}
            <div className="mb-8 animate-fade-in">
                <h1 className="text-3xl font-bold text-neutral-900">
                    Shopping Cart
                </h1>
                <p className="mt-1 text-neutral-600">
                    {itemCount} {itemCount === 1 ? "item" : "items"} in your cart
                </p>
            </div>

            {/* ==========================================
          MAIN GRID
      ========================================== */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* ============ ITEMS (2/3) ============ */}
                <div className="lg:col-span-2">
                    <div className="space-y-4">
                        {items.map((item) => (
                            <CartItem key={item.product._id} item={item} />
                        ))}
                    </div>

                    {/* Continue shopping — desktop only */}
                    <div className="mt-6 hidden lg:block">
                        <Link
                            to="/shop"
                            className="inline-flex items-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
                        >
                            <ArrowLeftIcon />
                            Continue shopping
                        </Link>
                    </div>
                </div>

                {/* ============ SUMMARY (1/3) ============ */}
                <div className="lg:col-span-1">
                    <CartSummary cart={cart} />
                </div>
            </div>
        </div>
    );
}

// ==========================================
// CartSkeleton — loading placeholder
// ==========================================
const CartSkeleton = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
            <Skeleton className="h-9 w-48 mb-2" />
            <Skeleton variant="text" className="w-32" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
                {Array.from({ length: 2 }).map((_, i) => (
                    <div key={i} className="bg-white rounded-2xl border border-neutral-100 p-6">
                        <div className="flex gap-6">
                            <Skeleton className="w-24 h-24 rounded-lg shrink-0" />
                            <div className="flex-1 space-y-3">
                                <Skeleton variant="text" className="w-3/4" />
                                <Skeleton variant="text" className="w-1/3" />
                                <Skeleton className="h-9 w-32" />
                            </div>
                            <Skeleton className="h-6 w-20" />
                        </div>
                    </div>
                ))}
            </div>

            <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl border border-neutral-100 p-6 space-y-4">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton variant="text" className="w-full" />
                    <Skeleton variant="text" className="w-full" />
                    <Skeleton className="h-12 w-full mt-4" />
                </div>
            </div>
        </div>
    </div>
);

// ==========================================
// Inline icons
// ==========================================
const CartEmptyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-400">
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
);

const ArrowLeftIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="19" y1="12" x2="5" y2="12" />
        <polyline points="12 19 5 12 12 5" />
    </svg>
);