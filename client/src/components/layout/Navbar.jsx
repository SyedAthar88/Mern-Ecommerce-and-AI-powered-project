import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import { Avatar } from "../ui/Avatar.jsx";
import { Dropdown } from "../ui/Dropdown.jsx";

// ==========================================
// Navbar — top navigation
// ==========================================
export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const isAdmin = user?.role === "admin";

  // ==========================================
  // Handle logout
  // ==========================================
  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  // ==========================================
  // NavLink className helper
  // ==========================================
  const navLinkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors ${
      isActive
        ? "text-primary-600"
        : "text-neutral-600 hover:text-neutral-900"
    }`;

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-neutral-200">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* ==========================================
            LEFT — Logo + Nav Links
        ========================================== */}
        <div className="flex items-center gap-8 min-w-0">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 group shrink-0"
            aria-label="Go to home"
          >
            <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center text-white font-bold transition-transform group-hover:scale-105">
              M
            </div>
            <span className="font-bold text-lg text-neutral-900 hidden sm:inline">
              MERN<span className="text-primary-600">Shop</span>
            </span>
          </Link>

          {/* Nav Links (hidden on mobile) */}
          <div className="hidden md:flex items-center gap-6">
            <NavLink to="/home" className={navLinkClass}>
              Home
            </NavLink>
            <NavLink to="/shop" className={navLinkClass}>
              Shop
            </NavLink>
          </div>
        </div>

        {/* ==========================================
            RIGHT — Cart + User (or Guest buttons)
        ========================================== */}
        <div className="flex items-center gap-3 shrink-0">
          {user ? (
            <>
              {/* Cart Icon */}
              <button
                type="button"
                className="relative p-2 text-neutral-600 hover:text-neutral-900 transition-colors"
                aria-label="Cart"
              >
                <CartIcon />
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  0
                </span>
              </button>

              {/* User Dropdown */}
              <Dropdown
                align="right"
                trigger={
                  <div className="flex items-center gap-2 p-1 pr-2 rounded-full hover:bg-neutral-100 transition-colors">
                    <Avatar user={user} size="sm" />
                    <span className="text-sm font-medium text-neutral-700 hidden sm:inline">
                      {user.name?.split(" ")[0] || "Account"}
                    </span>
                    <ChevronDownIcon />
                  </div>
                }
              >
                {/* User info header */}
                <div className="px-3 py-2 border-b border-neutral-100 mb-1">
                  <p className="text-sm font-semibold text-neutral-900 truncate">
                    {user.name}
                  </p>
                  <p className="text-xs text-neutral-500 truncate">
                    {user.email}
                  </p>
                </div>

                {/* Menu items */}
                <Dropdown.Item
                  icon={<UserIcon />}
                  onClick={() => navigate("/profile")}
                >
                  Profile
                </Dropdown.Item>

                <Dropdown.Item
                  icon={<PackageIcon />}
                  onClick={() => navigate("/orders")}
                >
                  Orders
                </Dropdown.Item>

                {isAdmin && (
                  <Dropdown.Item
                    icon={<SettingsIcon />}
                    onClick={() => navigate("/admin")}
                  >
                    Admin Panel
                  </Dropdown.Item>
                )}

                <Dropdown.Divider />

                <Dropdown.Item
                  icon={<LogoutIcon />}
                  variant="danger"
                  onClick={handleLogout}
                >
                  Logout
                </Dropdown.Item>
              </Dropdown>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors px-3 py-2"
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

// ==========================================
// Inline icons
// ==========================================
const CartIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-neutral-400"
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const UserIcon = () => (
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
    className="text-neutral-500"
  >
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const PackageIcon = () => (
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
    className="text-neutral-500"
  >
    <path d="M16.5 9.4 7.55 4.24" />
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
    <polyline points="3.29 7 12 12 20.71 7" />
    <line x1="12" y1="22" x2="12" y2="12" />
  </svg>
);

const SettingsIcon = () => (
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
    className="text-neutral-500"
  >
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

const LogoutIcon = () => (
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
    className="text-error-500"
  >
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);