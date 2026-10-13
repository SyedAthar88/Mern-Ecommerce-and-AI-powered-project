import { useState } from "react";

import { Input } from "../ui/Input.jsx";
import { Button } from "../ui/Button.jsx";
import { isValidEmail } from "../../utils/validators.js";

// ==========================================
// ShippingForm — Step 1 of checkout
// ==========================================
export const ShippingForm = ({ initialData = {}, onSubmit, loading = false }) => {
    const [formData, setFormData] = useState({
        fullName: initialData.fullName || "",
        email: initialData.email || "",
        phone: initialData.phone || "",
        addressLine1: initialData.addressLine1 || "",
        addressLine2: initialData.addressLine2 || "",
        city: initialData.city || "",
        state: initialData.state || "",
        postalCode: initialData.postalCode || "",
        country: initialData.country || "US",
    });

    const [fieldErrors, setFieldErrors] = useState({});

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

        const trimmedName = formData.fullName.trim();
        if (!trimmedName) errors.fullName = "Full name is required";
        else if (trimmedName.length < 2) errors.fullName = "Must be at least 2 characters";
        else if (trimmedName.length > 100) errors.fullName = "Must be under 100 characters";

        const trimmedEmail = formData.email.trim();
        if (!trimmedEmail) errors.email = "Email is required";
        else if (!isValidEmail(trimmedEmail)) errors.email = "Invalid email format";

        const trimmedPhone = formData.phone.trim();
        if (!trimmedPhone) errors.phone = "Phone is required";
        else if (trimmedPhone.length < 7) errors.phone = "Phone must be at least 7 digits";
        else if (trimmedPhone.length > 20) errors.phone = "Phone is too long";

        const trimmedAddress = formData.addressLine1.trim();
        if (!trimmedAddress) errors.addressLine1 = "Address is required";
        else if (trimmedAddress.length < 5) errors.addressLine1 = "Address must be at least 5 characters";
        else if (trimmedAddress.length > 200) errors.addressLine1 = "Address is too long";

        if (formData.addressLine2 && formData.addressLine2.length > 200) {
            errors.addressLine2 = "Must be under 200 characters";
        }

        const trimmedCity = formData.city.trim();
        if (!trimmedCity) errors.city = "City is required";
        else if (trimmedCity.length < 2) errors.city = "City must be at least 2 characters";

        const trimmedState = formData.state.trim();
        if (!trimmedState) errors.state = "State is required";
        else if (trimmedState.length < 2) errors.state = "State must be at least 2 characters";

        const trimmedPostal = formData.postalCode.trim();
        if (!trimmedPostal) errors.postalCode = "Postal code is required";
        else if (trimmedPostal.length < 2) errors.postalCode = "Postal code is too short";
        else if (trimmedPostal.length > 20) errors.postalCode = "Postal code is too long";

        const trimmedCountry = formData.country.trim();
        if (!trimmedCountry) errors.country = "Country is required";

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
            // Scroll to first error
            const firstError = Object.keys(errors)[0];
            document
                .querySelector(`[name="${firstError}"]`)
                ?.scrollIntoView({ behavior: "smooth", block: "center" });
            return;
        }

        // Trim all string values before submitting
        const cleaned = Object.fromEntries(
            Object.entries(formData).map(([k, v]) => [
                k,
                typeof v === "string" ? v.trim() : v,
            ])
        );

        await onSubmit(cleaned);
    };

    // ==========================================
    // Render
    // ==========================================
    return (
        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            {/* ==========================================
          CONTACT INFORMATION
      ========================================== */}
            <div className="bg-white rounded-2xl border border-neutral-100 shadow-soft p-6">
                <h2 className="text-lg font-semibold text-neutral-900 mb-5">
                    Contact Information
                </h2>

                <div className="space-y-4">
                    <Input
                        name="fullName"
                        label="Full name *"
                        type="text"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="John Doe"
                        error={fieldErrors.fullName}
                        autoComplete="name"
                        disabled={loading}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input
                            name="email"
                            label="Email *"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="you@example.com"
                            error={fieldErrors.email}
                            autoComplete="email"
                            disabled={loading}
                        />

                        <Input
                            name="phone"
                            label="Phone *"
                            type="tel"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="+1 234 567 8900"
                            error={fieldErrors.phone}
                            autoComplete="tel"
                            disabled={loading}
                        />
                    </div>
                </div>
            </div>

            {/* ==========================================
          SHIPPING ADDRESS
      ========================================== */}
            <div className="bg-white rounded-2xl border border-neutral-100 shadow-soft p-6">
                <h2 className="text-lg font-semibold text-neutral-900 mb-5">
                    Shipping Address
                </h2>

                <div className="space-y-4">
                    <Input
                        name="addressLine1"
                        label="Address line 1 *"
                        type="text"
                        value={formData.addressLine1}
                        onChange={handleChange}
                        placeholder="123 Main Street"
                        error={fieldErrors.addressLine1}
                        autoComplete="address-line1"
                        disabled={loading}
                    />

                    <Input
                        name="addressLine2"
                        label="Address line 2 (optional)"
                        type="text"
                        value={formData.addressLine2}
                        onChange={handleChange}
                        placeholder="Apartment, suite, etc."
                        error={fieldErrors.addressLine2}
                        autoComplete="address-line2"
                        disabled={loading}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input
                            name="city"
                            label="City *"
                            type="text"
                            value={formData.city}
                            onChange={handleChange}
                            placeholder="New York"
                            error={fieldErrors.city}
                            autoComplete="address-level2"
                            disabled={loading}
                        />

                        <Input
                            name="state"
                            label="State / Province *"
                            type="text"
                            value={formData.state}
                            onChange={handleChange}
                            placeholder="NY"
                            error={fieldErrors.state}
                            autoComplete="address-level1"
                            disabled={loading}
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input
                            name="postalCode"
                            label="Postal code *"
                            type="text"
                            value={formData.postalCode}
                            onChange={handleChange}
                            placeholder="10001"
                            error={fieldErrors.postalCode}
                            autoComplete="postal-code"
                            disabled={loading}
                        />

                        <Input
                            name="country"
                            label="Country *"
                            type="text"
                            value={formData.country}
                            onChange={handleChange}
                            placeholder="US"
                            error={fieldErrors.country}
                            autoComplete="country"
                            disabled={loading}
                        />
                    </div>
                </div>
            </div>

            {/* ==========================================
          SUBMIT
      ========================================== */}
            <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
                <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    loading={loading}
                    rightIcon={!loading ? <ArrowRightIcon /> : null}
                >
                    Continue to Payment
                </Button>
            </div>
        </form>
    );
};

// ==========================================
// Inline icon
// ==========================================
const ArrowRightIcon = () => (
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
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="12 5 19 12 12 19" />
    </svg>
);