import { NextResponse } from "next/server";
import { getOrder, updateOrder } from "../../../../lib/db.js";
import { isAdminAuthed } from "../../../../lib/auth.js";

export async function GET(_req, { params }) {
  const order = getOrder(params.id);
  if (!order) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json({ order });
}

export async function PATCH(req, { params }) {
  if (!isAdminAuthed()) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const patch = await req.json().catch(() => ({}));
  const order = updateOrder(params.id, patch);
  if (!order) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json({ order });
}
