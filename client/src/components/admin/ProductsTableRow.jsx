import { useState } from "react";
import { Badge } from "../ui/Badge.jsx";
import { Dropdown } from "../ui/Dropdown.jsx";

// ==========================================
// Format price helper
// ==========================================
const formatPrice = (price, currency = "USD") => {
    if (price === null || price === undefined) return "—";
    const symbols = { USD: "$", EUR: "€", GBP: "£", PKR: "Rs ", INR: "₹" };
    const symbol = symbols[currency] || "$";
    return `${symbol}${Number(price).toFixed(2)}`;
};

// ==========================================
// ProductsTableRow — one row
// ==========================================
export const ProductsTableRow = ({ product, onEdit, onDelete }) => {
    const [imageFailed, setImageFailed] = useState(false);

    const hasImage = product.images?.[0]?.url && !imageFailed;
    const mainImage = product.images?.[0]?.url;
    const isOnSale =
        product.compareAtPrice !== null &&
        product.compareAtPrice !== undefined &&
        product.compareAtPrice > product.price;

    return (
        <tr className="border-b border-neutral-100 last:border-b-0 hover:bg-neutral-50/60 transition-colors">
            {/* ============ PRODUCT (image + name) ============ */}
            <td className="py-4 px-4">
                <div className="flex items-center gap-3">
                    {/* Thumbnail */}
                    <div className="w-12 h-12 rounded-lg bg-neutral-100 overflow-hidden flex items-center justify-center shrink-0">
                        {hasImage ? (
                            <img
                                src={mainImage}
                                alt={product.name}
                                className="w-full h-full object-cover"
                                onError={() => setImageFailed(true)}
                            />
                        ) : (
                            <ImagePlaceholderIcon />
                        )}
                    </div>

                    {/* Name + SKU */}
                    <div className="min-w-0">
                        <p className="font-medium text-neutral-900 truncate">
                            {product.name}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                            {product.sku && (
                                <p className="text-xs text-neutral-400 font-mono truncate">
                                    {product.sku}
                                </p>
                            )}
                            {product.isFeatured && (
                                <span className="text-[10px] font-semibold uppercase tracking-wide bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded">
                                    Featured
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </td>

            {/* ============ CATEGORY ============ */}
            <td className="py-4 px-4">
                {product.category ? (
                    <span className="text-sm text-neutral-600 truncate">
                        {product.category.name || "—"}
                    </span>
                ) : (
                    <span className="text-sm text-neutral-400 italic">Uncategorized</span>
                )}
            </td>

            {/* ============ PRICE ============ */}
            <td className="py-4 px-4">
                <div>
                    <p className="text-sm font-medium text-neutral-900">
                        {formatPrice(product.price, product.currency)}
                    </p>
                    {isOnSale && (
                        <p className="text-xs text-neutral-400 line-through">
                            {formatPrice(product.compareAtPrice, product.currency)}
                        </p>
                    )}
                </div>
            </td>

            {/* ============ STOCK ============ */}
            <td className="py-4 px-4">
                <StockBadge stock={product.stock} />
            </td>

            {/* ============ STATUS ============ */}
            <td className="py-4 px-4">
                <Badge variant={product.isActive ? "success" : "neutral"}>
                    {product.isActive ? "Active" : "Inactive"}
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
                    <Dropdown.Item icon={<EditIcon />} onClick={() => onEdit(product)}>
                        Edit product
                    </Dropdown.Item>

                    <Dropdown.Divider />

                    <Dropdown.Item
                        icon={<TrashIcon />}
                        variant="danger"
                        onClick={() => onDelete(product)}
                    >
                        Delete product
                    </Dropdown.Item>
                </Dropdown>
            </td>
        </tr>
    );
};

// ==========================================
// StockBadge — color-coded based on stock level
// ==========================================
const StockBadge = ({ stock = 0 }) => {
    let variant = "success";
    let label = stock;

    if (stock === 0) {
        variant = "danger";
        label = "Out";
    } else if (stock <= 5) {
        variant = "warning";
        label = `${stock} left`;
    }

    return <Badge variant={variant}>{label}</Badge>;
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