import { NextResponse } from "next/server";
import { getProduct, updateProduct, deleteProduct } from "../../../../lib/db.js";
import { isAdminAuthed } from "../../../../lib/auth.js";

export async function GET(_req, { params }) {
  const product = getProduct(params.id);
  if (!product || (!product.active && !isAdminAuthed())) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
  return NextResponse.json({ product });
}

export async function PUT(req, { params }) {
  if (!isAdminAuthed()) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const data = await req.json().catch(() => ({}));
  const product = updateProduct(params.id, data);
  if (!product) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json({ product });
}

export async function DELETE(_req, { params }) {
  if (!isAdminAuthed()) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  deleteProduct(params.id);
  return NextResponse.json({ ok: true });
}
