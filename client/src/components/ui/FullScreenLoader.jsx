import { Spinner } from "./Spinner.jsx";

// ==========================================
// FullScreenLoader — centered full-page spinner
// ==========================================
export const FullScreenLoader = ({ message = "Loading..." }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-50 gap-4">
      <Spinner size="lg" className="text-primary-600" />
      <p className="text-sm text-neutral-500 animate-fade-in">{message}</p>
    </div>
  );
};