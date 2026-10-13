import { useState } from "react";
import {
    useStripe,
    useElements,
    CardNumberElement,
    CardExpiryElement,
    CardCvcElement,
} from "@stripe/react-stripe-js";
import toast from "react-hot-toast";

import { Button } from "../ui/Button.jsx";

// ==========================================
// Shared styling for Stripe Elements
// ==========================================
const elementStyles = {
    style: {
        base: {
            fontSize: "15px",
            color: "#18181b",
            fontFamily:
                "Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
            "::placeholder": {
                color: "#a1a1aa",
            },
            iconColor: "#6366f1",
        },
        invalid: {
            color: "#dc2626",
            iconColor: "#dc2626",
        },
    },
};

// ==========================================
// Shared container styling
// ==========================================
const elementContainerClass =
    "px-3 py-3 rounded-lg border border-neutral-300 bg-white transition-colors focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-200";

// ==========================================
// PaymentForm — Stripe Elements + confirm
// ==========================================
export const PaymentForm = ({
    clientSecret,
    orderId,
    amount,       // in cents
    currency,
    shippingAddress,
    onBack,
    onSuccess,
}) => {
    const stripe = useStripe();
    const elements = useElements();

    const [cardholderName, setCardholderName] = useState(
        shippingAddress?.fullName || ""
    );
    const [processing, setProcessing] = useState(false);
    const [paymentError, setPaymentError] = useState("");

    const isReady = stripe && elements;
    const displayAmount = ((amount || 0) / 100).toFixed(2);

    // ==========================================
    // Handle payment
    // ==========================================
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) {
            toast.error("Payment system is still loading. Please wait.");
            return;
        }

        if (!cardholderName.trim()) {
            setPaymentError("Please enter the cardholder name");
            return;
        }

        setProcessing(true);
        setPaymentError("");

        try {
            // Get the card number element (required anchor for other elements)
            const cardElement = elements.getElement(CardNumberElement);
            if (!cardElement) {
                throw new Error("Card element not found");
            }

            // Confirm payment with Stripe
            const { error, paymentIntent } = await stripe.confirmCardPayment(
                clientSecret,
                {
                    payment_method: {
                        card: cardElement,
                        billing_details: {
                            name: cardholderName.trim(),
                            email: shippingAddress.email,
                            phone: shippingAddress.phone,
                            address: {
                                line1: shippingAddress.addressLine1,
                                line2: shippingAddress.addressLine2 || undefined,
                                city: shippingAddress.city,
                                state: shippingAddress.state,
                                postal_code: shippingAddress.postalCode,
                                country: shippingAddress.country,
                            },
                        },
                    },
                }
            );

            if (error) {
                // Card error (declined, insufficient funds, etc.)
                setPaymentError(error.message || "Payment failed. Please try again.");
                return;
            }

            if (paymentIntent?.status === "succeeded") {
                // Success! Webhook will handle the rest on the backend.
                toast.success("Payment successful!");
                onSuccess(orderId);
                return;
            }

            // Unexpected status
            setPaymentError("Payment could not be completed. Please try again.");
        } catch (err) {
            console.error("Payment error:", err);
            setPaymentError(
                err.message || "Something went wrong. Please try again."
            );
        } finally {
            setProcessing(false);
        }
    };

    // ==========================================
    // Render
    // ==========================================
    return (
        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            <div className="bg-white rounded-2xl border border-neutral-100 shadow-soft p-6">
                <h2 className="text-lg font-semibold text-neutral-900 mb-5">
                    Payment Information
                </h2>

                <div className="space-y-4">
                    {/* Cardholder name */}
                    <div>
                        <label
                            htmlFor="cardholder-name"
                            className="block text-sm font-medium text-neutral-700 mb-1.5"
                        >
                            Cardholder name *
                        </label>
                        <input
                            id="cardholder-name"
                            type="text"
                            value={cardholderName}
                            onChange={(e) => setCardholderName(e.target.value)}
                            placeholder="Name on card"
                            disabled={processing}
                            className="w-full px-3 py-2.5 rounded-lg border border-neutral-300 bg-white text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-colors disabled:bg-neutral-50 disabled:cursor-not-allowed"
                            autoComplete="cc-name"
                        />
                    </div>

                    {/* Card number */}
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                            Card number *
                        </label>
                        <div className={elementContainerClass}>
                            <CardNumberElement
                                options={elementStyles}
                                disabled={processing}
                            />
                        </div>
                    </div>

                    {/* Expiry + CVC */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                                Expiry *
                            </label>
                            <div className={elementContainerClass}>
                                <CardExpiryElement
                                    options={elementStyles}
                                    disabled={processing}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                                CVC *
                            </label>
                            <div className={elementContainerClass}>
                                <CardCvcElement
                                    options={elementStyles}
                                    disabled={processing}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Error */}
                    {paymentError && (
                        <div className="p-3 bg-error-50 border border-error-100 rounded-lg">
                            <p className="text-sm text-error-700">{paymentError}</p>
                        </div>
                    )}
                </div>

                {/* Security note */}
                <div className="mt-5 pt-5 border-t border-neutral-100 flex items-center gap-2 text-xs text-neutral-500">
                    <LockIcon />
                    <span>
                        Your payment information is encrypted and secure. We never store
                        your card details.
                    </span>
                </div>
            </div>

            {/* ==========================================
          ACTIONS
      ========================================== */}
            <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3">
                <button
                    type="button"
                    onClick={onBack}
                    disabled={processing}
                    className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed self-center sm:self-auto"
                >
                    ← Back to Shipping
                </button>

                <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    loading={processing}
                    disabled={!isReady || processing}
                >
                    {processing ? "Processing..." : `Pay $${displayAmount}`}
                </Button>
            </div>
        </form>
    );
};

// ==========================================
// Inline icon
// ==========================================
const LockIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
);