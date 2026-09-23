import { useState } from "react";
import toast from "react-hot-toast";

import api from "../../api/axios.js";
import { Section } from "../ui/Section.jsx";
import { Input } from "../ui/Input.jsx";
import { Button } from "../ui/Button.jsx";

// ==========================================
// ChangePasswordForm — update user password
// ==========================================
export const ChangePasswordForm = () => {
    const [formData, setFormData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [fieldErrors, setFieldErrors] = useState({});
    const [loading, setLoading] = useState(false);

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
    // Validate
    // ==========================================
    const validate = () => {
        const errors = {};

        if (!formData.currentPassword) {
            errors.currentPassword = "Current password is required";
        }

        if (!formData.newPassword) {
            errors.newPassword = "New password is required";
        } else if (formData.newPassword.length < 6) {
            errors.newPassword = "Password must be at least 6 characters";
        } else if (formData.newPassword === formData.currentPassword) {
            errors.newPassword = "New password must be different from current";
        }

        if (!formData.confirmPassword) {
            errors.confirmPassword = "Please confirm your new password";
        } else if (formData.newPassword !== formData.confirmPassword) {
            errors.confirmPassword = "Passwords do not match";
        }

        return errors;
    };

    // ==========================================
    // Submit
    // ==========================================
    const handleSubmit = async (e) => {
        e.preventDefault();

        const errors = validate();
        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            return;
        }

        setLoading(true);
        try {
            await api.patch("/users/me/password", {
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword,
            });

            toast.success("Password changed successfully");
            setFormData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            });
            setFieldErrors({});
        } catch (err) {
            const message =
                err.response?.data?.message ||
                "Failed to change password. Please try again.";
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    // ==========================================
    // Render
    // ==========================================
    return (
        <Section
            title="Change Password"
            subtitle="Ensure your account stays secure by using a strong password"
        >
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                <Input
                    name="currentPassword"
                    label="Current password"
                    type="password"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    placeholder="Enter your current password"
                    error={fieldErrors.currentPassword}
                    autoComplete="current-password"
                />

                <Input
                    name="newPassword"
                    label="New password"
                    type="password"
                    value={formData.newPassword}
                    onChange={handleChange}
                    placeholder="At least 6 characters"
                    error={fieldErrors.newPassword}
                    autoComplete="new-password"
                />

                <Input
                    name="confirmPassword"
                    label="Confirm new password"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Re-enter your new password"
                    error={fieldErrors.confirmPassword}
                    autoComplete="new-password"
                />

                <div className="flex items-center gap-3 pt-2">
                    <Button
                        type="submit"
                        variant="primary"
                        loading={loading}
                        leftIcon={<LockIcon />}
                    >
                        Change Password
                    </Button>
                </div>
            </form>
        </Section>
    );
};

// ==========================================
// Inline icon
// ==========================================
const LockIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
);