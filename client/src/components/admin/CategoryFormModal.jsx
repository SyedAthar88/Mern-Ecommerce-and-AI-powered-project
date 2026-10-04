import { useState, useEffect } from "react";
import toast from "react-hot-toast";

import { categoryApi } from "../../api/category.api.js";
import { Modal } from "../ui/Modal.jsx";
import { Input } from "../ui/Input.jsx";
import { Textarea } from "../ui/Textarea.jsx";
import { Button } from "../ui/Button.jsx";

// ==========================================
// CategoryFormModal — create or edit a category
// ==========================================
export const CategoryFormModal = ({ open, onClose, category, onSuccess }) => {
    const isEditMode = !!category;

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        imageUrl: "",
        isActive: true,
    });
    const [fieldErrors, setFieldErrors] = useState({});
    const [loading, setLoading] = useState(false);

    // ==========================================
    // Sync form when modal opens / target changes
    // ==========================================
    useEffect(() => {
        if (open) {
            if (category) {
                setFormData({
                    name: category.name || "",
                    description: category.description || "",
                    imageUrl: category.image?.url || "",
                    isActive: category.isActive ?? true,
                });
            } else {
                setFormData({
                    name: "",
                    description: "",
                    imageUrl: "",
                    isActive: true,
                });
            }
            setFieldErrors({});
        }
    }, [open, category]);

    // ==========================================
    // Dirty check
    // ==========================================
    const isDirty = isEditMode
        ? formData.name.trim() !== (category.name || "") ||
        formData.description.trim() !== (category.description || "") ||
        formData.imageUrl.trim() !== (category.image?.url || "") ||
        formData.isActive !== (category.isActive ?? true)
        : formData.name.trim().length > 0; // create mode: dirty once name entered

    // ==========================================
    // Change handler
    // ==========================================
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === "checkbox" ? checked : value;
        setFormData((prev) => ({ ...prev, [name]: newValue }));
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

        if (formData.description && formData.description.length > 500) {
            errors.description = "Description must be under 500 characters";
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
            const payload = {
                name: formData.name.trim(),
                description: formData.description.trim(),
                image: formData.imageUrl.trim()
                    ? { url: formData.imageUrl.trim(), publicId: "" }
                    : { url: "", publicId: "" },
                isActive: formData.isActive,
            };

            let res;
            if (isEditMode) {
                res = await categoryApi.update(category._id, payload);
            } else {
                res = await categoryApi.create(payload);
            }

            const savedCategory = res.data.data.category;

            toast.success(
                isEditMode
                    ? `${savedCategory.name} updated successfully`
                    : `${savedCategory.name} created successfully`
            );
            onSuccess?.(savedCategory, !isEditMode);
            onClose();
        } catch (err) {
            const message =
                err.response?.data?.message ||
                `Failed to ${isEditMode ? "update" : "create"} category. Please try again.`;
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    // ==========================================
    // Close (prevent during submit)
    // ==========================================
    const handleClose = () => {
        if (loading) return;
        onClose();
    };

    // ==========================================
    // Image preview
    // ==========================================
    const hasValidImagePreview =
        formData.imageUrl.trim().startsWith("http") &&
        formData.imageUrl.trim().length > 10;

    // ==========================================
    // Render
    // ==========================================
    return (
        <Modal
            open={open}
            onClose={handleClose}
            title={isEditMode ? "Edit Category" : "Add Category"}
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
                    placeholder="e.g. Electronics"
                    error={fieldErrors.name}
                    autoComplete="off"
                />

                {/* ---- Description ---- */}
                <Textarea
                    name="description"
                    label="Description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="A short description of this category (optional)"
                    error={fieldErrors.description}
                    rows={3}
                    maxLength={500}
                    showCount
                />

                {/* ---- Image URL ---- */}
                <div>
                    <Input
                        name="imageUrl"
                        label="Image URL (optional)"
                        type="url"
                        value={formData.imageUrl}
                        onChange={handleChange}
                        placeholder="https://example.com/image.jpg"
                        autoComplete="off"
                    />

                    {/* Preview */}
                    {hasValidImagePreview && (
                        <div className="mt-3 flex items-center gap-3 p-3 bg-neutral-50 rounded-lg border border-neutral-100">
                            <div className="w-16 h-16 rounded-lg bg-neutral-100 overflow-hidden shrink-0">
                                <img
                                    src={formData.imageUrl.trim()}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.parentElement.innerHTML =
                                            '<div class="text-xs text-neutral-400 flex items-center justify-center h-full">Invalid</div>';
                                    }}
                                />
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-medium text-neutral-700">
                                    Image preview
                                </p>
                                <p className="text-xs text-neutral-500 truncate">
                                    {formData.imageUrl.trim()}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* ---- Active toggle ---- */}
                <div className="flex items-center gap-3">
                    <input
                        type="checkbox"
                        id="isActive"
                        name="isActive"
                        checked={formData.isActive}
                        onChange={handleChange}
                        disabled={loading}
                        className="w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500 focus:ring-2 cursor-pointer disabled:cursor-not-allowed"
                    />
                    <label
                        htmlFor="isActive"
                        className="text-sm font-medium text-neutral-700 cursor-pointer select-none"
                    >
                        Active (visible to customers)
                    </label>
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
                        {isEditMode ? "Save Changes" : "Create Category"}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};