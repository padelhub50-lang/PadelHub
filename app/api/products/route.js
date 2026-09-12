import { NextResponse } from "next/server";
import { listProducts, createProduct } from "../../../lib/db.js";
import { isAdminAuthed } from "../../../lib/auth.js";

export async function GET() {
  const admin = isAdminAuthed();
  const products = listProducts({ activeOnly: !admin });
  return NextResponse.json({ products });
}

export async function POST(req) {
  if (!isAdminAuthed()) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const data = await req.json().catch(() => ({}));
  if (!data.name || !data.category) {
    return NextResponse.json({ error: "Назва та категорія обов'язкові" }, { status: 400 });
  }
  const product = createProduct(data);
  return NextResponse.json({ product }, { status: 201 });
}
