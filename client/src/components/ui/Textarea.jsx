import { forwardRef } from "react";

// ==========================================
// Textarea — multi-line text input
// ==========================================
export const Textarea = forwardRef(
    (
        {
            label,
            error,
            rows = 4,
            maxLength,
            showCount = false,
            className = "",
            id,
            value = "",
            ...props
        },
        ref
    ) => {
        const textareaId =
            id || label?.toLowerCase().replace(/\s+/g, "-");
        const charCount = value?.length || 0;
        const nearLimit = maxLength && charCount >= maxLength * 0.8;

        return (
            <div className="w-full">
                {/* ---- Label + optional counter ---- */}
                {(label || (showCount && maxLength)) && (
                    <div className="flex items-center justify-between mb-1.5">
                        {label && (
                            <label
                                htmlFor={textareaId}
                                className="block text-sm font-medium text-neutral-700"
                            >
                                {label}
                            </label>
                        )}
                        {showCount && maxLength && (
                            <span
                                className={`text-xs ${nearLimit ? "text-warning-600 font-medium" : "text-neutral-400"
                                    }`}
                            >
                                {charCount}/{maxLength}
                            </span>
                        )}
                    </div>
                )}

                {/* ---- Textarea ---- */}
                <textarea
                    ref={ref}
                    id={textareaId}
                    rows={rows}
                    maxLength={maxLength}
                    value={value}
                    className={`
            w-full rounded-lg border bg-white text-neutral-900 placeholder-neutral-400
            px-3 py-2.5 text-sm
            transition-colors duration-150
            focus:outline-none focus:ring-2 focus:ring-offset-0
            disabled:bg-neutral-50 disabled:cursor-not-allowed disabled:text-neutral-500
            resize-y min-h-[80px]
            ${error
                            ? "border-error-500 focus:border-error-500 focus:ring-error-200"
                            : "border-neutral-300 focus:border-primary-500 focus:ring-primary-200"
                        }
            ${className}
          `}
                    aria-invalid={error ? "true" : "false"}
                    aria-describedby={error ? `${textareaId}-error` : undefined}
                    {...props}
                />

                {/* ---- Error ---- */}
                {error && (
                    <p
                        id={`${textareaId}-error`}
                        className="mt-1.5 text-sm text-error-600 animate-fade-in"
                    >
                        {error}
                    </p>
                )}
            </div>
        );
    }
);

Textarea.displayName = "Textarea";