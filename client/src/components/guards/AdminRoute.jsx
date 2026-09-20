import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import { FullScreenLoader } from "../ui/FullScreenLoader.jsx";
import ForbiddenPage from "./ForbiddenPage.jsx";

// ==========================================
// AdminRoute — requires authentication + admin role
// ==========================================
export default function AdminRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // 1. Wait for bootstrap
  if (loading) {
    return <FullScreenLoader message="Checking permissions..." />;
  }

  // 2. Not logged in → redirect to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Logged in but not admin → show Forbidden page
  if (user.role !== "admin") {
    return <ForbiddenPage />;
  }

  // 4. Logged in as admin → render
  return children;
}