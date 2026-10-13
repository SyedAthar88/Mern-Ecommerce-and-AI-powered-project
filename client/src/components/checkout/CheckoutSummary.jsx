// ==========================================
// Format price helper
// ==========================================
const formatPrice = (price, currency = "USD") => {
    const symbols = { USD: "$", EUR: "€", GBP: "£", PKR: "Rs ", INR: "₹" };
    const symbol = symbols[currency] || "$";
    return `${symbol}${Number(price).toFixed(2)}`;
};

// ==========================================
// CheckoutSummary — order summary sidebar
// ==========================================
export const CheckoutSummary = ({ cart }) => {
    const items = cart?.items || [];
    const subtotal = cart?.subtotal || 0;
    const itemCount = cart?.itemCount || 0;

    return (
        <div className="bg-white rounded-2xl border border-neutral-100 shadow-soft p-6 lg:sticky lg:top-24">
            {/* ==========================================
          HEADING
      ========================================== */}
            <h2 className="text-lg font-semibold text-neutral-900 mb-5">
                Order Summary
            </h2>

            {/* ==========================================
          ITEMS
      ========================================== */}
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1 mb-5">
                {items.map((item) => (
                    <div key={item.product._id} className="flex gap-3">
                        {/* Image */}
                        <div className="shrink-0 w-14 h-14 rounded-lg bg-neutral-100 overflow-hidden border border-neutral-100">
                            {item.product.images?.[0]?.url ? (
                                <img
                                    src={item.product.images[0].url}
                                    alt={item.product.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-neutral-300">
                                    <ImageIcon />
                                </div>
                            )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-neutral-900 truncate">
                                {item.product.name}
                            </p>
                            <p className="text-xs text-neutral-500 mt-0.5">
                                Qty: {item.quantity}
                            </p>
                        </div>

                        {/* Subtotal */}
                        <span className="text-sm font-medium text-neutral-900 shrink-0 tabular-nums">
                            {formatPrice(
                                item.product.price * item.quantity,
                                item.product.currency
                            )}
                        </span>
                    </div>
                ))}
            </div>

            {/* ==========================================
          TOTALS
      ========================================== */}
            <div className="space-y-3 text-sm border-t border-neutral-100 pt-5">
                <div className="flex items-center justify-between">
                    <span className="text-neutral-600">
                        Subtotal
                        <span className="text-neutral-400 ml-1">
                            ({itemCount} {itemCount === 1 ? "item" : "items"})
                        </span>
                    </span>
                    <span className="font-medium text-neutral-900 tabular-nums">
                        ${subtotal.toFixed(2)}
                    </span>
                </div>

                <div className="flex items-center justify-between">
                    <span className="text-neutral-600">Shipping</span>
                    <span className="text-xs text-neutral-400 italic">Free</span>
                </div>

                <div className="flex items-center justify-between">
                    <span className="text-neutral-600">Tax</span>
                    <span className="text-xs text-neutral-400 italic">
                        Calculated at final step
                    </span>
                </div>
            </div>

            {/* ==========================================
          TOTAL
      ========================================== */}
            <div className="mt-5 pt-5 border-t border-neutral-100 flex items-center justify-between">
                <span className="text-base font-semibold text-neutral-900">Total</span>
                <span className="text-xl font-bold text-neutral-900 tabular-nums">
                    ${subtotal.toFixed(2)}
                </span>
            </div>
        </div>
    );
};

// ==========================================
// Inline icon
// ==========================================
const ImageIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
        <circle cx="9" cy="9" r="2" />
        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
    </svg>
);