"use client";

import { useLocale } from "@/components/LocaleProvider";
import { useReceipts } from "@/components/ReceiptsProvider";
import {
  estimateAnxietyHours,
  filterThisWeek,
  getBiasRanking,
  getMonthlySummary,
} from "@/lib/impact-stats";

export default function ImpactPage() {
  const { locale, t } = useLocale();
  const { receipts, loading } = useReceipts();

  if (loading) {
    return (
      <p className="py-16 text-center text-base text-[var(--text-secondary)]">
        {t.impactLoading}
      </p>
    );
  }

  if (receipts.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-[var(--border)] bg-white px-10 py-16 text-center">
        <p className="text-5xl">🌤️</p>
        <p className="mt-5 text-xl font-medium text-purple-primary">
          {t.impactEmptyTitle}
        </p>
        <p className="mt-4 space-y-2 text-lg leading-relaxed text-[var(--text-secondary)]">
          <span className="block">{t.impactEmptyLine1}</span>
          <span className="block">{t.impactEmptyLine2}</span>
          <span className="block">{t.impactEmptyLine3}</span>
        </p>
      </div>
    );
  }

  const weekReceipts = filterThisWeek(receipts);
  const weekHours = estimateAnxietyHours(weekReceipts);
  const totalHours = estimateAnxietyHours(receipts);
  const biasRanking = getBiasRanking(receipts).slice(0, 5);
  const monthly = getMonthlySummary(receipts);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <StatCard
          label={t.impactWeekReframes}
          value={String(weekReceipts.length)}
        />
        <StatCard label={t.impactWeekHours} value={`${weekHours}h`} />
      </div>

      <div className="rounded-xl border border-[var(--border)] bg-white p-6">
        <p className="text-base font-medium text-purple-primary">
          {t.impactTotalHours}
        </p>
        <p className="mt-2 text-4xl font-medium">{totalHours}h</p>
        <p className="mt-2 text-sm text-[var(--text-secondary)]">
          {t.impactTotalHoursHint}
        </p>
      </div>

      <div className="rounded-xl border border-[var(--border)] bg-white p-6">
        <p className="mb-4 text-base font-medium text-purple-primary">
          {t.impactBiasRanking}
        </p>
        {biasRanking.length === 0 ? (
          <p className="text-base text-[var(--text-secondary)]">{t.impactNoBias}</p>
        ) : (
          <ul className="space-y-3">
            {biasRanking.map((item, i) => (
              <li
                key={item.bias}
                className="flex items-center justify-between gap-3 text-base"
              >
                <span className="flex items-center gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple-light text-sm text-purple-dark">
                    {i + 1}
                  </span>
                  <span className="line-clamp-1">{item.bias}</span>
                </span>
                <span className="shrink-0 text-[var(--text-secondary)]">
                  {item.count}×
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="rounded-xl border border-[var(--border)] bg-white p-6">
        <p className="text-base font-medium text-purple-primary">
          {t.impactMonthlyReport}
        </p>
        <p className="mt-3 text-base text-[var(--text-secondary)]">
          {locale === "zh"
            ? `${monthly.monthLabel} · ${t.impactMonthlyCount.replace("{count}", String(monthly.count))} · ${t.impactMonthlyHours.replace("{hours}", String(monthly.hours))}`
            : `${monthly.monthLabel} · ${monthly.count} reframes · ${monthly.hours}h saved`}
        </p>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-white p-5">
      <p className="text-sm text-[var(--text-secondary)]">{label}</p>
      <p className="mt-2 text-3xl font-medium text-purple-primary">{value}</p>
    </div>
  );
}
