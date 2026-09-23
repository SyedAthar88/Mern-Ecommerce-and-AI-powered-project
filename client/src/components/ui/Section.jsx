// ==========================================
// Section — content block with optional header
// ==========================================
export const Section = ({
  title,
  subtitle,
  actions,
  children,
  className = "",
  padding = "md",
  noBorder = false,
}) => {
  const paddings = {
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  const hasHeader = title || subtitle || actions;

  return (
    <div
      className={`
        bg-white rounded-2xl
        ${noBorder ? "" : "border border-neutral-100 shadow-soft"}
        ${paddings[padding]}
        ${className}
      `}
    >
      {hasHeader && (
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="min-w-0 flex-1">
            {title && (
              <h2 className="text-lg font-semibold text-neutral-900">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="mt-1 text-sm text-neutral-500">{subtitle}</p>
            )}
          </div>
          {actions && <div className="shrink-0">{actions}</div>}
        </div>
      )}
      {children}
    </div>
  );
};