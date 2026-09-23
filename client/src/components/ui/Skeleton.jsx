// ==========================================
// Skeleton — loading placeholder
// variants: text | circular | rectangular
// ==========================================
export const Skeleton = ({
  variant = "rectangular",
  className = "",
}) => {
  const base = "bg-neutral-200 animate-pulse";

  const variants = {
    text: "h-4 w-full rounded",
    circular: "rounded-full",
    rectangular: "rounded-lg",
  };

  return (
    <div className={`${base} ${variants[variant]} ${className}`} />
  );
};