import { ProductCard } from "./ProductCard.jsx";
import { Skeleton } from "../ui/Skeleton.jsx";

// ==========================================
// ProductGrid — responsive grid of ProductCards
// ==========================================
export const ProductGrid = ({
    products,
    loading,
    onAddToCart,
    emptyTitle = "No products found",
    emptyMessage = "Try adjusting your filters or check back later.",
}) => {
    // ==========================================
    // Loading — skeleton cards
    // ==========================================
    if (loading) {
        return (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                    <CardSkeleton key={i} />
                ))}
            </div>
        );
    }

    // ==========================================
    // Empty
    // ==========================================
    if (!products || products.length === 0) {
        return (
            <div className="text-center py-16">
                <div className="mx-auto w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mb-4">
                    <EmptyIcon />
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-1">
                    {emptyTitle}
                </h3>
                <p className="text-sm text-neutral-500 max-w-sm mx-auto">
                    {emptyMessage}
                </p>
            </div>
        );
    }

    // ==========================================
    // Data
    // ==========================================
    return (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product) => (
                <ProductCard
                    key={product._id}
                    product={product}
                    onAddToCart={onAddToCart}
                />
            ))}
        </div>
    );
};

// ==========================================
// CardSkeleton — matches ProductCard layout
// ==========================================
const CardSkeleton = () => (
    <div className="bg-white rounded-xl border border-neutral-100 overflow-hidden">
        <Skeleton className="aspect-square rounded-none" />
        <div className="p-4 space-y-3">
            <Skeleton variant="text" className="w-full" />
            <Skeleton variant="text" className="w-3/4" />
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-9 w-full rounded-lg" />
        </div>
    </div>
);

// ==========================================
// Empty state icon
// ==========================================
const EmptyIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-neutral-400"
    >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
);