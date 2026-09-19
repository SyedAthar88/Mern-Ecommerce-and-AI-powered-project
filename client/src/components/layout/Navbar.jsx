import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";

// ==========================================
// Top navigation bar
// ==========================================
export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-neutral-200">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* ============ LOGO ============ */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center text-white font-bold transition-transform group-hover:scale-105">
            M
          </div>
          <span className="font-bold text-lg text-neutral-900">
            MERN<span className="text-primary-600">Shop</span>
          </span>
        </Link>

        {/* ============ USER AREA ============ */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="hidden sm:inline text-sm text-neutral-600">
                Hi, <strong className="text-neutral-900">{user.name}</strong>
              </span>
              <button
                onClick={logout}
                className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="text-sm font-medium px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}