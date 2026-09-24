// ==========================================
// UsersFilters — search input + role filter
// ==========================================
export const UsersFilters = ({
  search,
  onSearchChange,
  roleFilter,
  onRoleFilterChange,
}) => {
  const roleOptions = [
    { value: "all", label: "All" },
    { value: "user", label: "Users" },
    { value: "admin", label: "Admins" },
  ];

  const hasFilters = search || roleFilter !== "all";

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
      {/* ==========================================
          SEARCH INPUT
      ========================================== */}
      <div className="relative flex-1 max-w-md">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
          <SearchIcon />
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by name or email..."
          className="w-full pl-10 pr-3 py-2 rounded-lg border border-neutral-300 bg-white text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-colors"
        />
      </div>

      {/* ==========================================
          ROLE FILTER
      ========================================== */}
      <div className="inline-flex bg-neutral-100 rounded-lg p-1">
        {roleOptions.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onRoleFilterChange(opt.value)}
            className={`
              px-3 py-1.5 text-sm font-medium rounded-md transition-colors
              ${
                roleFilter === opt.value
                  ? "bg-white text-neutral-900 shadow-soft"
                  : "text-neutral-600 hover:text-neutral-900"
              }
            `}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* ==========================================
          CLEAR FILTERS (only when active)
      ========================================== */}
      {hasFilters && (
        <button
          type="button"
          onClick={() => {
            onSearchChange("");
            onRoleFilterChange("all");
          }}
          className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors self-start sm:self-auto"
        >
          Clear filters
        </button>
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