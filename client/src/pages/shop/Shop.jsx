import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { usePageTitle } from "../../hooks/usePageTitle.js";
import { useDebounce } from "../../hooks/useDebounce.js";
import { productApi } from "../../api/product.api.js";
import { categoryApi } from "../../api/category.api.js";
import { ProductGrid } from "../../components/shop/ProductGrid.jsx";
import { ShopFilters } from "../../components/shop/ShopFilters.jsx";
import { Pagination } from "../../components/ui/Pagination.jsx";

const PAGE_SIZE = 12;

export default function Shop() {
  const { categorySlug } = useParams();
  const navigate = useNavigate();

  usePageTitle("Shop");

  // ---- Data ----
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);

  // ---- Categories (for dropdown) ----
  const [categories, setCategories] = useState([]);

  // ---- Filters ----
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [page, setPage] = useState(1);

  // Category comes from URL (route param)
  const categoryFilter = categorySlug || "";

  const debouncedSearch = useDebounce(search, 400);

  // ==========================================
  // Fetch categories on mount
  // ==========================================
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await categoryApi.getPublic();
        setCategories(res.data.data.categories);
      } catch {
        // silent
      }
    };
    fetchCategories();
  }, []);

  // ==========================================
  // Reset page when any filter changes
  // ==========================================
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, categoryFilter, sortBy, minPrice, maxPrice]);

  // ==========================================
  // Fetch products
  // ==========================================
  useEffect(() => {
    let cancelled = false;

    const fetchProducts = async () => {
      try {
        setLoading(true);

        const params = { page, limit: PAGE_SIZE, sort: sortBy };
        if (debouncedSearch.trim()) params.search = debouncedSearch.trim();
        if (categoryFilter) params.category = categoryFilter;

        // Price range — only send valid values
        const min = Number(minPrice);
        const max = Number(maxPrice);
        if (!isNaN(min) && minPrice !== "" && min >= 0) {
          params.minPrice = min;
        }
        if (!isNaN(max) && maxPrice !== "" && max >= 0) {
          params.maxPrice = max;
        }

        const res = await productApi.getPublic(params);
        if (cancelled) return;

        setProducts(res.data.data.products);
        setPagination(res.data.data.pagination);
      } catch (err) {
        if (cancelled) return;
        toast.error(err.response?.data?.message || "Failed to load products");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchProducts();
    return () => {
      cancelled = true;
    };
  }, [page, debouncedSearch, categoryFilter, sortBy, minPrice, maxPrice]);

  // ==========================================
  // Handlers
  // ==========================================
  const handleCategoryChange = (slug) => {
    if (slug) {
      navigate(`/shop/${slug}`);
    } else {
      navigate("/shop");
    }
  };

  const handleClearFilters = () => {
    setSearch("");
    setSortBy("newest");
    setMinPrice("");
    setMaxPrice("");
    navigate("/shop");
  };

  // ==========================================
  // Derived
  // ==========================================
  const hasActiveFilters =
    !!search ||
    !!categoryFilter ||
    sortBy !== "newest" ||
    minPrice !== "" ||
    maxPrice !== "";

  // Find current category (for title)
  const currentCategory = categories.find((c) => c.slug === categoryFilter);
  const pageTitle = currentCategory ? currentCategory.name : "Shop";

  const getCountText = () => {
    if (!pagination) return "Loading products...";
    const { total } = pagination;
    if (total === 0) return "No products found";
    return `${total} product${total === 1 ? "" : "s"}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900">
          {pageTitle}
        </h1>
        <p className="mt-2 text-neutral-600">
          {currentCategory?.description || getCountText()}
        </p>
      </div>

      {/* Filters */}
      <ShopFilters
        search={search}
        onSearchChange={setSearch}
        categories={categories}
        categoryFilter={categoryFilter}
        onCategoryChange={handleCategoryChange}
        sortBy={sortBy}
        onSortChange={setSortBy}
        minPrice={minPrice}
        onMinPriceChange={setMinPrice}
        maxPrice={maxPrice}
        onMaxPriceChange={setMaxPrice}
        hasActiveFilters={hasActiveFilters}
        onClearFilters={handleClearFilters}
      />

      {/* Grid */}
      <ProductGrid
        products={products}
        loading={loading}
        emptyTitle={hasActiveFilters ? "No products match your filters" : "No products found"}
        emptyMessage={
          hasActiveFilters
            ? "Try adjusting your filters or search terms."
            : "Check back later for new arrivals."
        }
      />

      {/* Pagination */}
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