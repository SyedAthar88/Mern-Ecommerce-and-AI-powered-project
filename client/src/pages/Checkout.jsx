import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { PaymentForm } from "../components/checkout/PaymentForm.jsx";
import { usePageTitle } from "../hooks/usePageTitle.js";
import { useAuth } from "../hooks/useAuth.js";
import { useCart } from "../hooks/useCart.js";
import { checkoutApi } from "../api/checkout.api.js";
import { CheckoutStepper } from "../components/checkout/CheckoutStepper.jsx";
import { ShippingForm } from "../components/checkout/ShippingForm.jsx";
import { CheckoutSummary } from "../components/checkout/CheckoutSummary.jsx";

export default function Checkout() {
    usePageTitle("Checkout");

    const { user } = useAuth();
    const { cart, loading: cartLoading } = useCart();
    const [step, setStep] = useState(1);
    const [orderData, setOrderData] = useState(null); // { orderId, clientSecret }
    const [creatingIntent, setCreatingIntent] = useState(false);
    const [shippingAddress, setShippingAddress] = useState(null);
    const items = cart?.items || [];

    // ==========================================
    // Guards
    // ==========================================
    // Wait for cart to load
    if (cartLoading) {
        return <CheckoutSkeleton />;
    }

    // Redirect if cart is empty
    if (items.length === 0) {
        toast.error("Your cart is empty");
        return <Navigate to="/cart" replace />;
    }

    // ==========================================
    // Handle shipping form submit
    // ==========================================
    const handleShippingSubmit = async (address) => {
        setShippingAddress(address);   // ← NEW
        setCreatingIntent(true);
        try {
            const res = await checkoutApi.createPaymentIntent({ shippingAddress: address });
            setOrderData({
                orderId: res.data.data.orderId,
                clientSecret: res.data.data.clientSecret,
                amount: res.data.data.amount,
                currency: res.data.data.currency,
            });
            setStep(2);
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to initialize checkout. Please try again.");
        } finally {
            setCreatingIntent(false);
        }
    };
    const navigate = useNavigate();
    const handlePaymentSuccess = (orderId) => {
        navigate(`/order-success/${orderId}`);
    };
    // ==========================================
    // Render
    // ==========================================
    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {/* ============ HEADER ============ */}
            <div className="mb-6 animate-fade-in">
                <h1 className="text-3xl font-bold text-neutral-900">Checkout</h1>
            </div>

            {/* ============ STEPPER ============ */}
            <CheckoutStepper currentStep={step} />

            {/* ============ MAIN GRID ============ */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* ============ LEFT: STEP CONTENT ============ */}
                <div className="lg:col-span-2">
                    {step === 1 && (
                        <ShippingForm
                            initialData={{
                                fullName: user?.name || "",
                                email: user?.email || "",
                                phone: "",
                                addressLine1: "",
                                addressLine2: "",
                                city: "",
                                state: "",
                                postalCode: "",
                                country: "US",
                            }}
                            onSubmit={handleShippingSubmit}
                            loading={creatingIntent}
                        />
                    )}

                    {step === 2 && orderData && (
                        <PaymentForm
                            clientSecret={orderData.clientSecret}
                            orderId={orderData.orderId}
                            amount={orderData.amount}
                            currency={orderData.currency}
                            shippingAddress={shippingAddress}
                            onBack={() => setStep(1)}
                            onSuccess={handlePaymentSuccess}
                        />
                    )}

                    {step === 3 && (
                        <div className="bg-white rounded-2xl border border-neutral-100 shadow-soft p-8 text-center">
                            <p className="text-sm text-neutral-500">
                                Confirmation coming in Sub-step 20.8
                            </p>
                        </div>
                    )}
                </div>

                {/* ============ RIGHT: SUMMARY ============ */}
                <div className="lg:col-span-1">
                    <CheckoutSummary cart={cart} />
                </div>
            </div>
        </div>
    );
}

// ==========================================
// CheckoutSkeleton — loading placeholder
// ==========================================
const CheckoutSkeleton = () => (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-6">
            <div className="h-9 w-40 bg-neutral-200 rounded animate-pulse" />
        </div>
        <div className="h-16 w-full bg-neutral-100 rounded-xl animate-pulse mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
                <div className="h-64 bg-neutral-100 rounded-2xl animate-pulse" />
            </div>
            <div className="lg:col-span-1">
                <div className="h-96 bg-neutral-100 rounded-2xl animate-pulse" />
            </div>
        </div>
    </div>
);