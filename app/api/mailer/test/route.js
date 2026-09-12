import { NextResponse } from "next/server";
import { isAdminAuthed } from "../../../../lib/auth.js";
import { sendTestEmail } from "../../../../lib/mailer.js";

export async function POST() {
  if (!isAdminAuthed()) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const result = await sendTestEmail();
  return NextResponse.json(result);
}
