import { useState, useEffect } from "react";
import toast from "react-hot-toast";

import { usePageTitle } from "../../hooks/usePageTitle.js";
import { categoryApi } from "../../api/category.api.js";
import { Section } from "../../components/ui/Section.jsx";
import { Button } from "../../components/ui/Button.jsx";
import { ConfirmDialog } from "../../components/ui/ConfirmDialog.jsx";
import { CategoriesTable } from "../../components/admin/CategoriesTable.jsx";
import { CategoryFormModal } from "../../components/admin/CategoryFormModal.jsx";

export default function AdminCategories() {
    usePageTitle("Categories");

    // ---- Data state ----
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    // ---- Modal state ----
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [deletingCategory, setDeletingCategory] = useState(null);
    const [deleting, setDeleting] = useState(false);

    // ==========================================
    // Fetch on mount
    // ==========================================
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true);
                const res = await categoryApi.getAll();
                setCategories(res.data.data.categories);
            } catch (err) {
                toast.error(
                    err.response?.data?.message || "Failed to load categories"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    // ==========================================
    // Handlers
    // ==========================================
    const handleAddClick = () => {
        setEditingCategory(null);
        setShowCreateModal(true);
    };

    const handleEdit = (category) => {
        setEditingCategory(category);
        setShowCreateModal(false);
    };

    const handleDelete = (category) => {
        setDeletingCategory(category);
    };

    const handleFormClose = () => {
        setShowCreateModal(false);
        setEditingCategory(null);
    };

    const handleFormSuccess = (savedCategory, isNew) => {
        if (isNew) {
            // Prepend new category, but keep sorted by name
            setCategories((prev) =>
                [...prev, savedCategory].sort((a, b) => a.name.localeCompare(b.name))
            );
        } else {
            // Replace in place
            setCategories((prev) =>
                prev.map((c) => (c._id === savedCategory._id ? savedCategory : c))
            );
        }
    };

    const handleConfirmDelete = async () => {
        if (!deletingCategory) return;

        setDeleting(true);
        try {
            await categoryApi.delete(deletingCategory._id);

            setCategories((prev) =>
                prev.filter((c) => c._id !== deletingCategory._id)
            );

            toast.success(`${deletingCategory.name} deleted successfully`);
            setDeletingCategory(null);
        } catch (err) {
            const message =
                err.response?.data?.message ||
                "Failed to delete category. Please try again.";
            toast.error(message);
        } finally {
            setDeleting(false);
        }
    };

    // ==========================================
    // Render
    // ==========================================
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {/* ---- Header ---- */}
            <div className="mb-8 flex items-start justify-between gap-4 flex-wrap animate-fade-in">
                <div>
                    <h1 className="text-3xl font-bold text-neutral-900">Categories</h1>
                    <p className="mt-1 text-neutral-600">
                        {loading
                            ? "Loading..."
                            : categories.length === 0
                                ? "No categories yet"
                                : `${categories.length} categor${categories.length === 1 ? "y" : "ies"
                                }`}
                    </p>
                </div>
                <Button
                    variant="primary"
                    onClick={handleAddClick}
                    leftIcon={<PlusIcon />}
                >
                    Add Category
                </Button>
            </div>

            {/* ---- Table ---- */}
            <Section noBorder className="!p-0 overflow-hidden">
                <CategoriesTable
                    categories={categories}
                    loading={loading}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            </Section>

            {/* ---- Create / Edit Modal ---- */}
            <CategoryFormModal
                open={showCreateModal || !!editingCategory}
                onClose={handleFormClose}
                category={editingCategory}
                onSuccess={handleFormSuccess}
            />

            {/* ---- Delete Confirmation ---- */}
            <ConfirmDialog
                open={!!deletingCategory}
                onClose={() => setDeletingCategory(null)}
                onConfirm={handleConfirmDelete}
                title="Delete category?"
                message={`Are you sure you want to delete "${deletingCategory?.name}"? This action cannot be undone.`}
                confirmText="Delete category"
                variant="danger"
                loading={deleting}
            />
        </div>
    );
}

// ==========================================
// Inline icon
// ==========================================
const PlusIcon = () => (
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
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
);