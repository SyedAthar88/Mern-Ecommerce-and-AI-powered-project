import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

// ==========================================
// Modal — portal-based dialog
// ==========================================
export const Modal = ({
  open,
  onClose,
  title,
  children,
  size = "md",
  showCloseButton = true,
  closeOnBackdrop = true,
}) => {
  const closeButtonRef = useRef(null);

  // ==========================================
  // ESC key → close
  // ==========================================
  useEffect(() => {
    if (!open) return;

    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  // ==========================================
  // Lock body scroll while open
  // ==========================================
  useEffect(() => {
    if (!open) return;

    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  // ==========================================
  // Focus close button on open
  // ==========================================
  useEffect(() => {
    if (open && closeButtonRef.current) {
      setTimeout(() => closeButtonRef.current?.focus(), 50);
    }
  }, [open]);

  // ==========================================
  // Don't render if closed
  // ==========================================
  if (!open) return null;

  const sizes = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
  };

  const handleBackdropClick = () => {
    if (closeOnBackdrop) onClose();
  };

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
    >
      {/* ==========================================
          BACKDROP
      ========================================== */}
      <div
        className="absolute inset-0 bg-neutral-900/50 backdrop-blur-sm"
        onClick={handleBackdropClick}
      />

      {/* ==========================================
          MODAL CONTENT
      ========================================== */}
      <div
        className={`
          relative w-full ${sizes[size]}
          bg-white rounded-2xl shadow-elevated
          animate-fade-in
          max-h-[90vh] flex flex-col
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ---- Header ---- */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
            {title && (
              <h2
                id="modal-title"
                className="text-lg font-semibold text-neutral-900"
              >
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                ref={closeButtonRef}
                type="button"
                onClick={onClose}
                className="ml-auto p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
                aria-label="Close"
              >
                <CloseIcon />
              </button>
            )}
          </div>
        )}

        {/* ---- Body ---- */}
        <div className="px-6 py-5 overflow-y-auto">{children}</div>
      </div>
    </div>,
    document.body
  );
};

// ==========================================
// Inline icon
// ==========================================
const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);