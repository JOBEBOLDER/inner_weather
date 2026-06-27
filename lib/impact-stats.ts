import type { Receipt } from "@/types/receipt";

const HOURS_PER_QUICK = 2;
const HOURS_PER_DEEP = 4;

export function estimateAnxietyHours(receipts: Receipt[]): number {
  return receipts.reduce(
    (sum, r) => sum + (r.mode === "deep" ? HOURS_PER_DEEP : HOURS_PER_QUICK),
    0
  );
}

export function getWeekStart(date = new Date()): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? 6 : day - 1;
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - diff);
  return d;
}

export function filterThisWeek(receipts: Receipt[], now = new Date()): Receipt[] {
  const weekStart = getWeekStart(now).getTime();
  return receipts.filter((r) => new Date(r.created_at).getTime() >= weekStart);
}

export function getBiasRanking(
  receipts: Receipt[]
): { bias: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const r of receipts) {
    const bias = r.awareness.bias.trim();
    if (!bias) continue;
    counts.set(bias, (counts.get(bias) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([bias, count]) => ({ bias, count }))
    .sort((a, b) => b.count - a.count);
}

export function getMonthlySummary(receipts: Receipt[]) {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthly = receipts.filter(
    (r) => new Date(r.created_at) >= monthStart
  );
  return {
    count: monthly.length,
    hours: estimateAnxietyHours(monthly),
    monthLabel: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`,
  };
}
