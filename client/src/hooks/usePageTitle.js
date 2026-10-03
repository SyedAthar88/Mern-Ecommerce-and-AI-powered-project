import { useEffect } from "react";

// ==========================================
// App-wide branding
// ==========================================
const APP_NAME = "ClipKart";
const SEPARATOR = " — ";

// ==========================================
// usePageTitle — set document.title for a page
// Usage:
//   usePageTitle("Sign in")
//   → document.title = "Sign in — ClipKart"
// ==========================================
export const usePageTitle = (title) => {
    useEffect(() => {
        const previousTitle = document.title;

        document.title = title ? `${title}${SEPARATOR}${APP_NAME}` : APP_NAME;

        // Restore previous title on unmount (rarely matters, but correct)
        return () => {
            document.title = previousTitle;
        };
    }, [title]);
};