import { NextResponse } from "next/server";
import { updateOrder, getOrder } from "../../../../lib/db.js";
import { verifyStripeWebhook } from "../../../../lib/payments/stripe.js";
import { sendOrderNotification } from "../../../../lib/mailer.js";

export async function POST(req) {
  const signature = req.headers.get("stripe-signature");
  const rawBody = await req.text();

  let event;
  try {
    event = verifyStripeWebhook(rawBody, signature);
  } catch (err) {
    return NextResponse.json({ error: `Webhook error: ${err.message}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const orderId = session.metadata?.orderId;
    if (orderId) {
      const existing = getOrder(orderId);
      if (existing && existing.status !== "paid") {
        const order = updateOrder(orderId, { status: "paid", paymentRef: session.payment_intent || session.id });
        sendOrderNotification(order, { heading: "Замовлення оплачено (Stripe)" }).catch(() => {});
      }
    }
  }

  return NextResponse.json({ received: true });
}
