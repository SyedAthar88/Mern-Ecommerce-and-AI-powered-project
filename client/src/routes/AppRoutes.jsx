import { Routes, Route, Navigate } from "react-router-dom";

// Layout
import Layout from "../components/layout/Layout.jsx";

// Public pages
import Landing from "../pages/public/Landing.jsx";
import Login from "../pages/public/Login.jsx";
import Signup from "../pages/public/Signup.jsx";
import ForgotPassword from "../pages/public/ForgotPassword.jsx";
import ResetPassword from "../pages/public/ResetPassword.jsx";

// Common
import NotFound from "../pages/NotFound.jsx";

// ==========================================
// All application routes
// ==========================================
export default function AppRoutes() {
  return (
    <Routes>
      {/* ==========================================
          Public routes (no layout/navbar)
          These are auth pages — no navbar
      ========================================== */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />

      {/* ==========================================
          Main app routes (with Layout + Navbar)
      ========================================== */}
      <Route element={<Layout />}>
        <Route path="/" element={<Landing />} />
        {/* Future: /home, /profile, /cart, etc. */}
      </Route>

      {/* ==========================================
          404 — must be last
      ========================================== */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}