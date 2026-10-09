import { useContext } from "react";
import { CartContext } from "../context/CartContext.jsx";

// ==========================================
// useCart — access cart context
// ==========================================
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
};