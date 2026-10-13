// ==========================================
// CheckoutStepper — progress indicator
// steps: 1 (Shipping), 2 (Payment), 3 (Confirm)
// ==========================================
export const CheckoutStepper = ({ currentStep = 1 }) => {
    const steps = [
        { number: 1, label: "Shipping" },
        { number: 2, label: "Payment" },
        { number: 3, label: "Confirm" },
    ];

    return (
        <div className="mb-8">
            <div className="flex items-center justify-center gap-2 sm:gap-4">
                {steps.map((step, index) => {
                    const isActive = step.number === currentStep;
                    const isCompleted = step.number < currentStep;
                    const isLast = index === steps.length - 1;

                    return (
                        <div key={step.number} className="flex items-center flex-1 sm:flex-initial">
                            {/* ============ STEP CIRCLE + LABEL ============ */}
                            <div className="flex flex-col items-center">
                                <div
                                    className={`
                    w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center
                    text-sm font-semibold transition-colors
                    ${isCompleted
                                            ? "bg-primary-600 text-white"
                                            : isActive
                                                ? "bg-primary-600 text-white ring-4 ring-primary-100"
                                                : "bg-neutral-100 text-neutral-500"
                                        }
                  `}
                                >
                                    {isCompleted ? <CheckIcon /> : step.number}
                                </div>
                                <span
                                    className={`
                    mt-2 text-xs sm:text-sm font-medium
                    ${isActive || isCompleted
                                            ? "text-primary-600"
                                            : "text-neutral-500"
                                        }
                  `}
                                >
                                    {step.label}
                                </span>
                            </div>

                            {/* ============ CONNECTOR LINE ============ */}
                            {!isLast && (
                                <div
                                    className={`
                    flex-1 h-0.5 mx-2 sm:mx-4
                    ${isCompleted ? "bg-primary-600" : "bg-neutral-200"}
                  `}
                                />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

// ==========================================
// Inline icon
// ==========================================
const CheckIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <polyline points="20 6 9 17 4 12" />
    </svg>
);