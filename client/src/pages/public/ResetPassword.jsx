import { useState, useEffect, useRef } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import { useAuth } from "../../hooks/useAuth.js";
import { authApi } from "../../api/auth.api.js";
import { Card } from "../../components/ui/Card.jsx";
import { Input } from "../../components/ui/Input.jsx";
import { Button } from "../../components/ui/Button.jsx";
import { validateResetPassword } from "../../utils/validators.js";

export default function ResetPassword() {
  // ==========================================
  // Hooks
  // ==========================================
  const { user } = useAuth();
  const navigate = useNavigate();
  const { token } = useParams();
  const passwordRef = useRef(null);

  // ==========================================
  // State
  // ==========================================
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // ==========================================
  // Auto-focus password on mount
  // ==========================================
  useEffect(() => {
    passwordRef.current?.focus();
  }, []);

  // ==========================================
  // Guard: already logged in
  // ==========================================
  if (user) {
    return <Navigate to="/" replace />;
  }

  // ==========================================
  // Guard: missing token in URL
  // ==========================================
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4 py-12">
        <div className="w-full max-w-md animate-fade-in">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center text-white font-bold text-lg transition-transform group-hover:scale-105">
                M
              </div>
              <span className="font-bold text-2xl text-neutral-900">
                MERN<span className="text-primary-600">Shop</span>
              </span>
            </Link>
          </div>

          <Card padding="lg">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-error-50 flex items-center justify-center mb-6">
                <AlertIcon />
              </div>
              <h1 className="text-2xl font-bold text-neutral-900 mb-2">
                Invalid reset link
              </h1>
              <p className="text-sm text-neutral-600 mb-6">
                This password reset link is missing or invalid. Please request
                a new one.
              </p>
              <Link to="/forgot-password">
                <Button variant="primary" size="lg" fullWidth>
                  Request new link
                </Button>
              </Link>
              <p className="mt-4">
                <Link
                  to="/login"
                  className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
                >
                  ← Back to login
                </Link>
              </p>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // ==========================================
  // Handle input change
  // ==========================================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // ==========================================
  // Handle submit
  // ==========================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Client-side validation
    const errors = validateResetPassword(formData);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    // 2. Call API
    setLoading(true);
    try {
      await authApi.resetPassword(token, { password: formData.password });
      toast.success("Password reset! Please log in with your new password.");
      navigate("/login");
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Reset failed. The link may have expired.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // Render — form state
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
          <div className="text-center mb-6">
            <div className="mx-auto w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center mb-4">
              <LockIcon />
            </div>
            <h1 className="text-2xl font-bold text-neutral-900 mb-2">
              Set new password
            </h1>
            <p className="text-sm text-neutral-600">
              Choose a strong password for your account.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <Input
              ref={passwordRef}
              name="password"
              label="New password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="At least 6 characters"
              error={fieldErrors.password}
              autoComplete="new-password"
            />

            <Input
              name="confirmPassword"
              label="Confirm password"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter your password"
              error={fieldErrors.confirmPassword}
              autoComplete="new-password"
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={loading}
            >
              Reset password
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-neutral-600">
            Remembered it?{" "}
            <Link
              to="/login"
              className="font-medium text-primary-600 hover:text-primary-700 transition-colors"
            >
              Back to login
            </Link>
          </p>
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

const AlertIcon = () => (
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
    className="text-error-600"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);