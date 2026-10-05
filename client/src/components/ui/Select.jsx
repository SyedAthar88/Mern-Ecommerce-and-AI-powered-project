import { forwardRef } from "react";

// ==========================================
// Select — dropdown with label + error
// options: [{ value, label, disabled? }]
// ==========================================
export const Select = forwardRef(
  (
    {
      label,
      options = [],
      placeholder,
      error,
      className = "",
      id,
      ...props
    },
    ref
  ) => {
    const selectId =
      id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="w-full">
        {/* ---- Label ---- */}
        {label && (
          <label
            htmlFor={selectId}
            className="block text-sm font-medium text-neutral-700 mb-1.5"
          >
            {label}
          </label>
        )}

        {/* ---- Select wrapper ---- */}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={`
              w-full appearance-none rounded-lg border bg-white
              py-2.5 pl-3 pr-10 text-sm text-neutral-900
              transition-colors duration-150
              focus:outline-none focus:ring-2 focus:ring-offset-0
              disabled:bg-neutral-50 disabled:cursor-not-allowed disabled:text-neutral-500
              ${
                error
                  ? "border-error-500 focus:border-error-500 focus:ring-error-200"
                  : "border-neutral-300 focus:border-primary-500 focus:ring-primary-200"
              }
              ${className}
            `}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={error ? `${selectId}-error` : undefined}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option
                key={opt.value}
                value={opt.value}
                disabled={opt.disabled}
              >
                {opt.label}
              </option>
            ))}
          </select>

          {/* Custom chevron */}
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-neutral-400">
            <ChevronDownIcon />
          </div>
        </div>

        {/* ---- Error ---- */}
        {error && (
          <p
            id={`${selectId}-error`}
            className="mt-1.5 text-sm text-error-600 animate-fade-in"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";

// ==========================================
// Inline icon
// ==========================================
const ChevronDownIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);