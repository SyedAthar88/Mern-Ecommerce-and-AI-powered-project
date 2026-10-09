import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useCart } from "../../hooks/useCart.js";
import { PriceDisplay } from "./PriceDisplay.jsx";
import { RatingStars } from "./RatingStars.jsx";

// ==========================================
// ProductCard — product tile for grids
// ==========================================
export const ProductCard = ({ product, onAddToCart }) => {
    const { addItem, openDrawer } = useCart();
    const [imageFailed, setImageFailed] = useState(false);
    const [adding, setAdding] = useState(false);

    const hasImage = product.images?.[0]?.url && !imageFailed;
    const mainImage = product.images?.[0]?.url;
    const isOutOfStock = product.stock === 0;
    const isOnSale =
        product.compareAtPrice !== null &&
        product.compareAtPrice !== undefined &&
        product.compareAtPrice > product.price;

    const handleAddToCart = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (isOutOfStock || adding) return;

        // If parent provided a custom handler, use it
        if (onAddToCart) {
            onAddToCart(product);
            return;
        }

        // Default: add to cart
        setAdding(true);
        const success = await addItem(product._id, 1);
        setAdding(false);

        if (success) {
            toast.success("Added to cart");
            openDrawer();
        }
    };
    return (
        <Link
            to={`/product/${product.slug}`}
            className="group block bg-white rounded-xl border border-neutral-100 overflow-hidden hover:shadow-card hover:-translate-y-0.5 transition-all duration-200"
        >
            {/* ============ IMAGE ============ */}
            <div className="relative aspect-square bg-neutral-100 overflow-hidden">
                {hasImage ? (
                    <img
                        src={mainImage}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                        onError={() => setImageFailed(true)}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <ImagePlaceholderIcon />
                    </div>
                )}

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                    {isOnSale && !isOutOfStock && (
                        <span className="text-xs font-semibold bg-error-600 text-white px-2 py-0.5 rounded shadow-sm">
                            Sale
                        </span>
                    )}
                    {product.isFeatured && !isOutOfStock && (
                        <span className="text-xs font-semibold bg-amber-500 text-white px-2 py-0.5 rounded shadow-sm">
                            Featured
                        </span>
                    )}
                </div>

                {/* Out of stock overlay */}
                {isOutOfStock && (
                    <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center">
                        <span className="text-sm font-semibold text-neutral-700 bg-white px-3 py-1.5 rounded-lg shadow-sm">
                            Out of stock
                        </span>
                    </div>
                )}
            </div>

            {/* ============ INFO ============ */}
            <div className="p-4 flex flex-col">
                <h3 className="font-medium text-neutral-900 text-sm leading-tight line-clamp-2 min-h-[2.5rem]">
                    {product.name}
                </h3>

                <div className="mt-1.5">
                    <RatingStars
                        value={product.ratings?.average || 0}
                        count={product.ratings?.count || 0}
                        size="sm"
                        showCount={false}
                    />
                </div>

                <div className="mt-3">
                    <PriceDisplay
                        price={product.price}
                        compareAtPrice={product.compareAtPrice}
                        currency={product.currency}
                        size="md"
                    />
                </div>

                {/* Add to cart button */}
                <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={isOutOfStock || adding}
                    className="mt-3 w-full h-9 text-sm font-medium rounded-lg bg-primary-600 text-white hover:bg-primary-700 disabled:bg-neutral-200 disabled:text-neutral-400 disabled:cursor-not-allowed transition-colors"
                >
                    {isOutOfStock ? "Out of stock" : adding ? "Adding..." : "Add to cart"}
                </button>
            </div>
        </Link>
    );
};

// ==========================================
// Inline icon
// ==========================================
const ImagePlaceholderIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="48"
        height="48"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-neutral-300"
    >
        <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
        <circle cx="9" cy="9" r="2" />
        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
    </svg>
);