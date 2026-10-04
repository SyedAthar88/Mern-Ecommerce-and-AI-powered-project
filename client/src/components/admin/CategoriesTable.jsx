import { CategoriesTableRow } from "./CategoriesTableRow.jsx";
import { Skeleton } from "../ui/Skeleton.jsx";

// ==========================================
// CategoriesTable — table + loading + empty states
// ==========================================
export const CategoriesTable = ({
    categories,
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
                <table className="w-full min-w-[640px]">
                    <TableHeader />
                    <tbody>
                        {Array.from({ length: 5 }).map((_, i) => (
                            <tr key={i} className="border-b border-neutral-100">
                                <td className="py-4 px-4">
                                    <Skeleton className="w-12 h-12 rounded-lg" />
                                </td>
                                <td className="py-4 px-4">
                                    <Skeleton variant="text" className="w-32 mb-2" />
                                    <Skeleton variant="text" className="w-48" />
                                </td>
                                <td className="py-4 px-4">
                                    <Skeleton className="h-6 w-10 rounded-full" />
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
    if (!categories || categories.length === 0) {
        return (
            <div className="text-center py-16">
                <div className="mx-auto w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mb-4">
                    <EmptyIcon />
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-1">
                    No categories yet
                </h3>
                <p className="text-sm text-neutral-500">
                    Create your first category to organize products.
                </p>
            </div>
        );
    }

    // ==========================================
    // Data
    // ==========================================
    return (
        <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
                <TableHeader />
                <tbody>
                    {categories.map((category) => (
                        <CategoriesTableRow
                            key={category._id}
                            category={category}
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
            <th className="text-left py-3 px-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider w-20">
                Image
            </th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                Category
            </th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider w-24">
                Products
            </th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider w-28">
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
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-neutral-400"
    >
        <path d="M20.59 13.41 22 15l-8.5 6.5a2 2 0 0 1-2.88-.35L2 12V2h10Z" />
        <circle cx="7.5" cy="7.5" r=".5" fill="currentColor" />
    </svg>
);