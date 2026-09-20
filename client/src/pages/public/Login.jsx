import { useState, useEffect, useRef } from "react";
import { Link, Navigate, useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";

import { useAuth } from "../../hooks/useAuth.js";
import { Card } from "../../components/ui/Card.jsx";
import { Input } from "../../components/ui/Input.jsx";
import { Button } from "../../components/ui/Button.jsx";
import { validateLogin } from "../../utils/validators.js";

export default function Login() {
    // ==========================================
    // Hooks
    // ==========================================
    const { user, login } = useAuth();
    const navigate = useNavigate();
    const emailRef = useRef(null);
    const location = useLocation();
    // ==========================================
    // State
    // ==========================================
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [fieldErrors, setFieldErrors] = useState({});
    const [loading, setLoading] = useState(false);

    // ==========================================
    // Auto-focus email on mount
    // ==========================================
    useEffect(() => {
        emailRef.current?.focus();
    }, []);

    // ==========================================
    // Guard: already logged in → redirect
    // ==========================================
    // Already logged in → send to /home (or wherever they came from)
    if (user) {
        const redirectTo = location.state?.from?.pathname || "/home";
        return <Navigate to={redirectTo} replace />;
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

  const errors = validateLogin(formData);
  if (Object.keys(errors).length > 0) {
    setFieldErrors(errors);
    return;
  }

  setLoading(true);
  try {
    await login(formData.email, formData.password);
    toast.success("Welcome back!");

    const redirectTo = location.state?.from?.pathname || "/home";
    navigate(redirectTo, { replace: true });
  } catch (err) {
    const message =
      err.response?.data?.message || "Login failed. Please try again.";
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
                    title="Welcome back"
                    subtitle="Sign in to your account to continue"
                    padding="lg"
                >
                    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                        <Input
                            ref={emailRef}
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
                            placeholder="••••••••"
                            error={fieldErrors.password}
                            autoComplete="current-password"
                        />

                        <div className="flex justify-end">
                            <Link
                                to="/forgot-password"
                                className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            fullWidth
                            loading={loading}
                        >
                            Sign in
                        </Button>
                    </form>

                    <p className="mt-6 text-center text-sm text-neutral-600">
                        Don&apos;t have an account?{" "}
                        <Link
                            to="/signup"
                            className="font-medium text-primary-600 hover:text-primary-700 transition-colors"
                        >
                            Sign up
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