import { NextResponse } from "next/server";
import { getOrder, updateOrder } from "../../../../lib/db.js";
import { verifyLiqpayCallback } from "../../../../lib/payments/liqpay.js";
import { sendOrderNotification } from "../../../../lib/mailer.js";

export async function POST(req) {
  const form = await req.formData().catch(() => null);
  const data = form?.get("data");
  const signature = form?.get("signature");
  if (!data || !signature) {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 });
  }

  let decoded;
  try {
    decoded = verifyLiqpayCallback(data, signature);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
  if (!decoded) return NextResponse.json({ error: "bad_signature" }, { status: 400 });

  const orderId = decoded.order_id;
  const status = decoded.status;
  const order = getOrder(orderId);

  if (order && ["success", "sandbox"].includes(status) && order.status !== "paid") {
    const updated = updateOrder(orderId, { status: "paid", paymentRef: String(decoded.payment_id || "") });
    sendOrderNotification(updated, { heading: "Замовлення оплачено (LiqPay)" }).catch(() => {});
  }

  return NextResponse.json({ ok: true });
}
