import { Cart } from "../models/Cart.model.js";
import { Order } from "../models/Order.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { stripe } from "../config/stripe.js";
import { env } from "../config/env.js";

// ==========================================
// POST /api/checkout/create-payment-intent
// ==========================================
export const createPaymentIntent = asyncHandler(async (req, res) => {
  const { shippingAddress } = req.body;

  // ==========================================
  // 1. Fetch user's cart (populated)
  // ==========================================
  const cart = await Cart.findOne({ user: req.user._id }).populate({
    path: "items.product",
    select:
      "name slug price compareAtPrice currency images stock isActive",
  });

  if (!cart || cart.items.length === 0) {
    throw new ApiError(400, "Your cart is empty");
  }

  // ==========================================
  // 2. Validate products + stock
  // ==========================================
  const orderItems = [];

  for (const item of cart.items) {
    const product = item.product;

    // Product might be deleted
    if (!product) {
      throw new ApiError(400, "One of the items in your cart is no longer available");
    }

    // Product might be deactivated
    if (!product.isActive) {
      throw new ApiError(400, `"${product.name}" is no longer available`);
    }

    // Stock check
    if (product.stock < item.quantity) {
      if (product.stock === 0) {
        throw new ApiError(400, `"${product.name}" is out of stock`);
      }
      throw new ApiError(
        400,
        `Only ${product.stock} of "${product.name}" available (you have ${item.quantity} in cart)`
      );
    }

    // Build snapshot for the order
    orderItems.push({
      product: product._id,
      name: product.name,
      price: product.price,
      quantity: item.quantity,
      image: product.images?.[0]?.url || "",
      currency: product.currency || "USD",
    });
  }

  // ==========================================
  // 3. Calculate totals (server-side — NEVER trust client)
  // ==========================================
  const subtotal = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shippingCost = 0; // TODO: Phase 21+ (real shipping)
  const tax = 0;          // TODO: Phase 21+ (real tax)
  const total = subtotal + shippingCost + tax;

  // Round to 2 decimals to avoid floating point issues
  const roundTo2 = (n) => Math.round(n * 100) / 100;
  const finalSubtotal = roundTo2(subtotal);
  const finalTotal = roundTo2(total);

  // ==========================================
  // 4. Create Order in DB (status: pending)
  // ==========================================
  const order = await Order.create({
    user: req.user._id,
    items: orderItems,
    shippingAddress,
    subtotal: finalSubtotal,
    shippingCost,
    tax,
    total: finalTotal,
    currency: "USD",
    paymentStatus: "pending",
    status: "pending",
  });

  // ==========================================
  // 5. Create Stripe PaymentIntent
  // ==========================================
  let paymentIntent;
  try {
    paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(finalTotal * 100), // convert to cents
      currency: env.STRIPE_CURRENCY.toLowerCase(), // "usd" lowercase
      metadata: {
        orderId: order._id.toString(),
        userId: req.user._id.toString(),
      },
      description: `Order #${order._id.toString().slice(-8)}`,
      automatic_payment_methods: {
        enabled: true, // let Stripe decide what payment methods to show
      },
    });
  } catch (err) {
    // If Stripe fails, clean up the order so user can retry
    await Order.findByIdAndDelete(order._id);
    console.error("Stripe error:", err.message);
    throw new ApiError(500, "Failed to initialize payment. Please try again.");
  }

  // ==========================================
  // 6. Save PaymentIntent ID to Order
  // ==========================================
  order.paymentIntentId = paymentIntent.id;
  await order.save();

  // ==========================================
  // 7. Return client secret + order info
  // ==========================================
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        orderId: order._id,
        clientSecret: paymentIntent.client_secret,
        amount: Math.round(finalTotal * 100), // cents, matching PaymentIntent
        currency: "USD",
      },
      "Payment intent created"
    )
  );
});