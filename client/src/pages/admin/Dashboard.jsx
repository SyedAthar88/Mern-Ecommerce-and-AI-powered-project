import { useAuth } from "../../hooks/useAuth.js";

export default function AdminDashboard() {
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="animate-fade-in">
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">
          Admin Dashboard
        </h1>
        <p className="text-neutral-600 mb-8">
          Welcome, {user?.name}. Phase 15 will build the full admin panel.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <PlaceholderCard title="Users" subtitle="Manage all users" />
          <PlaceholderCard title="Products" subtitle="Coming in Phase 17" />
          <PlaceholderCard title="Orders" subtitle="Coming in Phase 21" />
        </div>
      </div>
    </div>
  );
}

const PlaceholderCard = ({ title, subtitle }) => (
  <div className="bg-white rounded-xl border border-neutral-100 shadow-soft p-6">
    <h3 className="font-semibold text-neutral-900 mb-1">{title}</h3>
    <p className="text-sm text-neutral-500">{subtitle}</p>
  </div>
);