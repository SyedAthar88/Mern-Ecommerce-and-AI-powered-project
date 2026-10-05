import { useState } from "react";

// ==========================================
// ProductTagsInput — chip-based tag input
// value: string[]
// onChange: (newTags) => void
// ==========================================
export const ProductTagsInput = ({
  value = [],
  onChange,
  error,
  maxTags = 20,
}) => {
  const [input, setInput] = useState("");
  const [inputError, setInputError] = useState("");

  // ==========================================
  // Add a tag
  // ==========================================
  const handleAdd = () => {
    const tag = input.trim().toLowerCase();

    if (!tag) {
      setInput("");
      return;
    }

    if (tag.length > 30) {
      setInputError("Tag must be under 30 characters");
      return;
    }

    if (value.includes(tag)) {
      setInputError("Tag already added");
      return;
    }

    if (value.length >= maxTags) {
      setInputError(`Maximum ${maxTags} tags allowed`);
      return;
    }

    onChange([...value, tag]);
    setInput("");
    setInputError("");
  };

  // ==========================================
  // Remove a tag
  // ==========================================
  const handleRemove = (tag) => {
    onChange(value.filter((t) => t !== tag));
  };

  // ==========================================
  // Key handling
  // ==========================================
  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      handleAdd();
    } else if (e.key === "Backspace" && !input && value.length > 0) {
      // Backspace on empty input → remove last tag
      handleRemove(value[value.length - 1]);
    }
  };

  return (
    <div>
      {/* ---- Label ---- */}
      <label className="block text-sm font-medium text-neutral-700 mb-1.5">
        Tags
      </label>

      {/* ---- Chips + input container ---- */}
      <div
        className={`
          flex flex-wrap items-center gap-2 p-2 rounded-lg border bg-white min-h-[46px]
          transition-colors duration-150
          focus-within:ring-2 focus-within:ring-offset-0
          ${
            inputError || error
              ? "border-error-500 focus-within:border-error-500 focus-within:ring-error-200"
              : "border-neutral-300 focus-within:border-primary-500 focus-within:ring-primary-200"
          }
        `}
      >
        {/* Render chips */}
        {value.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-primary-50 text-primary-700 text-xs font-medium"
          >
            {tag}
            <button
              type="button"
              onClick={() => handleRemove(tag)}
              className="hover:bg-primary-100 rounded-full p-0.5 transition-colors"
              aria-label={`Remove tag ${tag}`}
            >
              <CloseIcon />
            </button>
          </span>
        ))}

        {/* Input */}
        <input
          type="text"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            if (inputError) setInputError("");
          }}
          onKeyDown={handleKeyDown}
          onBlur={handleAdd}
          placeholder={
            value.length === 0 ? "Add tags (press Enter)" : ""
          }
          className="flex-1 min-w-[120px] outline-none text-sm text-neutral-900 placeholder-neutral-400 bg-transparent"
        />
      </div>

      {/* ---- Helper/Error text ---- */}
      {inputError ? (
        <p className="mt-1.5 text-sm text-error-600">{inputError}</p>
      ) : error ? (
        <p className="mt-1.5 text-sm text-error-600">{error}</p>
      ) : (
        <p className="mt-1.5 text-xs text-neutral-500">
          Press Enter or comma to add a tag. Backspace removes the last one.
          {value.length > 0 && ` (${value.length}/${maxTags})`}
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
    width="10"
    height="10"
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