import { useAuth } from "../../hooks/useAuth.js";

export default function Landing() {
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center animate-fade-in">
        <h1 className="text-4xl sm:text-5xl font-bold text-neutral-900 mb-4">
          Welcome to <span className="text-primary-600">MENS</span>hop 🛍️
        </h1>
        <p className="text-lg text-neutral-600 max-w-2xl mx-auto mb-8">
          {user
            ? `You're logged in as ${user.email} (${user.role})`
            : "Your future home for AI-powered shopping."}
        </p>
        <div className="text-sm text-neutral-500">
          <p>Phase 12, Sub-step 1 complete ✅</p>
          <p className="mt-2">Routing works. Pages coming next.</p>
        </div>
      </div>
    </div>
  );
}