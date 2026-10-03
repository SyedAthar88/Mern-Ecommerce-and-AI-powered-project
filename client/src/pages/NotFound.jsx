import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useAuth } from "../hooks/useAuth.js";
import { usePageTitle } from "../hooks/usePageTitle.js";
import { Button } from "../components/ui/Button.jsx";

export default function NotFound() {
  usePageTitle("Page not found");

  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [search, setSearch] = useState("");

  // ==========================================
  // Handle search (placeholder — Phase 18)
  // ==========================================
  const handleSearch = (e) => {
    e.preventDefault();
    if (!search.trim()) return;
    toast("Search coming soon — Phase 18", { icon: "🚧" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4 py-12">
      <div className="w-full max-w-lg text-center animate-fade-in">

        {/* ==========================================
            ICON
        ========================================== */}
        <div className="mx-auto w-24 h-24 rounded-full bg-primary-50 flex items-center justify-center mb-6">
          <CompassIcon />
        </div>

        {/* ==========================================
            BIG 404
        ========================================== */}
        <h1 className="text-7xl sm:text-8xl font-black text-neutral-900 mb-2 tracking-tight">
          4<span className="text-primary-600">0</span>4
        </h1>

        {/* ==========================================
            TITLE + MESSAGE
        ========================================== */}
        <h2 className="text-2xl font-bold text-neutral-900 mb-3">
          Oops! Page not found
        </h2>

        <p className="text-neutral-600 mb-2">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        {location.pathname && location.pathname !== "/" && (
          <p className="text-sm text-neutral-400 mb-8 break-all">
            Tried to visit:{" "}
            <code className="px-2 py-0.5 bg-neutral-100 rounded font-mono text-neutral-600">
              {location.pathname}
            </code>
          </p>
        )}

        {/* ==========================================
            SEARCH (placeholder for Phase 18)
        ========================================== */}
        <form onSubmit={handleSearch} className="mb-8 max-w-md mx-auto">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
              <SearchIcon />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search ClipKart..."
              className="w-full pl-10 pr-3 py-3 rounded-lg border border-neutral-300 bg-white text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-colors"
            />
          </div>
        </form>

        {/* ==========================================
            PRIMARY ACTIONS
        ========================================== */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
          <Link to="/">
            <Button variant="primary" size="lg" fullWidth leftIcon={<HomeIcon />}>
              Go home
            </Button>
          </Link>
          <Link to="/shop">
            <Button variant="secondary" size="lg" fullWidth leftIcon={<ShopIcon />}>
              Browse shop
            </Button>
          </Link>
          {!user && (
            <Link to="/login">
              <Button variant="ghost" size="lg" fullWidth>
                Sign in
              </Button>
            </Link>
          )}
        </div>

        {/* ==========================================
            POPULAR LINKS
        ========================================== */}
        <div className="pt-6 border-t border-neutral-200">
          <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3">
            Popular links
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-2 justify-center text-sm">
            <Link
              to="/"
              className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
            >
              Home
            </Link>
            <span className="text-neutral-300">·</span>
            <Link
              to="/shop"
              className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
            >
              Shop
            </Link>
            <span className="text-neutral-300">·</span>
            {user ? (
              <Link
                to="/profile"
                className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
              >
                Profile
              </Link>
            ) : (
              <Link
                to="/signup"
                className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
              >
                Create account
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// Inline icons
// ==========================================
const CompassIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="48"
    height="48"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-primary-600"
  >
    <circle cx="12" cy="12" r="10" />
    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
  </svg>
);

const SearchIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const HomeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const ShopIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
    <path d="M3 6h18" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);