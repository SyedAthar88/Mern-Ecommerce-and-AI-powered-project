import { useState, useEffect } from "react";
import toast from "react-hot-toast";

import api from "../../api/axios.js";
import { useAuth } from "../../hooks/useAuth.js";
import { Section } from "../ui/Section.jsx";
import { Input } from "../ui/Input.jsx";
import { Button } from "../ui/Button.jsx";
import { isValidEmail } from "../../utils/validators.js";

// ==========================================
// ProfileInfoForm — edit name + email
// ==========================================
export const ProfileInfoForm = () => {
  const { user, setUser } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Re-sync if user data changes externally (e.g., from another tab)
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
      });
    }
  }, [user?._id, user?.name, user?.email]);

  // ==========================================
  // Dirty check — has anything changed?
  // ==========================================
  const isDirty =
    formData.name.trim() !== (user?.name || "") ||
    formData.email.trim() !== (user?.email || "");

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

    const trimmedName = formData.name.trim();
    if (!trimmedName) {
      errors.name = "Name is required";
    } else if (trimmedName.length < 2) {
      errors.name = "Name must be at least 2 characters";
    } else if (trimmedName.length > 50) {
      errors.name = "Name must be under 50 characters";
    }

    const trimmedEmail = formData.email.trim();
    if (!trimmedEmail) {
      errors.email = "Email is required";
    } else if (!isValidEmail(trimmedEmail)) {
      errors.email = "Please enter a valid email";
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
      const res = await api.patch("/users/me", {
        name: formData.name.trim(),
        email: formData.email.trim(),
      });

      setUser(res.data.data.user);
      toast.success("Profile updated successfully");
    } catch (err) {
      const message =
        err.response?.data?.message || "Update failed. Please try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // Cancel — revert to original
  // ==========================================
  const handleCancel = () => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
    });
    setFieldErrors({});
  };

  // ==========================================
  // Render
  // ==========================================
  return (
    <Section
      title="Profile Information"
      subtitle="Update your name and email address"
    >
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <Input
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
          label="Email address"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="you@example.com"
          error={fieldErrors.email}
          autoComplete="email"
        />

        <div className="flex items-center gap-3 pt-2">
          <Button
            type="submit"
            variant="primary"
            disabled={!isDirty}
            loading={loading}
          >
            Save Changes
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={handleCancel}
            disabled={!isDirty || loading}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Section>
  );
};