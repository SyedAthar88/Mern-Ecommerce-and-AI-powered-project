import { Link } from "react-router-dom";

// ==========================================
// StatCard — icon + title + value + action link
// ==========================================
export const StatCard = ({
  icon,
  title,
  value,
  subtitle,
  actionLabel = "View",
  actionTo,
  onClick,
  accent = "primary",
}) => {
  const accents = {
    primary: "bg-primary-50 text-primary-600",
    success: "bg-emerald-50 text-emerald-600",
    warning: "bg-amber-50 text-amber-600",
    neutral: "bg-neutral-100 text-neutral-600",
  };

  // Content is the same whether we render a Link or a div
  const content = (
    <>
      {/* Icon badge */}
      <div className="flex items-center justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${accents[accent]}`}>
          {icon}
        </div>
      </div>

      {/* Title */}
      <p className="text-sm font-medium text-neutral-500 mb-1">{title}</p>

      {/* Value */}
      <p className="text-3xl font-bold text-neutral-900 mb-1">{value}</p>

      {/* Subtitle */}
      {subtitle && (
        <p className="text-sm text-neutral-500">{subtitle}</p>
      )}

      {/* Action */}
      {actionLabel && (
        <div className="mt-4 pt-4 border-t border-neutral-100">
          <span className="text-sm font-medium text-primary-600 group-hover:text-primary-700 transition-colors">
            {actionLabel} →
          </span>
        </div>
      )}
    </>
  );

  const baseClasses =
    "group block bg-white rounded-2xl border border-neutral-100 shadow-soft p-6 transition-all duration-200 hover:shadow-card hover:-translate-y-0.5";

  // If onClick → button, if actionTo → Link, else plain div
  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={`${baseClasses} text-left w-full`}>
        {content}
      </button>
    );
  }

  if (actionTo) {
    return (
      <Link to={actionTo} className={baseClasses}>
        {content}
      </Link>
    );
  }

  return <div className={baseClasses}>{content}</div>;
};