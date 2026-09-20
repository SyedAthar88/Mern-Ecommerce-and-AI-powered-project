import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import { FullScreenLoader } from "../ui/FullScreenLoader.jsx";

// ==========================================
// ProtectedRoute — requires authentication
// ==========================================
export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // 1. Wait for bootstrap to finish
  if (loading) {
    return <FullScreenLoader message="Checking authentication..." />;
  }

  // 2. Not logged in → redirect to login (remember where they came from)
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Logged in → render the protected content
  return children;
}