import { Link, useParams } from "react-router-dom";

import { usePageTitle } from "../hooks/usePageTitle.js";
import { Button } from "../components/ui/Button.jsx";

// ==========================================
// OrderSuccess — confirmation page
// ==========================================
export default function OrderSuccess() {
    usePageTitle("Order Confirmed");

    const { orderId } = useParams();
    const shortId = orderId?.slice(-8).toUpperCase();

    return (
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center animate-fade-in">
                {/* ==========================================
            SUCCESS ICON
        ========================================== */}
                <div className="mx-auto w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center mb-6">
                    <CheckCircleIcon />
                </div>

                {/* ==========================================
            TITLE
        ========================================== */}
                <h1 className="text-3xl font-bold text-neutral-900 mb-3">
                    Thank you for your order!
                </h1>

                <p className="text-neutral-600 mb-6">
                    Your payment was successful. We&apos;ll send a confirmation email
                    shortly.
                </p>

                {/* ==========================================
            ORDER NUMBER
        ========================================== */}
                <div className="inline-block bg-neutral-50 border border-neutral-100 rounded-xl px-6 py-4 mb-8">
                    <p className="text-xs text-neutral-500 uppercase tracking-wider mb-1">
                        Order Number
                    </p>
                    <p className="text-lg font-mono font-semibold text-neutral-900">
                        #{shortId}
                    </p>
                </div>

                {/* ==========================================
            WHAT'S NEXT
        ========================================== */}
                <div className="bg-white rounded-2xl border border-neutral-100 shadow-soft p-6 text-left mb-8">
                    <h2 className="text-sm font-semibold text-neutral-900 uppercase tracking-wider mb-4">
                        What happens next?
                    </h2>
                    <ul className="space-y-3">
                        <li className="flex items-start gap-3">
                            <span className="w-5 h-5 rounded-full bg-primary-100 text-primary-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                                1
                            </span>
                            <div>
                                <p className="text-sm font-medium text-neutral-900">
                                    Order confirmation
                                </p>
                                <p className="text-sm text-neutral-500">
                                    A confirmation email is on its way.
                                </p>
                            </div>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="w-5 h-5 rounded-full bg-primary-100 text-primary-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                                2
                            </span>
                            <div>
                                <p className="text-sm font-medium text-neutral-900">
                                    Processing
                                </p>
                                <p className="text-sm text-neutral-500">
                                    We&apos;re preparing your order for shipment.
                                </p>
                            </div>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="w-5 h-5 rounded-full bg-primary-100 text-primary-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                                3
                            </span>
                            <div>
                                <p className="text-sm font-medium text-neutral-900">
                                    Shipping notification
                                </p>
                                <p className="text-sm text-neutral-500">
                                    We&apos;ll email you when your order ships.
                                </p>
                            </div>
                        </li>
                    </ul>
                </div>

                {/* ==========================================
            ACTIONS
        ========================================== */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link to="/shop">
                        <Button variant="primary" size="lg">
                            Continue Shopping
                        </Button>
                    </Link>
                </div>

                {/* ==========================================
            SUPPORT NOTE
        ========================================== */}
                <p className="mt-8 text-sm text-neutral-500">
                    Questions? Contact us at{" "}
                    <a
                        href="mailto:support@clipkart.com"
                        className="text-primary-600 hover:text-primary-700"
                    >
                        support@clipkart.com
                    </a>
                </p>
            </div>
        </div>
    );
}

// ==========================================
// Inline icon
// ==========================================
const CheckCircleIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="36"
        height="36"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-emerald-600"
    >
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
);