// ==========================================
// Order status update email (placeholder — full in Phase 21.7)
// ==========================================
export const sendOrderStatusUpdateEmail = async (order, newStatus) => {
  const shortId = order._id.toString().slice(-8);
  const subject = `Order #${shortId} — Status Update`;

  const text = `Hi ${order.shippingAddress.fullName},

Your order #${shortId} status has been updated to: ${newStatus}.

Thanks for shopping with ClipKart!`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
      <h2>Order Status Update</h2>
      <p>Hi ${order.shippingAddress.fullName},</p>
      <p>Your order <strong>#${shortId}</strong> status has been updated to:</p>
      <p style="font-size: 18px; font-weight: bold; color: #4f46e5;">${newStatus.toUpperCase()}</p>
      <hr />
      <p style="color: #666; font-size: 12px;">Thanks for shopping with ClipKart!</p>
    </div>
  `;

  return sendEmail({
    to: order.shippingAddress.email,
    subject,
    text,
    html,
  });
};