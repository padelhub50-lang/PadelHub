import { NextResponse } from "next/server";
import { getSettings, updateSettings } from "../../../lib/db.js";
import { isAdminAuthed } from "../../../lib/auth.js";

function publicView(settings) {
  return {
    site: settings.site,
    payments: {
      stripeEnabled: Boolean(settings.payments?.stripe?.enabled),
      stripePublishableKey: settings.payments?.stripe?.publishableKey || "",
      liqpayEnabled: Boolean(settings.payments?.liqpay?.enabled),
      codEnabled: Boolean(settings.payments?.codEnabled),
    },
    deliveryConfigured: Boolean(settings.delivery?.novaPoshtaApiKey),
  };
}

export async function GET() {
  const settings = getSettings();
  if (isAdminAuthed()) {
    return NextResponse.json({ settings });
  }
  return NextResponse.json({ settings: publicView(settings) });
}

export async function PUT(req) {
  if (!isAdminAuthed()) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const patch = await req.json().catch(() => ({}));
  const settings = updateSettings(patch);
  return NextResponse.json({ settings });
}
