import { useState, useEffect } from "react";
import toast from "react-hot-toast";

import { usePageTitle } from "../../hooks/usePageTitle.js";
import { productApi } from "../../api/product.api.js";
import { ProductGrid } from "../../components/shop/ProductGrid.jsx";
import { Pagination } from "../../components/ui/Pagination.jsx";

const PAGE_SIZE = 12;

export default function Shop() {
  usePageTitle("Shop");

  // ---- Data state ----
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  // ==========================================
  // Fetch products when page changes
  // ==========================================
  useEffect(() => {
    let cancelled = false;

    const fetchProducts = async () => {
      try {
        setLoading(true);

        const res = await productApi.getPublic({
          page,
          limit: PAGE_SIZE,
        });
        if (cancelled) return;

        setProducts(res.data.data.products);
        setPagination(res.data.data.pagination);
      } catch (err) {
        if (cancelled) return;
        toast.error(
          err.response?.data?.message || "Failed to load products"
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchProducts();
    return () => {
      cancelled = true;
    };
  }, [page]);

  // ==========================================
  // Count text
  // ==========================================
  const getCountText = () => {
    if (!pagination) return "Loading products...";
    const { total } = pagination;
    if (total === 0) return "No products available";
    return `Discover ${total} product${total === 1 ? "" : "s"}`;
  };

  // ==========================================
  // Render
  // ==========================================
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* ============ HEADER ============ */}
      <div className="mb-8 animate-fade-in">
        <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900">
          Shop
        </h1>
        <p className="mt-2 text-neutral-600">{getCountText()}</p>
      </div>

      {/* ============ GRID ============ */}
      <ProductGrid products={products} loading={loading} />

      {/* ============ PAGINATION ============ */}
      {!loading && pagination && pagination.totalPages > 1 && (
        <div className="mt-10">
          <Pagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            hasNext={pagination.hasNext}
            hasPrev={pagination.hasPrev}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  );
}