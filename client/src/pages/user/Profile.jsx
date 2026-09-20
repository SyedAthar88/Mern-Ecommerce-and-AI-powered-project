import { useAuth } from "../../hooks/useAuth.js";

export default function Profile() {
  const { user } = useAuth();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="animate-fade-in">
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">
          Your Profile
        </h1>
        <p className="text-neutral-600 mb-8">
          Phase 14 will build the full profile editor.
        </p>

        <div className="bg-white rounded-xl border border-neutral-100 shadow-soft p-6">
          <pre className="text-sm text-neutral-700 overflow-auto">
            {JSON.stringify(user, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}