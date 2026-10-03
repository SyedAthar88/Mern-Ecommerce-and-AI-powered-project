import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button.jsx";

// ==========================================
// ErrorFallback — friendly crash UI
// ==========================================
export default function ErrorFallback({ error, onReset }) {
    const [showDetails, setShowDetails] = useState(false);

    // Show details only in development
    const isDev = import.meta.env.DEV;

    return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4 py-12">
            <div className="w-full max-w-md animate-fade-in">
                {/* ---- Icon ---- */}
                <div className="mx-auto w-20 h-20 rounded-full bg-error-50 flex items-center justify-center mb-6">
                    <AlertIcon />
                </div>

                {/* ---- Title ---- */}
                <h1 className="text-2xl font-bold text-neutral-900 text-center mb-2">
                    Something went wrong
                </h1>

                {/* ---- Message ---- */}
                <p className="text-center text-neutral-600 mb-8">
                    An unexpected error occurred. You can try again, or head back to the
                    home page.
                </p>

                {/* ---- Actions ---- */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    {onReset && (
                        <Button variant="primary" onClick={onReset} fullWidth>
                            Try again
                        </Button>
                    )}
                    <Link to="/" className="flex-1">
                        <Button variant="secondary" fullWidth>
                            Go home
                        </Button>
                    </Link>
                </div>

                {/* ---- Dev-only error details ---- */}
                {isDev && error && (
                    <div className="mt-8">
                        <button
                            type="button"
                            onClick={() => setShowDetails((s) => !s)}
                            className="text-xs font-medium text-neutral-500 hover:text-neutral-800 transition-colors flex items-center gap-1 mx-auto"
                        >
                            <span>{showDetails ? "▾" : "▸"}</span>
                            {showDetails ? "Hide" : "Show"} error details
                        </button>

                        {showDetails && (
                            <pre className="mt-3 p-3 bg-neutral-900 text-neutral-100 text-xs rounded-lg overflow-auto max-h-64 whitespace-pre-wrap break-words">
                                {error.message}
                                {error.stack && `\n\n${error.stack}`}
                            </pre>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

// ==========================================
// Inline icon
// ==========================================
const AlertIcon = () => (
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
        <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
);