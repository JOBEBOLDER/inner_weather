import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Receipt } from "@/types/receipt";

export type DbReceipt = {
  id: string;
  created_at: string;
  original_input: string;
  reframe: string;
  awareness: Receipt["awareness"];
  items: Receipt["items"];
  action: Receipt["action"];
  style: Receipt["style"];
  mode: Receipt["mode"];
  merit: string | null;
};

let client: SupabaseClient | null = null;

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

export function getSupabase(): SupabaseClient | null {
  if (!isSupabaseConfigured()) return null;
  if (!client) {
    client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }
  return client;
}

export function receiptToRow(receipt: Receipt): DbReceipt {
  return {
    id: receipt.id,
    created_at: receipt.created_at,
    original_input: receipt.original_input,
    reframe: receipt.reframe,
    awareness: receipt.awareness,
    items: receipt.items,
    action: receipt.action,
    style: receipt.style,
    mode: receipt.mode,
    merit: receipt.merit ?? null,
  };
}

export function rowToReceipt(row: DbReceipt): Receipt {
  return {
    id: row.id,
    created_at: row.created_at,
    original_input: row.original_input,
    reframe: row.reframe,
    awareness: row.awareness,
    items: row.items,
    action: row.action,
    style: row.style,
    mode: row.mode,
    merit: row.merit ?? undefined,
  };
}
