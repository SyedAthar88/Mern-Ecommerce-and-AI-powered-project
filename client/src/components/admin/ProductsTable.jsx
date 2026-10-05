import { ProductsTableRow } from "./ProductsTableRow.jsx";
import { Skeleton } from "../ui/Skeleton.jsx";

// ==========================================
// ProductsTable — table + loading + empty states
// ==========================================
export const ProductsTable = ({
  products,
  loading,
  onEdit,
  onDelete,
}) => {
  // ==========================================
  // Loading
  // ==========================================
  if (loading) {
    return (
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <TableHeader />
          <tbody>
            {Array.from({ length: 5 }).map((_, i) => (
              <tr key={i} className="border-b border-neutral-100">
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-12 h-12 rounded-lg shrink-0" />
                    <div className="min-w-0 flex-1">
                      <Skeleton variant="text" className="w-40 mb-2" />
                      <Skeleton variant="text" className="w-24" />
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <Skeleton variant="text" className="w-24" />
                </td>
                <td className="py-4 px-4">
                  <Skeleton variant="text" className="w-20" />
                </td>
                <td className="py-4 px-4">
                  <Skeleton className="h-6 w-12 rounded-full" />
                </td>
                <td className="py-4 px-4">
                  <Skeleton className="h-6 w-16 rounded-full" />
                </td>
                <td className="py-4 px-4">
                  <Skeleton variant="circular" className="w-8 h-8 ml-auto" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
          No products found
        </h3>
        <p className="text-sm text-neutral-500">
          Try adjusting filters, or add a new product.
        </p>
      </div>
    );
  }

  // ==========================================
  // Data
  // ==========================================
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[800px]">
        <TableHeader />
        <tbody>
          {products.map((product) => (
            <ProductsTableRow
              key={product._id}
              product={product}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

// ==========================================
// Shared header
// ==========================================
const TableHeader = () => (
  <thead>
    <tr className="border-b border-neutral-200 bg-neutral-50/50">
      <th className="text-left py-3 px-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
        Product
      </th>
      <th className="text-left py-3 px-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider w-32">
        Category
      </th>
      <th className="text-left py-3 px-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider w-28">
        Price
      </th>
      <th className="text-left py-3 px-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider w-20">
        Stock
      </th>
      <th className="text-left py-3 px-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider w-24">
        Status
      </th>
      <th className="text-right py-3 px-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider w-20">
        Actions
      </th>
    </tr>
  </thead>
);

// ==========================================
// Inline icon
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
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
    <polyline points="3.29 7 12 12 20.71 7" />
    <line x1="12" y1="22" x2="12" y2="12" />
  </svg>
);