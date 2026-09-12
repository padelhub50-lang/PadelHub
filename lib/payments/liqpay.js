import crypto from "node:crypto";
import { getSettings } from "../db.js";

export const LIQPAY_CHECKOUT_URL = "https://www.liqpay.ua/api/3/checkout";

function sign(privateKey, data) {
  return crypto
    .createHash("sha1")
    .update(privateKey + data + privateKey)
    .digest("base64");
}

export function getLiqpayConfig() {
  const settings = getSettings();
  const cfg = settings.payments?.liqpay;
  if (!cfg?.enabled || !cfg?.publicKey || !cfg?.privateKey) return null;
  return cfg;
}

/**
 * Builds the base64 `data` + `signature` pair LiqPay's checkout form expects.
 * The storefront posts these two fields to LIQPAY_CHECKOUT_URL.
 */
export function buildLiqpayCheckout(order, { resultUrl, serverUrl }) {
  const cfg = getLiqpayConfig();
  if (!cfg) throw new Error("liqpay_not_configured");

  const payload = {
    public_key: cfg.publicKey,
    version: "3",
    action: "pay",
    amount: order.total,
    currency: "UAH",
    description: `Padel Hub — замовлення #${order.id}`,
    order_id: order.id,
    result_url: resultUrl,
    server_url: serverUrl,
  };

  const data = Buffer.from(JSON.stringify(payload)).toString("base64");
  const signature = sign(cfg.privateKey, data);
  return { data, signature, checkoutUrl: LIQPAY_CHECKOUT_URL };
}

/** Verifies a LiqPay server_url (or client-side) callback payload. */
export function verifyLiqpayCallback(data, signature) {
  const cfg = getLiqpayConfig();
  if (!cfg) throw new Error("liqpay_not_configured");
  const expected = sign(cfg.privateKey, data);
  if (expected !== signature) return null;
  const decoded = JSON.parse(Buffer.from(data, "base64").toString("utf8"));
  return decoded;
}
