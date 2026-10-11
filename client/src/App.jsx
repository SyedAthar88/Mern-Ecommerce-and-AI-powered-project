import { Toaster } from "react-hot-toast";
import AppRoutes from "./routes/AppRoutes.jsx";
import { ErrorBoundary } from "./components/ErrorBoundary.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import { CartDrawer } from "./components/cart/CartDrawer.jsx";
import { Elements } from "@stripe/react-stripe-js";
import { stripePromise } from "./config/stripe.js";
function App() {
  return (
    <>

      <ErrorBoundary>
        <CartProvider>
          {stripePromise ? (
            <Elements stripe={stripePromise}>
              <AppRoutes />
            </Elements>
          ) : (
            <AppRoutes />
          )}
        </CartProvider>
      </ErrorBoundary>



      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#18181b",
            color: "#fafafa",
            fontSize: "14px",
            borderRadius: "8px",
            padding: "12px 16px",
          },
          success: {
            iconTheme: { primary: "#22c55e", secondary: "#fafafa" },
          },
          error: {
            iconTheme: { primary: "#ef4444", secondary: "#fafafa" },
          },
        }}
      />
    </>
  );
}

export default App;