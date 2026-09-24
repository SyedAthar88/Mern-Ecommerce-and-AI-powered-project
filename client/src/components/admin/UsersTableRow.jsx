import { Avatar } from "../ui/Avatar.jsx";
import { Badge } from "../ui/Badge.jsx";
import { Dropdown } from "../ui/Dropdown.jsx";
import { formatDate } from "../../utils/format.js";

// ==========================================
// UsersTableRow — one row in users table
// ==========================================
export const UsersTableRow = ({
    user,
    currentUserId,
    onEdit,
    onDelete,
}) => {
    const isSelf = currentUserId === user._id;
    const isAdmin = user.role === "admin";

    return (
        <tr className="border-b border-neutral-100 last:border-b-0 hover:bg-neutral-50/60 transition-colors">
            {/* ============ USER (avatar + name) ============ */}
            <td className="py-3 px-4">
                <div className="flex items-center gap-3">
                    <Avatar user={user} size="sm" />
                    <div className="min-w-0">
                        <div className="flex items-center gap-2">
                            <span className="font-medium text-neutral-900 truncate">
                                {user.name}
                            </span>
                            {isSelf && (
                                <span className="text-[10px] font-semibold uppercase tracking-wide text-primary-600 bg-primary-50 px-1.5 py-0.5 rounded">
                                    You
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </td>

            {/* ============ EMAIL ============ */}
            <td className="py-3 px-4">
                <span className="text-sm text-neutral-600 truncate">
                    {user.email}
                </span>
            </td>

            {/* ============ ROLE ============ */}
            <td className="py-3 px-4">
                <Badge variant={isAdmin ? "primary" : "neutral"}>
                    {user.role}
                </Badge>
            </td>

            {/* ============ JOINED ============ */}
            <td className="py-3 px-4">
                <span className="text-sm text-neutral-500">
                    {formatDate(user.createdAt)}
                </span>
            </td>

            {/* ============ ACTIONS ============ */}
            <td className="py-3 px-4 text-right">
                {isSelf ? (
                    <span className="text-xs text-neutral-400 italic">
                        Cannot edit self
                    </span>
                ) : (
                    <Dropdown
                        align="right"
                        trigger={
                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg hover:bg-neutral-100 text-neutral-500 hover:text-neutral-800 transition-colors cursor-pointer">
                                <MoreIcon />
                            </span>
                        }
                    >
                        <Dropdown.Item
                            icon={<EditIcon />}
                            onClick={() => onEdit(user)}
                        >
                            Edit user
                        </Dropdown.Item>

                        <Dropdown.Divider />

                        <Dropdown.Item
                            icon={<TrashIcon />}
                            variant="danger"
                            onClick={() => onDelete(user)}
                        >
                            Delete user
                        </Dropdown.Item>
                    </Dropdown>
                )}
            </td>
        </tr>
    );
};

// ==========================================
// Inline icons
// ==========================================
const MoreIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="1" />
        <circle cx="19" cy="12" r="1" />
        <circle cx="5" cy="12" r="1" />
    </svg>
);

const EditIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-500">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
);

const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-error-500">
        <path d="M3 6h18" />
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
        <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
);