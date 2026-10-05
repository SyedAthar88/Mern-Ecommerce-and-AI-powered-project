import { useState, useEffect } from "react";
import toast from "react-hot-toast";

import { usePageTitle } from "../../hooks/usePageTitle.js";
import { useDebounce } from "../../hooks/useDebounce.js";
import { productApi } from "../../api/product.api.js";
import { categoryApi } from "../../api/category.api.js";
import { Section } from "../../components/ui/Section.jsx";
import { Button } from "../../components/ui/Button.jsx";
import { Select } from "../../components/ui/Select.jsx";
import { ConfirmDialog } from "../../components/ui/ConfirmDialog.jsx";
import { Pagination } from "../../components/ui/Pagination.jsx";
import { ProductsTable } from "../../components/admin/ProductsTable.jsx";
import { ProductFormModal } from "../../components/admin/ProductFormModal.jsx";

const PAGE_SIZE = 10;

// ==========================================
// Sort options
// ==========================================
const SORT_OPTIONS = [
    { value: "newest", label: "Newest first" },
    { value: "oldest", label: "Oldest first" },
    { value: "price_asc", label: "Price: Low to high" },
    { value: "price_desc", label: "Price: High to low" },
    { value: "name_asc", label: "Name: A-Z" },
    { value: "name_desc", label: "Name: Z-A" },
];

// ==========================================
// Status options
// ==========================================
const STATUS_OPTIONS = [
    { value: "all", label: "All statuses" },
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
];

export default function AdminProducts() {
    usePageTitle("Products");

    // ---- Data state ----
    const [products, setProducts] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [loading, setLoading] = useState(true);

    // ---- Filters ----
    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [sortBy, setSortBy] = useState("newest");
    const [page, setPage] = useState(1);

    // ---- Categories (for filter + form) ----
    const [categories, setCategories] = useState([]);

    // ---- Modal state ----
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [deletingProduct, setDeletingProduct] = useState(null);
    const [deleting, setDeleting] = useState(false);

    // ---- Debounce search ----
    const debouncedSearch = useDebounce(search, 400);

    // ==========================================
    // Fetch categories (for filter dropdown)
    // ==========================================
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await categoryApi.getDropdown();
                setCategories(res.data.data.categories);
            } catch {
                // Silent fail — filter will just have no options
            }
        };
        fetchCategories();
    }, []);

    // ==========================================
    // Reset page when filters change
    // ==========================================
    useEffect(() => {
        setPage(1);
    }, [debouncedSearch, categoryFilter, statusFilter, sortBy]);

    // ==========================================
    // Fetch products
    // ==========================================
    useEffect(() => {
        let cancelled = false;

        const fetchProducts = async () => {
            try {
                setLoading(true);

                const params = {
                    page,
                    limit: PAGE_SIZE,
                    sort: sortBy,
                };

                if (debouncedSearch.trim()) params.search = debouncedSearch.trim();
                if (categoryFilter) params.category = categoryFilter;
                if (statusFilter !== "all") params.status = statusFilter;

                const res = await productApi.getAll(params);
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
    }, [page, debouncedSearch, categoryFilter, statusFilter, sortBy]);

    // ==========================================
    // Handlers
    // ==========================================
    const handleAddClick = () => {
        setEditingProduct(null);
        setShowCreateModal(true);
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setShowCreateModal(false);
    };

    const handleDelete = (product) => {
        setDeletingProduct(product);
    };

    const handleFormClose = () => {
        setShowCreateModal(false);
        setEditingProduct(null);
    };

    const handleFormSuccess = (savedProduct, isNew) => {
        if (isNew) {
            // Prepend new product (matches "newest first" default sort)
            setProducts((prev) => [savedProduct, ...prev]);

            // If we've now exceeded PAGE_SIZE, drop the last one
            if (products.length >= PAGE_SIZE) {
                setProducts((prev) => prev.slice(0, PAGE_SIZE));
            }

            // Increment total
            setPagination((prev) =>
                prev ? { ...prev, total: prev.total + 1 } : prev
            );
        } else {
            // Replace in place
            setProducts((prev) =>
                prev.map((p) => (p._id === savedProduct._id ? savedProduct : p))
            );
        }
    };

    const handleConfirmDelete = async () => {
        if (!deletingProduct) return;

        setDeleting(true);
        try {
            await productApi.delete(deletingProduct._id);

            const wasLastOnPage = products.length === 1;

            setProducts((prev) =>
                prev.filter((p) => p._id !== deletingProduct._id)
            );

            setPagination((prev) =>
                prev ? { ...prev, total: Math.max(0, prev.total - 1) } : prev
            );

            if (wasLastOnPage && page > 1) {
                setPage(page - 1);
            }

            toast.success(`${deletingProduct.name} deleted successfully`);
            setDeletingProduct(null);
        } catch (err) {
            const message =
                err.response?.data?.message ||
                "Failed to delete product. Please try again.";
            toast.error(message);
        } finally {
            setDeleting(false);
        }
    };

    const handleClearFilters = () => {
        setSearch("");
        setCategoryFilter("");
        setStatusFilter("all");
        setSortBy("newest");
    };

    // ==========================================
    // Derived data
    // ==========================================
    const categoryOptions = [
        { value: "", label: "All categories" },
        ...categories.map((c) => ({ value: c._id, label: c.name })),
    ];

    const hasActiveFilters =
        search ||
        categoryFilter ||
        statusFilter !== "all" ||
        sortBy !== "newest";

    const getCountText = () => {
        if (!pagination) return "Loading products...";
        const { total } = pagination;
        if (total === 0) return "No products found";
        return `${total} product${total === 1 ? "" : "s"}`;
    };

    // ==========================================
    // Render
    // ==========================================
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {/* ============ HEADER ============ */}
            <div className="mb-8 flex items-start justify-between gap-4 flex-wrap animate-fade-in">
                <div>
                    <h1 className="text-3xl font-bold text-neutral-900">Products</h1>
                    <p className="mt-1 text-neutral-600">{getCountText()}</p>
                </div>
                <Button
                    variant="primary"
                    onClick={handleAddClick}
                    leftIcon={<PlusIcon />}
                >
                    Add Product
                </Button>
            </div>

            {/* ============ FILTERS ============ */}
            <div className="mb-5 flex flex-col lg:flex-row gap-3">
                {/* Search */}
                <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
                        <SearchIcon />
                    </div>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by name, description, or tags..."
                        className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-neutral-300 bg-white text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-colors"
                    />
                </div>

                {/* Category filter */}
                <div className="w-full lg:w-48">
                    <Select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        options={categoryOptions}
                    />
                </div>

                {/* Status filter */}
                <div className="w-full lg:w-40">
                    <Select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        options={STATUS_OPTIONS}
                    />
                </div>

                {/* Sort */}
                <div className="w-full lg:w-48">
                    <Select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        options={SORT_OPTIONS}
                    />
                </div>

                {/* Clear filters */}
                {hasActiveFilters && (
                    <button
                        type="button"
                        onClick={handleClearFilters}
                        className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors px-3 py-2 whitespace-nowrap"
                    >
                        Clear filters
                    </button>
                )}
            </div>

            {/* ============ TABLE + PAGINATION ============ */}
            <Section noBorder className="!p-0 overflow-hidden">
                <ProductsTable
                    products={products}
                    loading={loading}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />

                {!loading && pagination && pagination.totalPages > 1 && (
                    <div className="border-t border-neutral-100 px-4 py-4">
                        <Pagination
                            page={pagination.page}
                            totalPages={pagination.totalPages}
                            hasNext={pagination.hasNext}
                            hasPrev={pagination.hasPrev}
                            onPageChange={setPage}
                        />
                    </div>
                )}
            </Section>

            {/* ============ MODALS ============ */}
            <ProductFormModal
                open={showCreateModal || !!editingProduct}
                onClose={handleFormClose}
                product={editingProduct}
                onSuccess={handleFormSuccess}
            />

            <ConfirmDialog
                open={!!deletingProduct}
                onClose={() => setDeletingProduct(null)}
                onConfirm={handleConfirmDelete}
                title="Delete product?"
                message={`Are you sure you want to delete "${deletingProduct?.name}"? This action cannot be undone.`}
                confirmText="Delete product"
                variant="danger"
                loading={deleting}
            />
        </div>
    );
}

// ==========================================
// Inline icons
// ==========================================
const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
);

const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
);