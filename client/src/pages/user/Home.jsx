import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import { Section } from "../../components/ui/Section.jsx";
import { Button } from "../../components/ui/Button.jsx";
import { StatCard } from "../../components/user/StatCard.jsx";

export default function Home() {
  const { user } = useAuth();

  const firstName = user?.name?.split(" ")[0] || "there";
  const isAdmin = user?.role === "admin";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* ==========================================
          WELCOME HEADER
      ========================================== */}
      <div className="mb-10 animate-fade-in">
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900">
            Welcome back, {firstName} 👋
          </h1>
          {isAdmin && (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary-100 text-primary-700 uppercase tracking-wide">
              Admin
            </span>
          )}
        </div>
        <p className="mt-2 text-neutral-600">
          Here&apos;s what&apos;s happening with your account today.
        </p>
      </div>

      {/* ==========================================
          STAT CARDS
      ========================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
        <StatCard
          icon={<UserIcon />}
          title="Profile"
          value="1"
          subtitle="Active account"
          actionLabel="Manage"
          actionTo="/profile"
          accent="primary"
        />
        <StatCard
          icon={<PackageIcon />}
          title="Orders"
          value="0"
          subtitle="No orders yet"
          actionLabel="View"
          actionTo="/orders"
          accent="success"
        />
        <StatCard
          icon={<CartIcon />}
          title="Cart"
          value="0"
          subtitle="Items waiting"
          actionLabel="View"
          actionTo="/cart"
          accent="warning"
        />
      </div>

      {/* ==========================================
          QUICK ACTIONS
      ========================================== */}
      <Section
        title="Quick Actions"
        subtitle="Jump back into what matters"
        className="mb-10"
      >
        <div className="flex flex-wrap gap-3">
          <Link to="/profile">
            <Button variant="primary" leftIcon={<EditIcon />}>
              Edit Profile
            </Button>
          </Link>
          <Link to="/shop">
            <Button variant="secondary" leftIcon={<ShopIcon />}>
              Browse Shop
            </Button>
          </Link>
          <Link to="/cart">
            <Button variant="ghost" leftIcon={<CartIcon />}>
              View Cart
            </Button>
          </Link>
        </div>
      </Section>

      {/* ==========================================
          RECENT ACTIVITY (empty state)
      ========================================== */}
      <Section title="Recent Activity" subtitle="Your latest actions will appear here">
        <div className="text-center py-12">
          <div className="mx-auto w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mb-4">
            <InboxIcon />
          </div>
          <h3 className="text-lg font-semibold text-neutral-900 mb-1">
            Nothing yet
          </h3>
          <p className="text-sm text-neutral-500 max-w-sm mx-auto mb-6">
            Start exploring the shop to see your orders, wishlist, and
            activity show up here.
          </p>
          <Link to="/shop">
            <Button variant="primary" rightIcon={<ArrowRightIcon />}>
              Browse Shop
            </Button>
          </Link>
        </div>
      </Section>
    </div>
  );
}

// ==========================================
// Inline icons
// ==========================================
const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const PackageIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16.5 9.4 7.55 4.24" />
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
    <polyline points="3.29 7 12 12 20.71 7" />
    <line x1="12" y1="22" x2="12" y2="12" />
  </svg>
);

const CartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);

const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const ShopIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
    <path d="M3 6h18" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);

const InboxIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-400">
    <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
    <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);