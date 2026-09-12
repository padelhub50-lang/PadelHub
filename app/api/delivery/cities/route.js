import { NextResponse } from "next/server";
import { searchCities } from "../../../../lib/novaposhta.js";

export async function GET(req) {
  const q = req.nextUrl.searchParams.get("q") || "";
  if (q.trim().length < 2) return NextResponse.json({ configured: true, results: [] });
  try {
    const result = await searchCities(q.trim());
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ configured: true, results: [], error: err.message }, { status: 200 });
  }
}
