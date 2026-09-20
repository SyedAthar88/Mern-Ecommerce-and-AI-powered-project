import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import { FullScreenLoader } from "../../components/ui/FullScreenLoader.jsx";

// ==========================================
// Landing — redirects based on auth state
// ==========================================
export default function Landing() {
  const { user, loading } = useAuth();

  // Still checking → show loader
  if (loading) {
    return <FullScreenLoader />;
  }

  // Logged in → /home
  if (user) {
    return <Navigate to="/home" replace />;
  }

  // Not logged in → /login
  return <Navigate to="/login" replace />;
}