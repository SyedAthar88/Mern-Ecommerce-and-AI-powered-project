import { useState, useEffect } from "react";
import toast from "react-hot-toast";

import { productApi } from "../../api/product.api.js";
import { categoryApi } from "../../api/category.api.js";
import { Modal } from "../ui/Modal.jsx";
import { Input } from "../ui/Input.jsx";
import { Textarea } from "../ui/Textarea.jsx";
import { Select } from "../ui/Select.jsx";
import { Button } from "../ui/Button.jsx";
import { ProductImagesInput } from "./ProductImagesInput.jsx";
import { ProductTagsInput } from "./ProductTagsInput.jsx";

// ==========================================
// Initial form state
// ==========================================
const getInitialFormData = () => ({
  name: "",
  category: "",
  shortDescription: "",
  description: "",
  price: "",
  compareAtPrice: "",
  stock: "0",
  sku: "",
  tags: [],
  images: [],
  isActive: true,
  isFeatured: false,
});

// ==========================================
// ProductFormModal — create or edit a product
// ==========================================
export const ProductFormModal = ({ open, onClose, product, onSuccess }) => {
  const isEditMode = !!product;

  const [formData, setFormData] = useState(getInitialFormData());
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // ==========================================
  // Load categories when modal opens
  // ==========================================
  useEffect(() => {
    if (!open) return;

    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        const res = await categoryApi.getDropdown();
        setCategories(res.data.data.categories);
      } catch (err) {
        toast.error("Failed to load categories");
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, [open]);

  // ==========================================
  // Sync form when modal opens / product changes
  // ==========================================
  useEffect(() => {
    if (open) {
      if (product) {
        setFormData({
          name: product.name || "",
          category:
            product.category?._id || product.category || "",
          shortDescription: product.shortDescription || "",
          description: product.description || "",
          price: product.price?.toString() || "",
          compareAtPrice:
            product.compareAtPrice !== null &&
            product.compareAtPrice !== undefined
              ? product.compareAtPrice.toString()
              : "",
          stock: product.stock?.toString() || "0",
          sku: product.sku || "",
          tags: product.tags || [],
          images: product.images || [],
          isActive: product.isActive ?? true,
          isFeatured: product.isFeatured ?? false,
        });
      } else {
        setFormData(getInitialFormData());
      }
      setFieldErrors({});
    }
  }, [open, product]);

  // ==========================================
  // Dirty check
  // ==========================================
  const isDirty = (() => {
    if (!isEditMode) {
      return formData.name.trim().length > 0;
    }

    // Compare against existing product
    const normalizedPrice = String(formData.price).trim();
    const originalPrice = String(product.price ?? "");
    const normalizedCompare = String(formData.compareAtPrice).trim();
    const originalCompare =
      product.compareAtPrice === null || product.compareAtPrice === undefined
        ? ""
        : String(product.compareAtPrice);
    const normalizedStock = String(formData.stock).trim();
    const originalStock = String(product.stock ?? 0);
    const originalCategory =
      product.category?._id || product.category || "";

    return (
      formData.name.trim() !== (product.name || "") ||
      formData.category !== originalCategory ||
      formData.shortDescription.trim() !==
        (product.shortDescription || "") ||
      formData.description.trim() !== (product.description || "") ||
      normalizedPrice !== originalPrice ||
      normalizedCompare !== originalCompare ||
      normalizedStock !== originalStock ||
      formData.sku.trim() !== (product.sku || "") ||
      JSON.stringify(formData.tags) !== JSON.stringify(product.tags || []) ||
      JSON.stringify(formData.images) !==
        JSON.stringify(product.images || []) ||
      formData.isActive !== (product.isActive ?? true) ||
      formData.isFeatured !== (product.isFeatured ?? false)
    );
  })();

  // ==========================================
  // Change handler for text/number/select/checkbox
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
  // Change handler for arrays (images, tags)
  // ==========================================
  const handleArrayChange = (field) => (newValue) => {
    setFormData((prev) => ({ ...prev, [field]: newValue }));
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  // ==========================================
  // Validate
  // ==========================================
  const validate = () => {
    const errors = {};

    const trimmedName = formData.name.trim();
    if (!trimmedName) errors.name = "Name is required";
    else if (trimmedName.length < 2)
      errors.name = "Name must be at least 2 characters";
    else if (trimmedName.length > 200)
      errors.name = "Name must be under 200 characters";

    if (!formData.category) errors.category = "Category is required";

    const trimmedDescription = formData.description.trim();
    if (!trimmedDescription) errors.description = "Description is required";
    else if (trimmedDescription.length < 10)
      errors.description = "Description must be at least 10 characters";
    else if (trimmedDescription.length > 5000)
      errors.description = "Description must be under 5000 characters";

    if (formData.shortDescription.length > 200) {
      errors.shortDescription = "Short description must be under 200 characters";
    }

    // Price
    const price = Number(formData.price);
    if (formData.price === "" || isNaN(price)) {
      errors.price = "Price is required";
    } else if (price < 0) {
      errors.price = "Price cannot be negative";
    } else if (price > 1000000) {
      errors.price = "Price is too high";
    }

    // Compare at price
    if (formData.compareAtPrice !== "") {
      const comparePrice = Number(formData.compareAtPrice);
      if (isNaN(comparePrice)) {
        errors.compareAtPrice = "Invalid number";
      } else if (comparePrice < 0) {
        errors.compareAtPrice = "Cannot be negative";
      } else if (comparePrice <= price) {
        errors.compareAtPrice = "Must be higher than price";
      }
    }

    // Stock
    const stock = Number(formData.stock);
    if (formData.stock === "" || isNaN(stock)) {
      errors.stock = "Stock is required";
    } else if (stock < 0) {
      errors.stock = "Stock cannot be negative";
    } else if (!Number.isInteger(stock)) {
      errors.stock = "Stock must be a whole number";
    } else if (stock > 1000000) {
      errors.stock = "Stock is too high";
    }

    // SKU
    if (formData.sku.length > 50) {
      errors.sku = "SKU must be under 50 characters";
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
      // Scroll to top of form so user sees the first error
      const firstErrorField = Object.keys(errors)[0];
      document
        .querySelector(`[name="${firstErrorField}"]`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: formData.name.trim(),
        category: formData.category,
        shortDescription: formData.shortDescription.trim(),
        description: formData.description.trim(),
        price: Number(formData.price),
        compareAtPrice:
          formData.compareAtPrice !== ""
            ? Number(formData.compareAtPrice)
            : null,
        stock: Number(formData.stock),
        sku: formData.sku.trim() || "",
        tags: formData.tags,
        images: formData.images,
        isActive: formData.isActive,
        isFeatured: formData.isFeatured,
      };

      let res;
      if (isEditMode) {
        res = await productApi.update(product._id, payload);
      } else {
        res = await productApi.create(payload);
      }

      const savedProduct = res.data.data.product;

      toast.success(
        isEditMode
          ? `${savedProduct.name} updated successfully`
          : `${savedProduct.name} created successfully`
      );
      onSuccess?.(savedProduct, !isEditMode);
      onClose();
    } catch (err) {
      const message =
        err.response?.data?.message ||
        `Failed to ${isEditMode ? "update" : "create"} product.`;
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // Close
  // ==========================================
  const handleClose = () => {
    if (loading) return;
    onClose();
  };

  // ==========================================
  // Category options
  // ==========================================
  const categoryOptions = categories.map((c) => ({
    value: c._id,
    label: c.name,
  }));

  // ==========================================
  // Render
  // ==========================================
  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={isEditMode ? "Edit Product" : "Add Product"}
      size="xl"
      closeOnBackdrop={!loading}
    >
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        {/* ==========================================
            IMAGES
        ========================================== */}
        <ProductImagesInput
          value={formData.images}
          onChange={handleArrayChange("images")}
          error={fieldErrors.images}
        />

        {/* ==========================================
            NAME
        ========================================== */}
        <Input
          name="name"
          label="Product name *"
          type="text"
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g. Wireless Headphones Pro"
          error={fieldErrors.name}
          autoComplete="off"
        />

        {/* ==========================================
            CATEGORY
        ========================================== */}
        <Select
          name="category"
          label="Category *"
          value={formData.category}
          onChange={handleChange}
          options={categoryOptions}
          placeholder={
            categoriesLoading
              ? "Loading categories..."
              : categoryOptions.length === 0
              ? "No categories — create one first"
              : "Select a category"
          }
          error={fieldErrors.category}
          disabled={categoriesLoading || categoryOptions.length === 0}
        />

        {/* ==========================================
            SHORT DESCRIPTION
        ========================================== */}
        <Textarea
          name="shortDescription"
          label="Short description"
          value={formData.shortDescription}
          onChange={handleChange}
          placeholder="Brief summary shown on product cards (optional)"
          error={fieldErrors.shortDescription}
          rows={2}
          maxLength={200}
          showCount
        />

        {/* ==========================================
            DESCRIPTION
        ========================================== */}
        <Textarea
          name="description"
          label="Description *"
          value={formData.description}
          onChange={handleChange}
          placeholder="Full product description"
          error={fieldErrors.description}
          rows={5}
          maxLength={5000}
          showCount
        />

        {/* ==========================================
            PRICING (two columns)
        ========================================== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            name="price"
            label="Price *"
            type="number"
            step="0.01"
            min="0"
            value={formData.price}
            onChange={handleChange}
            placeholder="0.00"
            error={fieldErrors.price}
            autoComplete="off"
          />
          <Input
            name="compareAtPrice"
            label="Compare-at price"
            type="number"
            step="0.01"
            min="0"
            value={formData.compareAtPrice}
            onChange={handleChange}
            placeholder="Original price (optional)"
            error={fieldErrors.compareAtPrice}
            autoComplete="off"
          />
        </div>

        {/* ==========================================
            STOCK + SKU (two columns)
        ========================================== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            name="stock"
            label="Stock *"
            type="number"
            step="1"
            min="0"
            value={formData.stock}
            onChange={handleChange}
            placeholder="0"
            error={fieldErrors.stock}
            autoComplete="off"
          />
          <Input
            name="sku"
            label="SKU"
            type="text"
            value={formData.sku}
            onChange={handleChange}
            placeholder="e.g. WH-PRO-001 (optional)"
            error={fieldErrors.sku}
            autoComplete="off"
          />
        </div>

        {/* ==========================================
            TAGS
        ========================================== */}
        <ProductTagsInput
          value={formData.tags}
          onChange={handleArrayChange("tags")}
          error={fieldErrors.tags}
        />

        {/* ==========================================
            STATUS TOGGLES
        ========================================== */}
        <div className="flex flex-wrap items-center gap-6 pt-2">
          <label className="inline-flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              disabled={loading}
              className="w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500 focus:ring-2 cursor-pointer disabled:cursor-not-allowed"
            />
            <span className="text-sm font-medium text-neutral-700">
              Active
            </span>
            <span className="text-xs text-neutral-500 hidden sm:inline">
              (visible to customers)
            </span>
          </label>

          <label className="inline-flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              name="isFeatured"
              checked={formData.isFeatured}
              onChange={handleChange}
              disabled={loading}
              className="w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500 focus:ring-2 cursor-pointer disabled:cursor-not-allowed"
            />
            <span className="text-sm font-medium text-neutral-700">
              Featured
            </span>
            <span className="text-xs text-neutral-500 hidden sm:inline">
              (show on homepage)
            </span>
          </label>
        </div>

        {/* ==========================================
            ACTIONS
        ========================================== */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-100">
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
            {isEditMode ? "Save Changes" : "Create Product"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};