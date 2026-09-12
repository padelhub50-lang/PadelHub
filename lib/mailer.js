import nodemailer from "nodemailer";
import { getSettings } from "./db.js";

const FALLBACK_TO = "Padelhub50@gmail.com";

function money(n) {
  return `${Number(n || 0).toLocaleString("uk-UA")} грн`;
}

function buildTransport(emailSettings) {
  if (!emailSettings.host || !emailSettings.user || !emailSettings.pass) return null;
  return nodemailer.createTransport({
    host: emailSettings.host,
    port: Number(emailSettings.port) || 465,
    secure: emailSettings.secure !== false,
    auth: { user: emailSettings.user, pass: emailSettings.pass },
  });
}

function orderHtml(order, heading) {
  const rows = order.items
    .map(
      (it) =>
        `<tr>
          <td style="padding:8px;border-bottom:1px solid #eee;">${escapeHtml(it.name)}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;text-align:center;">${it.qty}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;text-align:right;">${money(it.price * it.qty)}</td>
        </tr>`
    )
    .join("");

  const c = order.customer || {};
  const d = order.delivery || {};

  return `
  <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#221b15;">
    <h2 style="color:#FF5A1F;">${heading}</h2>
    <p style="font-size:14px;color:#555;">Замовлення <b>#${order.id}</b> · ${new Date(order.createdAt).toLocaleString("uk-UA")}</p>

    <h3>Товари</h3>
    <table style="width:100%;border-collapse:collapse;font-size:14px;">
      <thead>
        <tr>
          <th style="text-align:left;padding:8px;border-bottom:2px solid #FF5A1F;">Товар</th>
          <th style="text-align:center;padding:8px;border-bottom:2px solid #FF5A1F;">К-сть</th>
          <th style="text-align:right;padding:8px;border-bottom:2px solid #FF5A1F;">Сума</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
    <p style="text-align:right;font-size:16px;font-weight:bold;margin-top:8px;">Разом: ${money(order.total)}</p>

    <h3>Клієнт</h3>
    <p style="font-size:14px;line-height:1.6;">
      Ім'я: ${escapeHtml(c.name || "-")}<br/>
      Телефон: ${escapeHtml(c.phone || "-")}<br/>
      Email: ${escapeHtml(c.email || "-")}
    </p>

    <h3>Доставка</h3>
    <p style="font-size:14px;line-height:1.6;">
      Спосіб: ${escapeHtml(d.method || "-")}<br/>
      Місто: ${escapeHtml(d.city || "-")}<br/>
      Відділення/адреса: ${escapeHtml(d.branch || d.address || "-")}
    </p>

    <h3>Оплата</h3>
    <p style="font-size:14px;line-height:1.6;">
      Спосіб оплати: ${escapeHtml(order.paymentProvider || "-")}<br/>
      Статус: <b>${escapeHtml(order.status)}</b>
    </p>

    ${order.notes ? `<h3>Коментар</h3><p style="font-size:14px;">${escapeHtml(order.notes)}</p>` : ""}
  </div>`;
}

function escapeHtml(s) {
  return String(s ?? "").replace(/[&<>"']/g, (m) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[m]);
}

export async function sendOrderNotification(order, { heading } = {}) {
  const settings = getSettings();
  const emailSettings = settings.email || {};
  if (!emailSettings.enabled) {
    return { sent: false, reason: "email_disabled" };
  }
  const transport = buildTransport(emailSettings);
  if (!transport) {
    return { sent: false, reason: "smtp_not_configured" };
  }
  const to = emailSettings.toEmail || FALLBACK_TO;
  const from = `"${emailSettings.fromName || "Padel Hub"}" <${emailSettings.user}>`;
  const subject = `${heading || "Нове замовлення"} — #${order.id}`;
  try {
    await transport.sendMail({
      from,
      to,
      subject,
      html: orderHtml(order, heading || "Нове замовлення"),
    });
    return { sent: true };
  } catch (err) {
    console.error("Failed to send order email:", err.message);
    return { sent: false, reason: "send_failed", error: err.message };
  }
}

export async function sendTestEmail() {
  const settings = getSettings();
  const emailSettings = settings.email || {};
  const transport = buildTransport(emailSettings);
  if (!transport) return { sent: false, reason: "smtp_not_configured" };
  const to = emailSettings.toEmail || FALLBACK_TO;
  const from = `"${emailSettings.fromName || "Padel Hub"}" <${emailSettings.user}>`;
  try {
    await transport.sendMail({
      from,
      to,
      subject: "Padel Hub — тестовий лист",
      html: `<p>Це тестовий лист із налаштувань пошти Padel Hub. Якщо ви його бачите — все працює правильно.</p>`,
    });
    return { sent: true };
  } catch (err) {
    return { sent: false, reason: "send_failed", error: err.message };
  }
}
