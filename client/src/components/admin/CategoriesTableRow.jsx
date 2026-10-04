import { Badge } from "../ui/Badge.jsx";
import { Dropdown } from "../ui/Dropdown.jsx";

// ==========================================
// CategoriesTableRow — one row
// ==========================================
export const CategoriesTableRow = ({ category, onEdit, onDelete }) => {
    const hasImage = category.image?.url;

    return (
        <tr className="border-b border-neutral-100 last:border-b-0 hover:bg-neutral-50/60 transition-colors">
            {/* ============ IMAGE ============ */}
            <td className="py-4 px-4">
                <div className="w-12 h-12 rounded-lg bg-neutral-100 overflow-hidden flex items-center justify-center">
                    {hasImage ? (
                        <img
                            src={category.image.url}
                            alt={category.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                // If image fails to load → show placeholder
                                e.target.style.display = "none";
                            }}
                        />
                    ) : (
                        <ImagePlaceholderIcon />
                    )}
                </div>
            </td>

            {/* ============ NAME + DESCRIPTION ============ */}
            <td className="py-4 px-4">
                <div className="min-w-0">
                    <p className="font-medium text-neutral-900 truncate">
                        {category.name}
                    </p>
                    {category.description ? (
                        <p className="text-sm text-neutral-500 truncate mt-0.5">
                            {category.description}
                        </p>
                    ) : (
                        <p className="text-sm text-neutral-400 italic mt-0.5">
                            No description
                        </p>
                    )}
                </div>
            </td>

            {/* ============ PRODUCTS ============ */}
            <td className="py-4 px-4">
                <Badge variant={category.productCount > 0 ? "primary" : "neutral"}>
                    {category.productCount ?? 0}
                </Badge>
            </td>

            {/* ============ STATUS ============ */}
            <td className="py-4 px-4">
                <Badge variant={category.isActive ? "success" : "neutral"}>
                    {category.isActive ? "Active" : "Inactive"}
                </Badge>
            </td>

            {/* ============ ACTIONS ============ */}
            <td className="py-4 px-4 text-right">
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
                        onClick={() => onEdit(category)}
                    >
                        Edit
                    </Dropdown.Item>

                    <Dropdown.Divider />

                    <Dropdown.Item
                        icon={<TrashIcon />}
                        variant="danger"
                        onClick={() => onDelete(category)}
                    >
                        Delete
                    </Dropdown.Item>
                </Dropdown>
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

const ImagePlaceholderIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-400">
        <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
        <circle cx="9" cy="9" r="2" />
        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
    </svg>
);