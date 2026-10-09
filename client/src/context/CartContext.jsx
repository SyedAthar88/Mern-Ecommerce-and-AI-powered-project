import { createContext, useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";

import { cartApi } from "../api/cart.api.js";
import { useAuth } from "../hooks/useAuth.js";

// ==========================================
// Create context
// ==========================================
export const CartContext = createContext(null);

// ==========================================
// Empty cart factory
// ==========================================
const emptyCart = () => ({
    items: [],
    itemCount: 0,
    subtotal: 0,
});

// ==========================================
// Provider
// ==========================================
export const CartProvider = ({ children }) => {
    const { user } = useAuth();

    const [cart, setCart] = useState(emptyCart());
    const [loading, setLoading] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    // ==========================================
    // Fetch cart
    // ==========================================
    const fetchCart = useCallback(async () => {
        if (!user) return;

        try {
            setLoading(true);
            const res = await cartApi.get();
            setCart(res.data.data.cart || emptyCart());
        } catch (err) {
            // 401 = user logged out (or is logging out). Silent.
            if (err.response?.status !== 401) {
                toast.error(err.response?.data?.message || "Failed to load cart");
            }
            setCart(emptyCart());
        } finally {
            setLoading(false);
        }
    }, [user]);

    // ==========================================
    // Auto-fetch on user change (login/logout)
    // ==========================================
    useEffect(() => {
        if (!user) {
            // Logged out → reset cart state
            setCart(emptyCart());
            setIsDrawerOpen(false);
            return;
        }

        fetchCart();
    }, [user?._id, fetchCart]);

    // ==========================================
    // Add item
    // ==========================================
    const addItem = useCallback(
        async (productId, quantity = 1) => {
            if (!user) {
                toast.error("Please login to add items to cart");
                return false;
            }

            try {
                setLoading(true);
                const res = await cartApi.addItem(productId, quantity);
                setCart(res.data.data.cart);
                return true;
            } catch (err) {
                toast.error(err.response?.data?.message || "Failed to add to cart");
                return false;
            } finally {
                setLoading(false);
            }
        },
        [user]
    );

    // ==========================================
    // Update quantity
    // ==========================================
    const updateItem = useCallback(
        async (productId, quantity) => {
            try {
                setLoading(true);
                const res = await cartApi.updateItem(productId, quantity);
                setCart(res.data.data.cart);
                return true;
            } catch (err) {
                toast.error(err.response?.data?.message || "Failed to update cart");
                return false;
            } finally {
                setLoading(false);
            }
        },
        []
    );

    // ==========================================
    // Remove item
    // ==========================================
    const removeItem = useCallback(async (productId) => {
        try {
            setLoading(true);
            const res = await cartApi.removeItem(productId);
            setCart(res.data.data.cart);
            return true;
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to remove item");
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    // ==========================================
    // Clear cart
    // ==========================================
    const clearCart = useCallback(async () => {
        try {
            setLoading(true);
            const res = await cartApi.clear();
            setCart(res.data.data.cart || emptyCart());
            return true;
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to clear cart");
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    // ==========================================
    // Drawer controls
    // ==========================================
    const openDrawer = useCallback(() => setIsDrawerOpen(true), []);
    const closeDrawer = useCallback(() => setIsDrawerOpen(false), []);
    const toggleDrawer = useCallback(
        () => setIsDrawerOpen((prev) => !prev),
        []
    );

    // ==========================================
    // Context value
    // ==========================================
    const value = {
        cart,
        loading,
        isDrawerOpen,
        fetchCart,
        addItem,
        updateItem,
        removeItem,
        clearCart,
        openDrawer,
        closeDrawer,
        toggleDrawer,
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};