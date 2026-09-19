import { useState, useEffect, useRef } from "react";
import { Link, Navigate } from "react-router-dom";

import { useAuth } from "../../hooks/useAuth.js";
import { authApi } from "../../api/auth.api.js";
import { Card } from "../../components/ui/Card.jsx";
import { Input } from "../../components/ui/Input.jsx";
import { Button } from "../../components/ui/Button.jsx";
import { validateForgotPassword } from "../../utils/validators.js";

export default function ForgotPassword() {
  // ==========================================
  // Hooks
  // ==========================================
  const { user } = useAuth();
  const emailRef = useRef(null);

  // ==========================================
  // State
  // ==========================================
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // ==========================================
  // Auto-focus email on mount
  // ==========================================
  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  // ==========================================
  // Guard: already logged in
  // ==========================================
  if (user) {
    return <Navigate to="/" replace />;
  }

  // ==========================================
  // Handle input change
  // ==========================================
  const handleChange = (e) => {
    setEmail(e.target.value);
    if (error) setError("");
  };

  // ==========================================
  // Handle submit
  // ==========================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Client-side validation
    const errors = validateForgotPassword({ email });
    if (errors.email) {
      setError(errors.email);
      return;
    }

    // 2. Call API
    setLoading(true);
    try {
      await authApi.forgotPassword({ email: email.trim() });
      setSubmitted(true);
    } catch (err) {
      // Even if backend errors, we show generic message in some cases.
      // But for rate limit / network, we want to inform the user.
      setError(
        err.response?.data?.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // Reset form (from success state)
  // ==========================================
  const handleTryDifferentEmail = () => {
    setSubmitted(false);
    setEmail("");
    setError("");
  };

  // ==========================================
  // Render
  // ==========================================
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4 py-12">
      <div className="w-full max-w-md animate-fade-in">
        {/* ============ LOGO ============ */}
        <div className="text-center mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 group"
            aria-label="Go to home"
          >
            <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center text-white font-bold text-lg transition-transform group-hover:scale-105">
              M
            </div>
            <span className="font-bold text-2xl text-neutral-900">
              MERN<span className="text-primary-600">Shop</span>
            </span>
          </Link>
        </div>

        {/* ============ CARD ============ */}
        <Card padding="lg">
          {submitted ? (
            /* ==========================================
               SUCCESS STATE
            ========================================== */
            <div className="text-center animate-fade-in">
              {/* Icon */}
              <div className="mx-auto w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center mb-6">
                <MailCheckIcon />
              </div>

              <h1 className="text-2xl font-bold text-neutral-900 mb-2">
                Check your inbox
              </h1>

              <p className="text-sm text-neutral-600 mb-6">
                If an account with that email exists, we&apos;ve sent a
                password reset link to{" "}
                <strong className="text-neutral-900">{email}</strong>
              </p>

              <div className="bg-neutral-50 border border-neutral-100 rounded-lg p-4 text-left mb-6">
                <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-2">
                  Didn&apos;t get the email?
                </p>
                <ul className="text-sm text-neutral-600 space-y-1.5">
                  <li className="flex items-start gap-2">
                    <span className="text-neutral-400 mt-0.5">•</span>
                    <span>Check your spam or junk folder</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-neutral-400 mt-0.5">•</span>
                    <span>Make sure you entered the correct email</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-neutral-400 mt-0.5">•</span>
                    <span>The link expires in 15 minutes</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <Button
                  variant="secondary"
                  size="lg"
                  fullWidth
                  onClick={handleTryDifferentEmail}
                >
                  Try a different email
                </Button>

                <Link
                  to="/login"
                  className="block text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
                >
                  ← Back to login
                </Link>
              </div>
            </div>
          ) : (
            /* ==========================================
               FORM STATE
            ========================================== */
            <div>
              <div className="text-center mb-6">
                <div className="mx-auto w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center mb-4">
                  <LockIcon />
                </div>
                <h1 className="text-2xl font-bold text-neutral-900 mb-2">
                  Forgot your password?
                </h1>
                <p className="text-sm text-neutral-600">
                  Enter your email and we&apos;ll send you a reset link.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <Input
                  ref={emailRef}
                  name="email"
                  label="Email"
                  type="email"
                  value={email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  error={error}
                  autoComplete="email"
                />

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  loading={loading}
                >
                  Send reset link
                </Button>
              </form>

              <p className="mt-6 text-center text-sm text-neutral-600">
                Remember your password?{" "}
                <Link
                  to="/login"
                  className="font-medium text-primary-600 hover:text-primary-700 transition-colors"
                >
                  Back to login
                </Link>
              </p>
            </div>
          )}
        </Card>

        {/* ============ FOOTER ============ */}
        <p className="text-center text-xs text-neutral-500 mt-8">
          © {new Date().getFullYear()} MERNShop. All rights reserved.
        </p>
      </div>
    </div>
  );
}

// ==========================================
// Inline icons
// ==========================================
const MailCheckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-primary-600"
  >
    <path d="M22 13V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h8" />
    <path d="m22 7-10 5L2 7" />
    <path d="m16 19 2 2 4-4" />
  </svg>
);

const LockIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-primary-600"
  >
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);