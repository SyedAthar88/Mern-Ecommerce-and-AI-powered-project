// ==========================================
// Format price with currency
// ==========================================
const formatPrice = (price, currency = "USD") => {
  if (price === null || price === undefined) return "";
  const symbols = { USD: "$", EUR: "€", GBP: "£", PKR: "Rs ", INR: "₹" };
  const symbol = symbols[currency] || "$";
  return `${symbol}${Number(price).toFixed(2)}`;
};

// ==========================================
// PriceDisplay — price with optional sale styling
// sizes: sm | md | lg
// ==========================================
export const PriceDisplay = ({
  price,
  compareAtPrice,
  currency = "USD",
  size = "md",
  showDiscount = false,
  className = "",
}) => {
  const isOnSale =
    compareAtPrice !== null &&
    compareAtPrice !== undefined &&
    compareAtPrice > price;

  const discountPercent = isOnSale
    ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
    : 0;

  const sizes = {
    sm: { main: "text-sm font-semibold", compare: "text-xs", badge: "text-[10px]" },
    md: { main: "text-lg font-semibold", compare: "text-sm", badge: "text-xs" },
    lg: { main: "text-3xl font-bold", compare: "text-lg", badge: "text-sm" },
  };

  const s = sizes[size] || sizes.md;

  return (
    <div className={`flex items-center gap-2 flex-wrap ${className}`}>
      <span className={`${s.main} text-neutral-900`}>
        {formatPrice(price, currency)}
      </span>

      {isOnSale && (
        <>
          <span className={`${s.compare} text-neutral-400 line-through`}>
            {formatPrice(compareAtPrice, currency)}
          </span>
          {showDiscount && discountPercent > 0 && (
            <span
              className={`${s.badge} font-semibold text-error-600 bg-error-50 px-1.5 py-0.5 rounded`}
            >
              -{discountPercent}%
            </span>
          )}
        </>
      )}
    </div>
  );
};