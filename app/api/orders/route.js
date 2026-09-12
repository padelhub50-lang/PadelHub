import { NextResponse } from "next/server";
import { listOrders, createOrder, getProduct } from "../../../lib/db.js";
import { isAdminAuthed } from "../../../lib/auth.js";
import { sendOrderNotification } from "../../../lib/mailer.js";

export async function GET() {
  if (!isAdminAuthed()) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  return NextResponse.json({ orders: listOrders() });
}

export async function POST(req) {
  const body = await req.json().catch(() => ({}));
  const { customer, delivery, items, notes } = body;

  if (!customer?.name || !customer?.phone) {
    return NextResponse.json({ error: "Вкажіть ім'я та телефон" }, { status: 400 });
  }
  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: "Кошик порожній" }, { status: 400 });
  }

  const resolvedItems = [];
  for (const raw of items) {
    const product = getProduct(raw.productId);
    if (!product || !product.active) {
      return NextResponse.json({ error: `Товар недоступний: ${raw.productId}` }, { status: 400 });
    }
    const qty = Math.max(1, Math.min(99, Number(raw.qty) || 1));
    resolvedItems.push({
      productId: product.id,
      name: product.name,
      price: product.price,
      qty,
    });
  }

  const subtotal = resolvedItems.reduce((sum, it) => sum + it.price * it.qty, 0);

  const order = createOrder({
    status: "pending",
    customer,
    delivery,
    items: resolvedItems,
    subtotal,
    total: subtotal,
    notes,
  });

  sendOrderNotification(order, { heading: "Нове замовлення" }).catch(() => {});

  return NextResponse.json({ order }, { status: 201 });
}
