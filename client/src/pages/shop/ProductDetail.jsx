import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import { usePageTitle } from "../../hooks/usePageTitle.js";
import { productApi } from "../../api/product.api.js";
import { ProductGallery } from "../../components/shop/ProductGallery.jsx";
import { QuantitySelector } from "../../components/shop/QuantitySelector.jsx";
import { PriceDisplay } from "../../components/shop/PriceDisplay.jsx";
import { RatingStars } from "../../components/shop/RatingStars.jsx";
import { Button } from "../../components/ui/Button.jsx";
import { Skeleton } from "../../components/ui/Skeleton.jsx";

export default function ProductDetail() {
    const { slug } = useParams();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [quantity, setQuantity] = useState(1);

    usePageTitle(product?.name || "Product");

    // ==========================================
    // Fetch product by slug
    // ==========================================
    useEffect(() => {
        let cancelled = false;

        const fetchProduct = async () => {
            try {
                setLoading(true);
                setNotFound(false);

                const res = await productApi.getPublicBySlug(slug);
                if (cancelled) return;

                setProduct(res.data.data.product);
            } catch (err) {
                if (cancelled) return;

                if (err.response?.status === 404) {
                    setNotFound(true);
                } else {
                    toast.error(
                        err.response?.data?.message || "Failed to load product"
                    );
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        fetchProduct();
        return () => {
            cancelled = true;
        };
    }, [slug]);

    // ==========================================
    // Reset quantity when product changes
    // ==========================================
    useEffect(() => {
        setQuantity(1);
    }, [slug]);

    // ==========================================
    // Loading state
    // ==========================================
    if (loading) {
        return <ProductDetailSkeleton />;
    }

    // ==========================================
    // Not found
    // ==========================================
    if (notFound || !product) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="max-w-md mx-auto text-center">
                    <div className="mx-auto w-20 h-20 rounded-full bg-error-50 flex items-center justify-center mb-6">
                        <AlertIcon />
                    </div>
                    <h1 className="text-2xl font-bold text-neutral-900 mb-2">
                        Product not found
                    </h1>
                    <p className="text-neutral-600 mb-8">
                        The product you're looking for doesn't exist or is no longer
                        available.
                    </p>
                    <Link to="/shop">
                        <Button variant="primary" size="lg">
                            Continue shopping
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    // ==========================================
    // Derived
    // ==========================================
    const isOutOfStock = product.stock === 0;
    const isLowStock = !isOutOfStock && product.stock <= 5;
    const inStock = !isOutOfStock;

    const categoryName = product.category?.name || "Uncategorized";
    const categorySlug = product.category?.slug;

    // ==========================================
    // Add to cart (placeholder for Phase 19)
    // ==========================================
    const handleAddToCart = () => {
        toast(`Added ${quantity} × ${product.name} — Cart coming in Phase 19`, {
            icon: "🛒",
        });
    };

    // ==========================================
    // Render
    // ==========================================
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* ==========================================
          BREADCRUMB
      ========================================== */}
            <nav className="mb-6 flex items-center gap-1.5 text-sm flex-wrap">
                <Link
                    to="/"
                    className="text-neutral-500 hover:text-neutral-900 transition-colors"
                >
                    Home
                </Link>
                <ChevronRightSmall />
                <Link
                    to="/shop"
                    className="text-neutral-500 hover:text-neutral-900 transition-colors"
                >
                    Shop
                </Link>
                {categorySlug && (
                    <>
                        <ChevronRightSmall />
                        <Link
                            to={`/shop/${categorySlug}`}
                            className="text-neutral-500 hover:text-neutral-900 transition-colors"
                        >
                            {categoryName}
                        </Link>
                    </>
                )}
                <ChevronRightSmall />
                <span className="text-neutral-900 font-medium truncate max-w-[200px]">
                    {product.name}
                </span>
            </nav>

            {/* ==========================================
          MAIN LAYOUT
      ========================================== */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                {/* ---------- LEFT: GALLERY ---------- */}
                <ProductGallery images={product.images} alt={product.name} />

                {/* ---------- RIGHT: INFO ---------- */}
                <div className="flex flex-col">
                    {/* Name */}
                    <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 leading-tight">
                        {product.name}
                    </h1>

                    {/* Rating */}
                    {product.ratings?.count > 0 && (
                        <div className="mt-3">
                            <RatingStars
                                value={product.ratings.average}
                                count={product.ratings.count}
                                size="md"
                                showCount
                            />
                        </div>
                    )}

                    {/* Price */}
                    <div className="mt-5">
                        <PriceDisplay
                            price={product.price}
                            compareAtPrice={product.compareAtPrice}
                            currency={product.currency}
                            size="lg"
                            showDiscount
                        />
                    </div>

                    {/* Short description */}
                    {product.shortDescription && (
                        <p className="mt-5 text-neutral-600 leading-relaxed">
                            {product.shortDescription}
                        </p>
                    )}

                    {/* Stock status */}
                    <div className="mt-5">
                        <StockStatus
                            stock={product.stock}
                            isOutOfStock={isOutOfStock}
                            isLowStock={isLowStock}
                        />
                    </div>

                    {/* Divider */}
                    <div className="my-6 border-t border-neutral-200" />

                    {/* Quantity + Add to cart */}
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                        <div>
                            <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-2">
                                Quantity
                            </p>
                            <QuantitySelector
                                value={quantity}
                                onChange={setQuantity}
                                min={1}
                                max={Math.min(product.stock, 99)}
                                disabled={isOutOfStock}
                            />
                        </div>
                    </div>

                    {/* Add to cart button */}
                    <div className="mt-5">
                        <Button
                            variant="primary"
                            size="lg"
                            fullWidth
                            disabled={isOutOfStock}
                            onClick={handleAddToCart}
                            leftIcon={<CartIcon />}
                        >
                            {isOutOfStock ? "Out of stock" : "Add to cart"}
                        </Button>
                    </div>

                    {/* Tags */}
                    {product.tags && product.tags.length > 0 && (
                        <div className="mt-6 pt-6 border-t border-neutral-200">
                            <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-2">
                                Tags
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {product.tags.map((tag) => (
                                    <Link
                                        key={tag}
                                        to={`/shop?search=${encodeURIComponent(tag)}`}
                                        className="text-xs px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-600 hover:bg-neutral-200 transition-colors"
                                    >
                                        #{tag}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* ==========================================
          DESCRIPTION SECTION
      ========================================== */}
            <div className="mt-12 pt-8 border-t border-neutral-200">
                <h2 className="text-xl font-bold text-neutral-900 mb-4">
                    Product Description
                </h2>
                <div className="prose prose-neutral max-w-none text-neutral-700 whitespace-pre-line leading-relaxed">
                    {product.description}
                </div>
            </div>
        </div>
    );
}

// ==========================================
// StockStatus — color-coded stock display
// ==========================================
const StockStatus = ({ stock, isOutOfStock, isLowStock }) => {
    if (isOutOfStock) {
        return (
            <div className="inline-flex items-center gap-2 text-error-600">
                <span className="w-2 h-2 rounded-full bg-error-600" />
                <span className="text-sm font-medium">Out of stock</span>
            </div>
        );
    }

    if (isLowStock) {
        return (
            <div className="inline-flex items-center gap-2 text-warning-600">
                <span className="w-2 h-2 rounded-full bg-warning-600 animate-pulse" />
                <span className="text-sm font-medium">
                    Only {stock} left in stock
                </span>
            </div>
        );
    }

    return (
        <div className="inline-flex items-center gap-2 text-emerald-600">
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
            <span className="text-sm font-medium">
                In stock ({stock} available)
            </span>
        </div>
    );
};

// ==========================================
// ProductDetailSkeleton — loading placeholder
// ==========================================
const ProductDetailSkeleton = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb skeleton */}
        <div className="mb-6 flex items-center gap-2">
            <Skeleton variant="text" className="w-16" />
            <Skeleton variant="text" className="w-16" />
            <Skeleton variant="text" className="w-32" />
        </div>

        {/* Main grid skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            <Skeleton className="aspect-square rounded-2xl" />

            <div className="flex flex-col gap-4">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-10 w-40 mt-3" />
                <Skeleton variant="text" className="w-full mt-4" />
                <Skeleton variant="text" className="w-5/6" />
                <Skeleton className="h-4 w-32 mt-4" />
                <Skeleton className="h-12 w-full mt-6" />
            </div>
        </div>
    </div>
);

// ==========================================
// Inline icons
// ==========================================
const ChevronRightSmall = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-400 shrink-0">
        <polyline points="9 18 15 12 9 6" />
    </svg>
);

const CartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
);

const AlertIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-error-600">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
);