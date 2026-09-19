import { forwardRef, useState } from "react";

// ==========================================
// Input — form field with label, error, icons
// ==========================================
export const Input = forwardRef(
  (
    {
      label,
      type = "text",
      error,
      leftIcon = null,
      rightIcon = null,
      className = "",
      id,
      ...props
    },
    ref
  ) => {
    // Auto-generate id from label if not provided
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
    const [showPassword, setShowPassword] = useState(false);

    const isPassword = type === "password";
    const inputType = isPassword && showPassword ? "text" : type;

    return (
      <div className="w-full">
        {/* ============ LABEL ============ */}
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-neutral-700 mb-1.5"
          >
            {label}
          </label>
        )}

        {/* ============ INPUT WRAPPER ============ */}
        <div className="relative">
          {/* Left icon */}
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
              {leftIcon}
            </div>
          )}

          {/* Input */}
          <input
            ref={ref}
            id={inputId}
            type={inputType}
            className={`
              w-full rounded-lg border bg-white text-neutral-900 placeholder-neutral-400
              transition-colors duration-150
              focus:outline-none focus:ring-2 focus:ring-offset-0
              disabled:bg-neutral-50 disabled:cursor-not-allowed disabled:text-neutral-500
              ${leftIcon ? "pl-10" : "pl-3"}
              ${isPassword || rightIcon ? "pr-10" : "pr-3"}
              py-2.5 text-sm
              ${
                error
                  ? "border-error-500 focus:border-error-500 focus:ring-error-200"
                  : "border-neutral-300 focus:border-primary-500 focus:ring-primary-200"
              }
              ${className}
            `}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={error ? `${inputId}-error` : undefined}
            {...props}
          />

          {/* Password toggle OR right icon */}
          {isPassword ? (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-600 transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
              tabIndex={-1}
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          ) : (
            rightIcon && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400">
                {rightIcon}
              </div>
            )
          )}
        </div>

        {/* ============ ERROR MESSAGE ============ */}
        {error && (
          <p
            id={`${inputId}-error`}
            className="mt-1.5 text-sm text-error-600 animate-fade-in"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

// ==========================================
// Inline icons (no icon library needed)
// ==========================================
const EyeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
    <line x1="2" y1="2" x2="22" y2="22" />
  </svg>
);