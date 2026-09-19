import { forwardRef } from "react";
import { Spinner } from "./Spinner.jsx";

// ==========================================
// Button — primary action component
// variants: primary | secondary | danger | ghost
// sizes: sm | md | lg
// ==========================================
export const Button = forwardRef(
  (
    {
      children,
      variant = "primary",
      size = "md",
      type = "button",
      loading = false,
      disabled = false,
      fullWidth = false,
      leftIcon = null,
      rightIcon = null,
      className = "",
      ...props
    },
    ref
  ) => {
    // ==========================================
    // Base styles — shared by all variants
    // ==========================================
    const baseStyles =
      "inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

    // ==========================================
    // Variant styles
    // ==========================================
    const variants = {
      primary:
        "bg-primary-600 text-white hover:bg-primary-700 focus-visible:ring-primary-500 active:scale-[0.98]",
      secondary:
        "bg-neutral-100 text-neutral-900 hover:bg-neutral-200 focus-visible:ring-neutral-400 active:scale-[0.98]",
      danger:
        "bg-error-600 text-white hover:bg-error-700 focus-visible:ring-error-500 active:scale-[0.98]",
      ghost:
        "bg-transparent text-neutral-700 hover:bg-neutral-100 focus-visible:ring-neutral-400",
    };

    // ==========================================
    // Size styles
    // ==========================================
    const sizes = {
      sm: "text-sm px-3 py-2 h-9",
      md: "text-sm px-4 py-2.5 h-10",
      lg: "text-base px-6 py-3 h-12",
    };

    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        className={`
          ${baseStyles}
          ${variants[variant]}
          ${sizes[size]}
          ${fullWidth ? "w-full" : ""}
          ${className}
        `}
        {...props}
      >
        {loading ? (
          <>
            <Spinner size="sm" />
            <span>Please wait...</span>
          </>
        ) : (
          <>
            {leftIcon && <span className="shrink-0">{leftIcon}</span>}
            <span>{children}</span>
            {rightIcon && <span className="shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";