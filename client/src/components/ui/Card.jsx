// ==========================================
// Card — content container
// padding: sm | md | lg
// ==========================================
export const Card = ({
  children,
  title,
  subtitle,
  padding = "md",
  className = "",
}) => {
  const paddings = {
    sm: "p-4",
    md: "p-6",
    lg: "p-8 sm:p-10",
  };

  return (
    <div
      className={`
        bg-white rounded-2xl shadow-card border border-neutral-100
        ${paddings[padding]}
        ${className}
      `}
    >
      {(title || subtitle) && (
        <div className="mb-6 text-center">
          {title && (
            <h1 className="text-2xl font-bold text-neutral-900 mb-2">
              {title}
            </h1>
          )}
          {subtitle && (
            <p className="text-sm text-neutral-600">{subtitle}</p>
          )}
        </div>
      )}
      {children}
    </div>
  );
};