import { NextResponse } from "next/server";
import { getOrder, updateOrder, getSettings } from "../../../lib/db.js";
import { createStripeCheckoutSession } from "../../../lib/payments/stripe.js";
import { buildLiqpayCheckout } from "../../../lib/payments/liqpay.js";
import { sendOrderNotification } from "../../../lib/mailer.js";

export async function POST(req) {
  const { orderId, provider } = await req.json().catch(() => ({}));
  const order = getOrder(orderId);
  if (!order) return NextResponse.json({ error: "Замовлення не знайдено" }, { status: 404 });

  const origin = req.nextUrl.origin;
  const settings = getSettings();

  if (provider === "stripe") {
    if (!settings.payments?.stripe?.enabled) {
      return NextResponse.json({ error: "Оплата картою Stripe ще не налаштована" }, { status: 400 });
    }
    try {
      const session = await createStripeCheckoutSession(order, {
        successUrl: `${origin}/order/${order.id}?paid=1`,
        cancelUrl: `${origin}/order/${order.id}?cancelled=1`,
      });
      updateOrder(order.id, { paymentProvider: "stripe", paymentRef: session.id });
      return NextResponse.json({ redirectUrl: session.url });
    } catch (err) {
      return NextResponse.json({ error: "Не вдалося створити оплату Stripe" }, { status: 500 });
    }
  }

  if (provider === "liqpay") {
    if (!settings.payments?.liqpay?.enabled) {
      return NextResponse.json({ error: "Оплата LiqPay ще не налаштована" }, { status: 400 });
    }
    try {
      const { data, signature, checkoutUrl } = buildLiqpayCheckout(order, {
        resultUrl: `${origin}/order/${order.id}?paid=1`,
        serverUrl: `${origin}/api/webhooks/liqpay`,
      });
      updateOrder(order.id, { paymentProvider: "liqpay" });
      return NextResponse.json({ formUrl: checkoutUrl, data, signature });
    } catch (err) {
      return NextResponse.json({ error: "Не вдалося створити оплату LiqPay" }, { status: 500 });
    }
  }

  if (provider === "cod") {
    if (!settings.payments?.codEnabled) {
      return NextResponse.json({ error: "Оплата при отриманні недоступна" }, { status: 400 });
    }
    const updated = updateOrder(order.id, { status: "confirmed", paymentProvider: "cod" });
    sendOrderNotification(updated, { heading: "Замовлення підтверджено (оплата при отриманні)" }).catch(() => {});
    return NextResponse.json({ redirectUrl: `/order/${order.id}` });
  }

  return NextResponse.json({ error: "Невідомий спосіб оплати" }, { status: 400 });
}
