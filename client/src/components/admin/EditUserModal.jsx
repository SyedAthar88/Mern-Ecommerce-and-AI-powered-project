import { useState, useEffect } from "react";
import toast from "react-hot-toast";

import { adminApi } from "../../api/admin.api.js";
import { Modal } from "../ui/Modal.jsx";
import { Input } from "../ui/Input.jsx";
import { Button } from "../ui/Button.jsx";
import { isValidEmail } from "../../utils/validators.js";

// ==========================================
// EditUserModal — modal form for editing a user
// ==========================================
export const EditUserModal = ({
    open,
    onClose,
    user: targetUser,       // the user being edited (renamed to avoid clash)
    currentUserId,          // logged-in admin's id (to detect self-edit)
    onSuccess,              // called with the updated user
}) => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        role: "user",
    });
    const [fieldErrors, setFieldErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const isSelf = targetUser?._id === currentUserId;

    // ==========================================
    // Sync form when modal opens / target changes
    // ==========================================
    useEffect(() => {
        if (open && targetUser) {
            setFormData({
                name: targetUser.name || "",
                email: targetUser.email || "",
                role: targetUser.role || "user",
            });
            setFieldErrors({});
        }
    }, [open, targetUser]);

    // ==========================================
    // Dirty check
    // ==========================================
    const isDirty =
        !!targetUser &&
        (formData.name.trim() !== (targetUser.name || "") ||
            formData.email.trim() !== (targetUser.email || "") ||
            formData.role !== (targetUser.role || "user"));

    // ==========================================
    // Change handler
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

        const trimmedName = formData.name.trim();
        if (!trimmedName) errors.name = "Name is required";
        else if (trimmedName.length < 2) errors.name = "Name must be at least 2 characters";
        else if (trimmedName.length > 50) errors.name = "Name must be under 50 characters";

        const trimmedEmail = formData.email.trim();
        if (!trimmedEmail) errors.email = "Email is required";
        else if (!isValidEmail(trimmedEmail)) errors.email = "Please enter a valid email";

        if (!["user", "admin"].includes(formData.role)) {
            errors.role = "Invalid role";
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
            // Build payload with only changed fields (cleaner API calls)
            const payload = {};
            if (formData.name.trim() !== targetUser.name) payload.name = formData.name.trim();
            if (formData.email.trim() !== targetUser.email) payload.email = formData.email.trim();
            if (formData.role !== targetUser.role) payload.role = formData.role;

            const res = await adminApi.updateUser(targetUser._id, payload);
            const updatedUser = res.data.data.user;

            toast.success(`${updatedUser.name} updated successfully`);
            onSuccess?.(updatedUser);
            onClose();
        } catch (err) {
            const message =
                err.response?.data?.message || "Failed to update user. Please try again.";
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    // ==========================================
    // Reset form on close (so it doesn't flash old data on next open)
    // ==========================================
    const handleClose = () => {
        if (loading) return;   // prevent closing during submit
        onClose();
    };

    // ==========================================
    // Render
    // ==========================================
    return (
        <Modal
            open={open}
            onClose={handleClose}
            title="Edit User"
            size="md"
            closeOnBackdrop={!loading}
        >
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                {/* ---- Name ---- */}
                <Input
                    name="name"
                    label="Name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Full name"
                    error={fieldErrors.name}
                    autoComplete="off"
                />

                {/* ---- Email ---- */}
                <Input
                    name="email"
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="user@example.com"
                    error={fieldErrors.email}
                    autoComplete="off"
                />

                {/* ---- Role ---- */}
                <div>
                    <label
                        htmlFor="role-select"
                        className="block text-sm font-medium text-neutral-700 mb-1.5"
                    >
                        Role
                    </label>
                    <div className="relative">
                        <select
                            id="role-select"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            disabled={isSelf || loading}
                            className={`
                w-full appearance-none rounded-lg border bg-white
                py-2.5 pl-3 pr-10 text-sm text-neutral-900
                transition-colors duration-150
                focus:outline-none focus:ring-2 focus:ring-offset-0
                disabled:bg-neutral-50 disabled:cursor-not-allowed disabled:text-neutral-500
                ${fieldErrors.role
                                    ? "border-error-500 focus:border-error-500 focus:ring-error-200"
                                    : "border-neutral-300 focus:border-primary-500 focus:ring-primary-200"
                                }
              `}
                        >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-neutral-400">
                            <ChevronDownIcon />
                        </div>
                    </div>

                    {/* Helper text */}
                    {isSelf ? (
                        <p className="mt-1.5 text-xs text-neutral-500">
                            You cannot change your own role.
                        </p>
                    ) : (
                        <p className="mt-1.5 text-xs text-neutral-500">
                            {formData.role === "admin"
                                ? "Admins can access the admin panel and manage all users."
                                : "Regular users can only access their own account."}
                        </p>
                    )}

                    {fieldErrors.role && (
                        <p className="mt-1.5 text-sm text-error-600">{fieldErrors.role}</p>
                    )}
                </div>

                {/* ---- Actions ---- */}
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-100">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={handleClose}
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="primary"
                        disabled={!isDirty}
                        loading={loading}
                    >
                        Save Changes
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

// ==========================================
// Inline icon
// ==========================================
const ChevronDownIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <polyline points="6 9 12 15 18 9" />
    </svg>
);