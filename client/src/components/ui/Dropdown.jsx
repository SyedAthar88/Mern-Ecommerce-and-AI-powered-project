import { useState, useEffect, useRef, createContext, useContext } from "react";

// ==========================================
// Context to give Items access to close()
// ==========================================
const DropdownContext = createContext(null);

// ==========================================
// Dropdown — click-triggered floating menu
// ==========================================
export const Dropdown = ({
  trigger,
  children,
  align = "right",
  className = "",
}) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  // ==========================================
  // Click outside + ESC to close
  // ==========================================
  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    const handleEsc = (event) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="outline-none"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {trigger}
      </button>

      {/* Menu */}
      {open && (
        <DropdownContext.Provider value={{ close }}>
          <div
            className={`
              absolute mt-2 z-50 min-w-[200px]
              bg-white rounded-xl border border-neutral-100
              shadow-elevated p-1
              animate-fade-in
              ${align === "right" ? "right-0" : "left-0"}
            `}
            role="menu"
          >
            {children}
          </div>
        </DropdownContext.Provider>
      )}
    </div>
  );
};

// ==========================================
// Dropdown.Item
// ==========================================
Dropdown.Item = ({
  children,
  icon,
  variant = "default",
  onClick,
  closeOnClick = true,
  className = "",
}) => {
  const ctx = useContext(DropdownContext);

  const variants = {
    default: "text-neutral-700 hover:bg-neutral-100",
    danger: "text-error-600 hover:bg-error-50",
  };

  const handleClick = () => {
    onClick?.();
    if (closeOnClick) ctx?.close();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      role="menuitem"
      className={`
        w-full flex items-center gap-3
        px-3 py-2 rounded-lg text-sm font-medium
        transition-colors text-left
        ${variants[variant]}
        ${className}
      `}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span className="flex-1">{children}</span>
    </button>
  );
};

// ==========================================
// Dropdown.Divider
// ==========================================
Dropdown.Divider = () => (
  <div className="my-1 h-px bg-neutral-100" role="separator" />
);