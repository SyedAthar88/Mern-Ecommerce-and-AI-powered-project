import { Link } from "react-router-dom";
import { Button } from "../ui/Button.jsx";

// ==========================================
// ForbiddenPage — 403 Access Denied
// ==========================================
export default function ForbiddenPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md animate-fade-in">
        {/* Icon */}
        <div className="mx-auto w-20 h-20 rounded-full bg-error-50 flex items-center justify-center mb-6">
          <ShieldIcon />
        </div>

        <h1 className="text-3xl font-bold text-neutral-900 mb-3">
          Access denied
        </h1>

        <p className="text-neutral-600 mb-8">
          You don&apos;t have permission to access this page. If you believe
          this is a mistake, contact an administrator.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/home">
            <Button variant="primary" size="lg" fullWidth>
              Back to home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// Icon
// ==========================================
const ShieldIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-error-600"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);