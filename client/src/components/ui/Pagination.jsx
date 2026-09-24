// ==========================================
// Pagination — page navigation control
// ==========================================
export const Pagination = ({
  page,
  totalPages,
  hasNext,
  hasPrev,
  onPageChange,
  className = "",
}) => {
  // ==========================================
  // Build the page number array (with ellipsis)
  // Example: [1, "...", 4, 5, 6, "...", 10]
  // ==========================================
  const getPageNumbers = () => {
    const pages = [];
    const delta = 1; // pages around current

    // Always show first page
    pages.push(1);

    // Range around current page
    const left = Math.max(2, page - delta);
    const right = Math.min(totalPages - 1, page + delta);

    // Ellipsis on left
    if (left > 2) pages.push("...");

    // Pages around current
    for (let i = left; i <= right; i++) {
      pages.push(i);
    }

    // Ellipsis on right
    if (right < totalPages - 1) pages.push("...");

    // Always show last page (if > 1)
    if (totalPages > 1) pages.push(totalPages);

    return pages;
  };

  if (totalPages <= 1) return null;

  const pageNumbers = getPageNumbers();

  return (
    <nav
      className={`flex items-center justify-center gap-1 ${className}`}
      aria-label="Pagination"
    >
      {/* Prev button */}
      <button
        type="button"
        onClick={() => hasPrev && onPageChange(page - 1)}
        disabled={!hasPrev}
        className="px-3 py-2 text-sm font-medium text-neutral-600 rounded-lg hover:bg-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        aria-label="Previous page"
      >
        ← Prev
      </button>

      {/* Page numbers */}
      {pageNumbers.map((p, idx) => {
        if (p === "...") {
          return (
            <span
              key={`ellipsis-${idx}`}
              className="px-2 py-2 text-sm text-neutral-400 select-none"
            >
              …
            </span>
          );
        }

        const isActive = p === page;

        return (
          <button
            key={p}
            type="button"
            onClick={() => onPageChange(p)}
            className={`
              min-w-[36px] h-9 px-2 text-sm font-medium rounded-lg
              transition-colors
              ${
                isActive
                  ? "bg-primary-600 text-white"
                  : "text-neutral-700 hover:bg-neutral-100"
              }
            `}
            aria-current={isActive ? "page" : undefined}
          >
            {p}
          </button>
        );
      })}

      {/* Next button */}
      <button
        type="button"
        onClick={() => hasNext && onPageChange(page + 1)}
        disabled={!hasNext}
        className="px-3 py-2 text-sm font-medium text-neutral-600 rounded-lg hover:bg-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        aria-label="Next page"
      >
        Next →
      </button>
    </nav>
  );
};