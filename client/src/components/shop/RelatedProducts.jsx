import { useState, useEffect } from "react";

import { productApi } from "../../api/product.api.js";
import { ProductCard } from "./ProductCard.jsx";
import { Skeleton } from "../ui/Skeleton.jsx";

// ==========================================
// RelatedProducts — "You may also like"
// Fetches products from the same category
// ==========================================
export const RelatedProducts = ({ currentProductId, categorySlug }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // ==========================================
    // Fetch related products
    // ==========================================
    useEffect(() => {
        if (!categorySlug) {
            setLoading(false);
            return;
        }

        let cancelled = false;

        const fetchRelated = async () => {
            try {
                setLoading(true);

                const res = await productApi.getPublic({
                    category: categorySlug,
                    limit: 5,
                    sort: "popular",
                });

                if (cancelled) return;

                // Filter out the current product, take first 4
                const filtered = res.data.data.products
                    .filter((p) => p._id !== currentProductId)
                    .slice(0, 4);

                setProducts(filtered);
            } catch {
                // Silent fail — related is a nice-to-have
                if (!cancelled) setProducts([]);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        fetchRelated();
        return () => {
            cancelled = true;
        };
    }, [currentProductId, categorySlug]);

    // ==========================================
    // Loading — skeleton cards
    // ==========================================
    if (loading) {
        return (
            <section className="mt-16 pt-10 border-t border-neutral-200">
                <h2 className="text-xl font-bold text-neutral-900 mb-6">
                    You may also like
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <CardSkeleton key={i} />
                    ))}
                </div>
            </section>
        );
    }

    // ==========================================
    // Not enough products — hide section
    // ==========================================
    if (products.length < 2) {
        return null;
    }

    // ==========================================
    // Render
    // ==========================================
    return (
        <section className="mt-16 pt-10 border-t border-neutral-200">
            <h2 className="text-xl font-bold text-neutral-900 mb-6">
                You may also like
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                ))}
            </div>
        </section>
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