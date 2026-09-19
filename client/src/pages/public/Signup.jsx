import { useState, useEffect, useRef } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useAuth } from "../../hooks/useAuth.js";
import { Card } from "../../components/ui/Card.jsx";
import { Input } from "../../components/ui/Input.jsx";
import { Button } from "../../components/ui/Button.jsx";
import { validateSignup } from "../../utils/validators.js";

export default function Signup() {
  // ==========================================
  // Hooks
  // ==========================================
  const { user, signup, login } = useAuth();
  const navigate = useNavigate();
  const nameRef = useRef(null);

  // ==========================================
  // State
  // ==========================================
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // ==========================================
  // Auto-focus name on mount
  // ==========================================
  useEffect(() => {
    nameRef.current?.focus();
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
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error for this field as user types
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // ==========================================
  // Handle form submit
  // ==========================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Client-side validation
    const errors = validateSignup(formData);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    // 2. Create account + auto-login
    setLoading(true);
    try {
      // Step 1: create user in DB (doesn't log in)
      await signup({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });

      // Step 2: log them in immediately (sets cookies + context)
      await login(formData.email.trim(), formData.password);

      toast.success("Account created! Welcome to MERNShop 🎉");
      navigate("/");
    } catch (err) {
      const message =
        err.response?.data?.message || "Signup failed. Please try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
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

        {/* ============ FORM CARD ============ */}
        <Card
          title="Create your account"
          subtitle="Start shopping in seconds"
          padding="lg"
        >
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <Input
              ref={nameRef}
              name="name"
              label="Full name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              error={fieldErrors.name}
              autoComplete="name"
            />

            <Input
              name="email"
              label="Email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              error={fieldErrors.email}
              autoComplete="email"
            />

            <Input
              name="password"
              label="Password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="At least 6 characters"
              error={fieldErrors.password}
              autoComplete="new-password"
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={loading}
            >
              Create account
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-neutral-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-primary-600 hover:text-primary-700 transition-colors"
            >
              Login
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