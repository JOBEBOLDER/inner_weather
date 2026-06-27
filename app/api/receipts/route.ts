import { NextResponse } from "next/server";
import {
  getSupabase,
  isSupabaseConfigured,
  receiptToRow,
  rowToReceipt,
} from "@/lib/supabase";
import type { Receipt } from "@/types/receipt";

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ receipts: [] });
  }

  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json({ receipts: [] });
  }

  const { data, error } = await supabase
    .from("receipts")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    console.error("[GET /api/receipts]", error);
    return NextResponse.json({ receipts: [] });
  }

  const receipts = (data ?? []).map(rowToReceipt);
  return NextResponse.json({ receipts });
}

export async function POST(req: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ ok: true, stored: false });
  }

  const receipt = (await req.json()) as Receipt;
  if (!receipt?.id || !receipt.original_input) {
    return NextResponse.json({ error: "Invalid receipt" }, { status: 400 });
  }

  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json({ ok: true, stored: false });
  }

  const { error } = await supabase.from("receipts").upsert(receiptToRow(receipt));

  if (error) {
    console.error("[POST /api/receipts]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, stored: true });
}
