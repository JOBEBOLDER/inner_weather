import type { Receipt } from "@/types/receipt";

const STORAGE_KEY = "innerweather-receipts";

export function loadReceipts(): Receipt[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Receipt[];
    return Array.isArray(parsed)
      ? parsed.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
      : [];
  } catch {
    return [];
  }
}

export function saveReceipt(receipt: Receipt): void {
  if (typeof window === "undefined") return;
  const existing = loadReceipts();
  const withoutDup = existing.filter((r) => r.id !== receipt.id);
  const next = [receipt, ...withoutDup];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

export function mergeReceipts(local: Receipt[], remote: Receipt[]): Receipt[] {
  const map = new Map<string, Receipt>();
  for (const r of [...remote, ...local]) {
    map.set(r.id, r);
  }
  return Array.from(map.values()).sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}
