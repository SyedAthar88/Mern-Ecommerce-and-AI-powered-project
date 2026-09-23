// ==========================================
// Format date as "Sep 2025"
// ==========================================
export const formatMonthYear = (date) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
};

// ==========================================
// Format date as "Sep 24, 2025"
// ==========================================
export const formatDate = (date) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

// ==========================================
// Capitalize first letter of a string
// ==========================================
export const capitalize = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
};