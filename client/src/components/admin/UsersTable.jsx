import { UsersTableRow } from "./UsersTableRow.jsx";
import { Skeleton } from "../ui/Skeleton.jsx";

// ==========================================
// UsersTable — table with header + rows
// ==========================================
export const UsersTable = ({
    users,
    loading,
    currentUserId,
    onEdit,
    onDelete,
}) => {
    // ==========================================
    // Loading state — skeleton rows
    // ==========================================
    if (loading) {
        return (
            <div className="overflow-x-auto">
                <table className="w-full min-w-[640px]">
                    <TableHeader />
                    <tbody>
                        {Array.from({ length: 5 }).map((_, i) => (
                            <tr key={i} className="border-b border-neutral-100">
                                <td className="py-3 px-4">
                                    <div className="flex items-center gap-3">
                                        <Skeleton variant="circular" className="w-8 h-8 shrink-0" />
                                        <Skeleton variant="text" className="w-32" />
                                    </div>
                                </td>
                                <td className="py-3 px-4">
                                    <Skeleton variant="text" className="w-40" />
                                </td>
                                <td className="py-3 px-4">
                                    <Skeleton className="h-5 w-16 rounded-full" />
                                </td>
                                <td className="py-3 px-4">
                                    <Skeleton variant="text" className="w-24" />
                                </td>
                                <td className="py-3 px-4">
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
    // Empty state
    // ==========================================
    if (!users || users.length === 0) {
        return (
            <div className="text-center py-16">
                <div className="mx-auto w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mb-4">
                    <UsersEmptyIcon />
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-1">
                    No users found
                </h3>
                <p className="text-sm text-neutral-500">
                    There are no users to display.
                </p>
            </div>
        );
    }

    // ==========================================
    // Data state
    // ==========================================
    return (
        <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
                <TableHeader />
                <tbody>
                    {users.map((user) => (
                        <UsersTableRow
                            key={user._id}
                            user={user}
                            currentUserId={currentUserId}
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
// Table header (shared)
// ==========================================
const TableHeader = () => (
    <thead>
        <tr className="border-b border-neutral-200 bg-neutral-50/50">
            <th className="text-left py-3 px-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                User
            </th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                Email
            </th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                Role
            </th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                Joined
            </th>
            <th className="text-right py-3 px-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                Actions
            </th>
        </tr>
    </thead>
);

// ==========================================
// Inline icon
// ==========================================
const UsersEmptyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-400">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
);