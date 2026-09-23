// ==========================================
// Avatar color palette
// Deterministic — same user = same color
// ==========================================
const COLORS = [
  "bg-primary-600",
  "bg-emerald-600",
  "bg-orange-600",
  "bg-pink-600",
  "bg-violet-600",
  "bg-cyan-600",
  "bg-amber-600",
  "bg-rose-600",
];

// ==========================================
// Get initials from a name
// "Ali Khan" → "AK"
// "Ali" → "A"
// "" → "?"
// ==========================================
const getInitials = (name) => {
  if (!name || typeof name !== "string") return "?";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

// ==========================================
// Pick a color from the palette based on user id
// ==========================================
const getColor = (id = "") => {
  const str = String(id);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return COLORS[Math.abs(hash) % COLORS.length];
};

// ==========================================
// Avatar component
// sizes: sm (32px) | md (40px) | lg (64px)
// ==========================================
export const Avatar = ({ user, size = "md", className = "" }) => {
  const sizes = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-16 h-16 text-xl",
  };

  const initials = getInitials(user?.name);
  const color = getColor(user?._id || user?.email || "");

  return (
    <div
      className={`
        ${sizes[size]}
        ${color}
        rounded-full flex items-center justify-center
        text-white font-semibold select-none
        ${className}
      `}
      aria-label={user?.name || "User avatar"}
    >
      {initials}
    </div>
  );
};