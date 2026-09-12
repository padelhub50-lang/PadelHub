import { NextResponse } from "next/server";
import { isAdminAuthed, verifyPassword, changePassword } from "../../../../lib/auth.js";

export async function POST(req) {
  if (!isAdminAuthed()) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { currentPassword, newPassword } = await req.json().catch(() => ({}));
  if (!verifyPassword(currentPassword)) {
    return NextResponse.json({ error: "Поточний пароль невірний" }, { status: 400 });
  }
  if (!newPassword || String(newPassword).length < 6) {
    return NextResponse.json({ error: "Новий пароль має містити мінімум 6 символів" }, { status: 400 });
  }
  changePassword(newPassword);
  return NextResponse.json({ ok: true });
}
