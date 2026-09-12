import Stripe from "stripe";
import { getSettings } from "../db.js";

export function getStripeClient() {
  const settings = getSettings();
  const cfg = settings.payments?.stripe;
  if (!cfg?.enabled || !cfg?.secretKey) return null;
  return new Stripe(cfg.secretKey, { apiVersion: "2024-06-20" });
}

export async function createStripeCheckoutSession(order, { successUrl, cancelUrl }) {
  const stripe = getStripeClient();
  if (!stripe) throw new Error("stripe_not_configured");

  const line_items = order.items.map((it) => ({
    price_data: {
      currency: "uah",
      product_data: { name: it.name },
      unit_amount: Math.round(it.price * 100),
    },
    quantity: it.qty,
  }));

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items,
    success_url: successUrl,
    cancel_url: cancelUrl,
    customer_email: order.customer?.email || undefined,
    metadata: { orderId: order.id },
  });

  return session;
}

export function verifyStripeWebhook(rawBody, signature) {
  const settings = getSettings();
  const cfg = settings.payments?.stripe;
  if (!cfg?.enabled || !cfg?.secretKey || !cfg?.webhookSecret) {
    throw new Error("stripe_not_configured");
  }
  const stripe = new Stripe(cfg.secretKey, { apiVersion: "2024-06-20" });
  return stripe.webhooks.constructEvent(rawBody, signature, cfg.webhookSecret);
}
