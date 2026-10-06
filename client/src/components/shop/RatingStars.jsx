// ==========================================
// RatingStars — display rating with half-star support
// sizes: sm | md | lg
// ==========================================
export const RatingStars = ({
    value = 0,
    count,
    size = "sm",
    showCount = true,
    className = "",
}) => {
    const clampedValue = Math.max(0, Math.min(5, value));

    const sizes = {
        sm: "w-3.5 h-3.5",
        md: "w-4 h-4",
        lg: "w-5 h-5",
    };

    const starSize = sizes[size] || sizes.sm;

    // Generate 5 stars
    const stars = [];
    for (let i = 1; i <= 5; i++) {
        const fill = clampedValue - (i - 1); // 0 to 1 for this star
        stars.push(<Star key={i} fill={fill} className={starSize} />);
    }

    return (
        <div className={`flex items-center gap-1.5 ${className}`}>
            <div className="flex items-center gap-0.5">{stars}</div>
            {showCount && count !== undefined && count !== null && (
                <span className="text-xs text-neutral-500">
                    {value > 0 ? value.toFixed(1) : "No"} {count > 0 && `(${count})`}
                </span>
            )}
        </div>
    );
};

// ==========================================
// Star — single star with partial fill
// fill: 0 (empty), 0.5 (half), 1 (full)
// ==========================================
const Star = ({ fill = 0, className = "" }) => {
    // Clamp between 0 and 1
    const normalizedFill = Math.max(0, Math.min(1, fill));

    // Round to nearest 0.5 (common for star systems)
    const roundedFill = Math.round(normalizedFill * 2) / 2;

    return (
        <div className={`relative ${className}`}>
            {/* Empty star (background) */}
            <StarIcon
                fill="none"
                className="absolute inset-0 w-full h-full text-neutral-300"
            />

            {/* Filled portion */}
            {roundedFill > 0 && (
                <div
                    className="absolute inset-0 overflow-hidden"
                    style={{ width: `${roundedFill * 100}%` }}
                >
                    <StarIcon
                        fill="currentColor"
                        className="w-full h-full text-amber-400"
                    />
                </div>
            )}
        </div>
    );
};

// ==========================================
// Star icon SVG
// ==========================================
const StarIcon = ({ fill = "none", className = "" }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill={fill}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
);