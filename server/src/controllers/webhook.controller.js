import { stripe } from "../config/stripe.js";
import { env } from "../config/env.js";
import { Order } from "../models/Order.model.js";
import { Cart } from "../models/Cart.model.js";
import { Product } from "../models/Product.model.js";
import { sendOrderConfirmationEmail } from "../utils/email.js";

// ==========================================
// POST /api/webhooks/stripe
// Handles all Stripe webhook events
// ==========================================
export const handleStripeWebhook = async (req, res) => {
    const sig = req.headers["stripe-signature"];

    let event;

    // ==========================================
    // 1. Verify signature
    // ==========================================
    try {
        event = stripe.webhooks.constructEvent(
            req.body,                          // raw Buffer (from express.raw)
            sig,
            env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        console.error("❌ Webhook signature verification failed:", err.message);
        // Return 400 — Stripe will retry? No, invalid signature won't be retried
        return res.status(400).json({ error: "Invalid signature" });
    }

    // ==========================================
    // 2. Log event (helpful for debugging)
    // ==========================================
    console.log(`🔔 Stripe webhook received: ${event.type}`);

    // ==========================================
    // 3. Route event by type
    // ==========================================
    try {
        switch (event.type) {
            case "payment_intent.succeeded":
                await handlePaymentSucceeded(event.data.object);
                break;

            case "payment_intent.payment_failed":
                await handlePaymentFailed(event.data.object);
                break;

            // Events we don't handle yet — just acknowledge
            default:
                console.log(`ℹ️  Unhandled event type: ${event.type}`);
        }

        // Always return 200 to prevent Stripe retries for handled events
        return res.status(200).json({ received: true });
    } catch (err) {
        console.error(`❌ Webhook handler error for ${event.type}:`, err.message);

        // Return 500 to trigger Stripe retry
        return res.status(500).json({ error: "Webhook processing failed" });
    }
};

// ==========================================
// Handler: payment succeeded
// ==========================================
const handlePaymentSucceeded = async (paymentIntent) => {
    const { id: paymentIntentId, metadata } = paymentIntent;
    const orderId = metadata?.orderId;

    if (!orderId) {
        console.error("❌ Webhook: no orderId in metadata");
        throw new Error("Missing orderId in metadata");
    }

    // ==========================================
    // 1. Find order
    // ==========================================
    const order = await Order.findById(orderId);
    if (!order) {
        console.error(`❌ Webhook: Order ${orderId} not found`);
        throw new Error("Order not found");
    }

    // ==========================================
    // 2. Idempotency check
    // ==========================================
    // If webhook fires twice (Stripe retries), don't double-process
    if (order.paymentStatus === "paid") {
        console.log(`ℹ️  Order ${orderId} already marked paid. Skipping.`);
        return;
    }

    // Verify the paymentIntentId matches (safety check)
    if (order.paymentIntentId !== paymentIntentId) {
        console.error(
            `❌ Webhook: PaymentIntent mismatch. Order has ${order.paymentIntentId}, webhook has ${paymentIntentId}`
        );
        throw new Error("PaymentIntent mismatch");
    }

    // ==========================================
    // 3. Update order
    // ==========================================
    order.paymentStatus = "paid";
    order.status = "processing";
    order.paidAt = new Date();
    await order.save();

    console.log(`✅ Order ${orderId} marked as paid`);

    // ==========================================
    // 4. Decrement stock for each item
    // ==========================================
    for (const item of order.items) {
        try {
            const result = await Product.updateOne(
                { _id: item.product, stock: { $gte: item.quantity } },
                { $inc: { stock: -item.quantity } }
            );

            if (result.modifiedCount === 0) {
                // Product is out of stock or deleted — log warning but don't fail
                console.warn(
                    `⚠️  Stock decrement failed for product ${item.product} (order ${orderId})`
                );
            }
        } catch (err) {
            // Don't throw — order is already paid. Log for investigation.
            console.error(`❌ Stock decrement error for ${item.product}:`, err.message);
        }
    }

    // ==========================================
    // 5. Clear user's cart
    // ==========================================
    try {
        await Cart.findOneAndUpdate({ user: order.user }, { items: [] });
        console.log(`🛒 Cart cleared for user ${order.user}`);
    } catch (err) {
        console.error("❌ Cart clear error:", err.message);
        // Don't throw — order is paid
    }

    // ==========================================
    // 6. Send confirmation email (best effort)
    // ==========================================
    try {
        await sendOrderConfirmationEmail(order);
        console.log(`📧 Confirmation email sent for order ${orderId}`);
    } catch (err) {
        console.error("❌ Email send error:", err.message);
        // Don't throw — order is paid
    }
};

// ==========================================
// Handler: payment failed
// ==========================================
const handlePaymentFailed = async (paymentIntent) => {
    const { metadata, last_payment_error } = paymentIntent;
    const orderId = metadata?.orderId;

    if (!orderId) {
        console.error("❌ Webhook: no orderId in metadata");
        return;
    }

    const order = await Order.findById(orderId);
    if (!order) {
        console.error(`❌ Webhook: Order ${orderId} not found`);
        return;
    }

    // Only update if not already paid (idempotency)
    if (order.paymentStatus === "paid") {
        console.log(`ℹ️  Order ${orderId} already paid. Ignoring failure event.`);
        return;
    }

    order.paymentStatus = "failed";
    await order.save();

    console.log(
        `❌ Order ${orderId} marked as failed. Reason: ${last_payment_error?.message || "unknown"
        }`
    );
};