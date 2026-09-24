import { Modal } from "./Modal.jsx";
import { Button } from "./Button.jsx";

// ==========================================
// ConfirmDialog — confirmation modal
// variant: danger | primary
// ==========================================
export const ConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
  loading = false,
}) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      size="sm"
      showCloseButton={false}
      closeOnBackdrop={!loading}
    >
      <div className="text-center">
        {/* ---- Icon ---- */}
        <div
          className={`
            mx-auto w-14 h-14 rounded-full flex items-center justify-center mb-4
            ${variant === "danger" ? "bg-error-50" : "bg-primary-50"}
          `}
        >
          {variant === "danger" ? <AlertIcon /> : <InfoIcon />}
        </div>

        {/* ---- Title ---- */}
        <h2 className="text-lg font-semibold text-neutral-900 mb-2">
          {title}
        </h2>

        {/* ---- Message ---- */}
        <p className="text-sm text-neutral-600 mb-6">{message}</p>

        {/* ---- Actions ---- */}
        <div className="flex flex-col sm:flex-row gap-3 sm:justify-center">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={loading}
            fullWidth
          >
            {cancelText}
          </Button>
          <Button
            variant={variant === "danger" ? "danger" : "primary"}
            onClick={onConfirm}
            loading={loading}
            fullWidth
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

// ==========================================
// Inline icons
// ==========================================
const AlertIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-error-600"
  >
    <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const InfoIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-primary-600"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);