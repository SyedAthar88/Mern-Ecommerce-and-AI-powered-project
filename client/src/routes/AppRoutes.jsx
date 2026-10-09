import { Routes, Route, Navigate } from "react-router-dom";
import AdminCategories from "../pages/admin/Categories.jsx";
import AdminProducts from "../pages/admin/Products.jsx";
// Layout
import Layout from "../components/layout/Layout.jsx";
import ProductDetail from "../pages/shop/ProductDetail.jsx";
// Guards
import ProtectedRoute from "../components/guards/ProtectedRoute.jsx";
import AdminRoute from "../components/guards/AdminRoute.jsx";
import Shop from "../pages/shop/Shop.jsx";
// Public pages
import Landing from "../pages/public/Landing.jsx";
import Login from "../pages/public/Login.jsx";
import Signup from "../pages/public/Signup.jsx";
import ForgotPassword from "../pages/public/ForgotPassword.jsx";
import ResetPassword from "../pages/public/ResetPassword.jsx";

// User pages (protected)
import Home from "../pages/user/Home.jsx";
import Profile from "../pages/user/Profile.jsx";
import Cart from "../pages/Cart.jsx";
// Admin pages (protected + role)
import AdminDashboard from "../pages/admin/Dashboard.jsx";
import AdminUsers from "../pages/admin/Users.jsx";

// Common
import NotFound from "../pages/NotFound.jsx";

// ==========================================
// All application routes
// ==========================================
export default function AppRoutes() {
  return (
    <Routes>
      {/* ==========================================
          PUBLIC ROUTES — no layout, no guards
      ========================================== */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />

      {/* ==========================================
          MAIN APP — with Layout + Navbar
      ========================================== */}
      <Route element={<Layout />}>
        {/* Redirect landing */}
        <Route path="/" element={<Landing />} />

        {/* ---- Protected user routes ---- */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* ---- Protected admin routes ---- */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <AdminUsers />
            </AdminRoute>
          }
        />
      </Route>
      <Route
        path="/admin/categories"
        element={
          <AdminRoute>
            <AdminCategories />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/products"
        element={
          <AdminRoute>
            <AdminProducts />
          </AdminRoute>
        }
      />
      <Route path="/shop" element={<Shop />} />
      <Route path="/shop/:categorySlug" element={<Shop />} />
      <Route path="/product/:slug" element={<ProductDetail />} />
      <Route
        path="/cart"
        element={
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        }
      />      {/* ==========================================
          404 — must be last
      ========================================== */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}