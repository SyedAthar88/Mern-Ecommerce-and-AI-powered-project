// ==========================================
// QuantitySelector — +/- with editable input
// ==========================================
export const QuantitySelector = ({
    value = 1,
    onChange,
    min = 1,
    max = 99,
    disabled = false,
}) => {
    // ==========================================
    // Clamp value within bounds
    // ==========================================
    const clamp = (v) => Math.max(min, Math.min(max, v));

    // ==========================================
    // Decrement
    // ==========================================
    const handleDecrement = () => {
        if (disabled) return;
        onChange(clamp(value - 1));
    };

    // ==========================================
    // Increment
    // ==========================================
    const handleIncrement = () => {
        if (disabled) return;
        onChange(clamp(value + 1));
    };

    // ==========================================
    // Input change (user typed)
    // ==========================================
    const handleInputChange = (e) => {
        const raw = e.target.value;

        // Allow empty for editing
        if (raw === "") {
            onChange("");
            return;
        }

        const num = parseInt(raw, 10);
        if (isNaN(num)) return;
        onChange(num);
    };

    // ==========================================
    // Input blur (clamp if invalid)
    // ==========================================
    const handleBlur = () => {
        if (value === "" || isNaN(value)) {
            onChange(min);
        } else {
            onChange(clamp(value));
        }
    };

    const canDecrement = !disabled && value > min;
    const canIncrement = !disabled && value < max;

    return (
        <div className="inline-flex items-center rounded-lg border border-neutral-300 bg-white overflow-hidden">
            {/* Decrement */}
            <button
                type="button"
                onClick={handleDecrement}
                disabled={!canDecrement}
                className="w-10 h-10 flex items-center justify-center text-neutral-600 hover:bg-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                aria-label="Decrease quantity"
            >
                <MinusIcon />
            </button>

            {/* Input */}
            <input
                type="text"
                inputMode="numeric"
                value={value}
                onChange={handleInputChange}
                onBlur={handleBlur}
                disabled={disabled}
                className="w-12 h-10 text-center text-sm font-medium text-neutral-900 bg-transparent border-x border-neutral-300 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 disabled:bg-neutral-50 disabled:cursor-not-allowed"
                aria-label="Quantity"
            />

            {/* Increment */}
            <button
                type="button"
                onClick={handleIncrement}
                disabled={!canIncrement}
                className="w-10 h-10 flex items-center justify-center text-neutral-600 hover:bg-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                aria-label="Increase quantity"
            >
                <PlusIcon />
            </button>
        </div>
    );
};

// ==========================================
// Inline icons
// ==========================================
const MinusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
);

const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
);