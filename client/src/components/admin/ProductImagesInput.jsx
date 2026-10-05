import { useState } from "react";

// ==========================================
// ProductImagesInput — URL input + thumbnails
// value: [{ url, publicId }]
// onChange: (newImages) => void
// ==========================================
export const ProductImagesInput = ({ value = [], onChange, error }) => {
  const [urlInput, setUrlInput] = useState("");
  const [urlError, setUrlError] = useState("");

  // ==========================================
  // Add an image
  // ==========================================
  const handleAdd = () => {
    const url = urlInput.trim();

    if (!url) {
      setUrlError("Please enter an image URL");
      return;
    }

    // Basic URL check
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      setUrlError("URL must start with http:// or https://");
      return;
    }

    // Duplicate check
    if (value.some((img) => img.url === url)) {
      setUrlError("This image is already added");
      return;
    }

    // Add as { url, publicId: "" }
    onChange([...value, { url, publicId: "" }]);
    setUrlInput("");
    setUrlError("");
  };

  // ==========================================
  // Remove an image
  // ==========================================
  const handleRemove = (index) => {
    onChange(value.filter((_, i) => i !== index));
  };

  // ==========================================
  // Enter key in input → add
  // ==========================================
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div>
      {/* ---- Label ---- */}
      <label className="block text-sm font-medium text-neutral-700 mb-1.5">
        Images
      </label>

      {/* ---- Thumbnails grid ---- */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-3 mb-3">
          {value.map((img, index) => (
            <div
              key={`${img.url}-${index}`}
              className="relative group w-24 h-24 rounded-lg border border-neutral-200 overflow-hidden bg-neutral-50"
            >
              <img
                src={img.url}
                alt={`Product image ${index + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />

              {/* Remove button */}
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="absolute top-1 right-1 w-6 h-6 rounded-full bg-white/90 hover:bg-white text-error-600 flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Remove image"
              >
                <CloseIcon />
              </button>

              {/* "First" badge on the first image */}
              {index === 0 && (
                <span className="absolute bottom-1 left-1 text-[10px] font-semibold bg-primary-600 text-white px-1.5 py-0.5 rounded">
                  Main
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ---- URL input + Add button ---- */}
      <div className="flex gap-2">
        <input
          type="url"
          value={urlInput}
          onChange={(e) => {
            setUrlInput(e.target.value);
            if (urlError) setUrlError("");
          }}
          onKeyDown={handleKeyDown}
          placeholder="https://example.com/image.jpg"
          className={`
            flex-1 rounded-lg border bg-white
            px-3 py-2.5 text-sm text-neutral-900 placeholder-neutral-400
            transition-colors duration-150
            focus:outline-none focus:ring-2 focus:ring-offset-0
            ${
              urlError
                ? "border-error-500 focus:border-error-500 focus:ring-error-200"
                : "border-neutral-300 focus:border-primary-500 focus:ring-primary-200"
            }
          `}
        />
        <button
          type="button"
          onClick={handleAdd}
          className="px-4 py-2.5 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors shrink-0"
        >
          Add
        </button>
      </div>

      {/* ---- Helper/Error text ---- */}
      {urlError ? (
        <p className="mt-1.5 text-sm text-error-600">{urlError}</p>
      ) : error ? (
        <p className="mt-1.5 text-sm text-error-600">{error}</p>
      ) : (
        <p className="mt-1.5 text-xs text-neutral-500">
          Paste an image URL and press Enter or click Add. The first image is
          used as the main thumbnail.
        </p>
      )}
    </div>
  );
};

// ==========================================
// Inline icon
// ==========================================
const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);