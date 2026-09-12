import { NextResponse } from "next/server";
import { verifyPassword, createSessionToken, SESSION_COOKIE } from "../../../../lib/auth.js";

export async function POST(req) {
  const { password } = await req.json().catch(() => ({}));
  if (!verifyPassword(password)) {
    return NextResponse.json({ error: "Невірний пароль" }, { status: 401 });
  }
  const token = createSessionToken();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
