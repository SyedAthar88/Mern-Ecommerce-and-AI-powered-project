import { useState, useEffect } from "react";

// ==========================================
// ProductGallery — main image + thumbnails
// ==========================================
export const ProductGallery = ({ images = [], alt = "Product image" }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [failedIndexes, setFailedIndexes] = useState(new Set());

    // Filter out broken images
    const validImages = images.filter((_, i) => !failedIndexes.has(i));

    // Reset active index if it goes out of bounds after removing broken images
    useEffect(() => {
        if (activeIndex >= validImages.length) {
            setActiveIndex(0);
        }
    }, [validImages.length, activeIndex]);

    // ==========================================
    // Empty state
    // ==========================================
    if (validImages.length === 0) {
        return (
            <div className="aspect-square rounded-2xl bg-neutral-100 border border-neutral-200 flex items-center justify-center">
                <ImagePlaceholderIcon />
            </div>
        );
    }

    const activeImage = validImages[activeIndex];

    // ==========================================
    // Keyboard navigation
    // ==========================================
    const handleKeyDown = (e) => {
        if (e.key === "ArrowRight") {
            setActiveIndex((prev) => (prev + 1) % validImages.length);
        } else if (e.key === "ArrowLeft") {
            setActiveIndex(
                (prev) => (prev - 1 + validImages.length) % validImages.length
            );
        }
    };

    // ==========================================
    // Handle image error
    // ==========================================
    const handleImageError = (originalIndex) => {
        setFailedIndexes((prev) => new Set(prev).add(originalIndex));
    };

    return (
        <div className="flex flex-col gap-4">
            {/* ==========================================
          MAIN IMAGE
      ========================================== */}
            <div
                className="relative aspect-square rounded-2xl overflow-hidden bg-neutral-100 border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                tabIndex={0}
                onKeyDown={handleKeyDown}
                aria-label={`Product image ${activeIndex + 1} of ${validImages.length}`}
            >
                <img
                    src={activeImage.url}
                    alt={`${alt} - view ${activeIndex + 1}`}
                    className="w-full h-full object-cover"
                    onError={() => {
                        const originalIndex = images.findIndex(
                            (img) => img.url === activeImage.url
                        );
                        if (originalIndex !== -1) handleImageError(originalIndex);
                    }}
                />

                {/* Navigation arrows (only if > 1 image) */}
                {validImages.length > 1 && (
                    <>
                        <button
                            type="button"
                            onClick={() =>
                                setActiveIndex(
                                    (prev) =>
                                        (prev - 1 + validImages.length) % validImages.length
                                )
                            }
                            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow-md flex items-center justify-center text-neutral-700 transition-all opacity-0 hover:opacity-100 group-hover:opacity-100"
                            aria-label="Previous image"
                            style={{ opacity: 1 }}
                        >
                            <ChevronLeftIcon />
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                setActiveIndex((prev) => (prev + 1) % validImages.length)
                            }
                            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow-md flex items-center justify-center text-neutral-700 transition-all"
                            aria-label="Next image"
                            style={{ opacity: 1 }}
                        >
                            <ChevronRightIcon />
                        </button>

                        {/* Dots indicator */}
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                            {validImages.map((_, i) => (
                                <button
                                    key={i}
                                    type="button"
                                    onClick={() => setActiveIndex(i)}
                                    className={`w-2 h-2 rounded-full transition-colors ${i === activeIndex ? "bg-white" : "bg-white/50"
                                        }`}
                                    aria-label={`Go to image ${i + 1}`}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* ==========================================
          THUMBNAILS (only if > 1 image)
      ========================================== */}
            {validImages.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-1">
                    {validImages.map((img, i) => (
                        <button
                            key={i}
                            type="button"
                            onClick={() => setActiveIndex(i)}
                            className={`
                relative w-20 h-20 rounded-lg overflow-hidden bg-neutral-100 shrink-0
                border-2 transition-all
                ${i === activeIndex
                                    ? "border-primary-600 ring-2 ring-primary-200"
                                    : "border-neutral-200 hover:border-neutral-300"
                                }
              `}
                            aria-label={`View image ${i + 1}`}
                        >
                            <img
                                src={img.url}
                                alt={`${alt} thumbnail ${i + 1}`}
                                className="w-full h-full object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

// ==========================================
// Inline icons
// ==========================================
const ChevronLeftIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="15 18 9 12 15 6" />
    </svg>
);

const ChevronRightIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 18 15 12 9 6" />
    </svg>
);

const ImagePlaceholderIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-300">
        <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
        <circle cx="9" cy="9" r="2" />
        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
    </svg>
);