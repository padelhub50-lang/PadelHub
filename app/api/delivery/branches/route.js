import { NextResponse } from "next/server";
import { searchBranches } from "../../../../lib/novaposhta.js";

export async function GET(req) {
  const cityRef = req.nextUrl.searchParams.get("cityRef") || "";
  const q = req.nextUrl.searchParams.get("q") || "";
  if (!cityRef) return NextResponse.json({ configured: true, results: [] });
  try {
    const result = await searchBranches(cityRef, q);
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ configured: true, results: [], error: err.message }, { status: 200 });
  }
}
