import { Input } from "../ui/Input.jsx";
import { Select } from "../ui/Select.jsx";

// ==========================================
// ShopFilters — search, category, price, sort
// ==========================================
export const ShopFilters = ({
    search,
    onSearchChange,
    categories,
    categoryFilter,
    onCategoryChange,
    sortBy,
    onSortChange,
    minPrice,
    onMinPriceChange,
    maxPrice,
    onMaxPriceChange,
    hasActiveFilters,
    onClearFilters,
}) => {
    // ==========================================
    // Options
    // ==========================================
    const categoryOptions = [
        { value: "", label: "All categories" },
        ...categories.map((c) => ({
            value: c.slug,
            label: c.name,
        })),
    ];

    const sortOptions = [
        { value: "newest", label: "Newest first" },
        { value: "price_asc", label: "Price: Low to High" },
        { value: "price_desc", label: "Price: High to Low" },
        { value: "name_asc", label: "Name: A-Z" },
        { value: "name_desc", label: "Name: Z-A" },
        { value: "popular", label: "Most popular" },
    ];

    return (
        <div className="mb-6 bg-white rounded-xl border border-neutral-100 p-4 sm:p-5">
            {/* ============ SEARCH ============ */}
            <div className="mb-4">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
                        <SearchIcon />
                    </div>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="Search products..."
                        className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-neutral-300 bg-white text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-colors"
                    />
                </div>
            </div>

            {/* ============ FILTER ROW ============ */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {/* Category */}
                <div>
                    <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wider mb-1.5">
                        Category
                    </label>
                    <Select
                        value={categoryFilter}
                        onChange={(e) => onCategoryChange(e.target.value)}
                        options={categoryOptions}
                    />
                </div>

                {/* Sort */}
                <div>
                    <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wider mb-1.5">
                        Sort by
                    </label>
                    <Select
                        value={sortBy}
                        onChange={(e) => onSortChange(e.target.value)}
                        options={sortOptions}
                    />
                </div>

                {/* Min price */}
                <div>
                    <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wider mb-1.5">
                        Min price
                    </label>
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-neutral-400 text-sm pointer-events-none">
                            $
                        </span>
                        <input
                            type="number"
                            min="0"
                            step="1"
                            value={minPrice}
                            onChange={(e) => onMinPriceChange(e.target.value)}
                            placeholder="0"
                            className="w-full pl-7 pr-3 py-2.5 rounded-lg border border-neutral-300 bg-white text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-colors"
                        />
                    </div>
                </div>

                {/* Max price */}
                <div>
                    <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wider mb-1.5">
                        Max price
                    </label>
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-neutral-400 text-sm pointer-events-none">
                            $
                        </span>
                        <input
                            type="number"
                            min="0"
                            step="1"
                            value={maxPrice}
                            onChange={(e) => onMaxPriceChange(e.target.value)}
                            placeholder="Any"
                            className="w-full pl-7 pr-3 py-2.5 rounded-lg border border-neutral-300 bg-white text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-colors"
                        />
                    </div>
                </div>
            </div>

            {/* ============ CLEAR FILTERS ============ */}
            {hasActiveFilters && (
                <div className="mt-4 pt-4 border-t border-neutral-100 flex justify-end">
                    <button
                        type="button"
                        onClick={onClearFilters}
                        className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
                    >
                        Clear all filters
                    </button>
                </div>
            )}
        </div>
    );
};

// ==========================================
// Inline icon
// ==========================================
const SearchIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
);