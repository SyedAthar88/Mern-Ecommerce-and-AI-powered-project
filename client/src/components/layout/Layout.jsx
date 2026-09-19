import { Outlet } from "react-router-dom";
import Navbar from "./Navbar.jsx";

// ==========================================
// Main layout — wraps authenticated pages
// ==========================================
export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      {/* ============ HEADER ============ */}
      <Navbar />

      {/* ============ MAIN CONTENT ============ */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* ============ FOOTER ============ */}
      <footer className="border-t border-neutral-200 bg-white mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-neutral-500">
            © {new Date().getFullYear()} MERN Ecommerce. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}