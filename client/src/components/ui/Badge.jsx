// ==========================================
// Badge — small colored pill
// variants: primary | neutral | success | warning | danger
// sizes: sm | md
// ==========================================
export const Badge = ({
  children,
  variant = "neutral",
  size = "sm",
  className = "",
}) => {
  const variants = {
    primary: "bg-primary-100 text-primary-700",
    neutral: "bg-neutral-100 text-neutral-600",
    success: "bg-emerald-100 text-emerald-700",
    warning: "bg-amber-100 text-amber-700",
    danger: "bg-error-50 text-error-700",
  };

  const sizes = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-2.5 py-1",
  };

  return (
    <span
      className={`
        inline-flex items-center font-medium rounded-full
        capitalize whitespace-nowrap
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
    >
      {children}
    </span>
  );
};