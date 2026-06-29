"use client";

import { useState } from "react";
import { useLocale } from "@/components/LocaleProvider";
import { useReceipts } from "@/components/ReceiptsProvider";
import ReceiptCard from "@/components/Receipt";
import { getStyleLabel } from "@/lib/i18n";
import {
  estimateAnxietyHours,
  filterThisWeek,
} from "@/lib/impact-stats";
import { STYLE_LABELS, type Receipt, type Style } from "@/types/receipt";

type FilterStyle = "all" | Style;

interface ReceiptsPageProps {
  onGoToInput: () => void;
}

export default function ReceiptsPage({ onGoToInput }: ReceiptsPageProps) {
  const { locale, t } = useLocale();
  const { receipts, loading } = useReceipts();
  const [filter, setFilter] = useState<FilterStyle>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null);

  const weekReceipts = filterThisWeek(receipts);
  const filtered =
    filter === "all" ? receipts : receipts.filter((r) => r.style === filter);

  if (selectedReceipt) {
    return (
      <ReceiptCard
        receipt={selectedReceipt}
        onReset={() => setSelectedReceipt(null)}
      />
    );
  }

  if (loading) {
    return (
      <p className="py-16 text-center text-base text-[var(--text-secondary)]">
        {t.receiptsLoading}
      </p>
    );
  }

  if (receipts.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-[var(--border)] bg-white px-10 py-16 text-center">
        <p className="text-5xl">☁️</p>
        <p className="mt-5 text-xl font-medium text-purple-primary">
          {t.receiptsEmptyTitle}
        </p>
        <p className="mt-3 text-lg text-[var(--text-secondary)]">
          {t.receiptsEmptyHint}
        </p>
        <button
          type="button"
          onClick={onGoToInput}
          className="mt-8 rounded-xl bg-purple-primary px-8 py-4 text-lg font-medium text-white transition hover:bg-purple-dark"
        >
          {t.receiptsEmptyCta}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-[var(--border)] bg-white px-6 py-5">
        <div className="flex flex-wrap gap-x-8 gap-y-2 text-base">
          <span>
            <span className="text-[var(--text-secondary)]">{t.receiptsWeekCount}</span>{" "}
            <span className="font-medium text-purple-primary">{weekReceipts.length}</span>
          </span>
          <span>
            <span className="text-[var(--text-secondary)]">{t.receiptsWeekHours}</span>{" "}
            <span className="font-medium text-purple-primary">
              {estimateAnxietyHours(weekReceipts)}h
            </span>
          </span>
        </div>
      </div>

      <div>
        <p className="mb-3 text-base text-[var(--text-secondary)]">{t.receiptsFilter}</p>
        <div className="flex flex-wrap gap-2">
          <FilterChip
            active={filter === "all"}
            onClick={() => setFilter("all")}
            label={t.receiptsFilterAll}
          />
          {FILTER_STYLES.map((style) => (
            <FilterChip
              key={style}
              active={filter === style}
              onClick={() => setFilter(style)}
              label={getStyleLabel(style, locale)}
            />
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((receipt) => (
          <ReceiptListItem
            key={receipt.id}
            receipt={receipt}
            locale={locale}
            expanded={expandedId === receipt.id}
            onToggle={() =>
              setExpandedId((id) => (id === receipt.id ? null : receipt.id))
            }
            onOpen={() => setSelectedReceipt(receipt)}
          />
        ))}
      </div>
    </div>
  );
}

const FILTER_STYLES: Style[] = [
  "cbt",
  "mindful",
  "socratic",
  "savage",
  "buddha",
  "mentor",
  "neutral",
];

function FilterChip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-4 py-2 text-base transition ${
        active
          ? "border-purple-primary bg-purple-light text-purple-dark"
          : "border-[var(--border)] bg-white text-[var(--text-secondary)] hover:border-purple-primary/40"
      }`}
    >
      {label}
    </button>
  );
}

function ReceiptListItem({
  receipt,
  locale,
  expanded,
  onToggle,
  onOpen,
}: {
  receipt: Receipt;
  locale: "zh" | "en";
  expanded: boolean;
  onToggle: () => void;
  onOpen: () => void;
}) {
  const { t } = useLocale();
  const styleInfo = STYLE_LABELS[receipt.style];
  const styleLabel = getStyleLabel(receipt.style, locale);
  const dateStr = new Date(receipt.created_at).toLocaleDateString(
    locale === "en" ? "en-US" : "zh-CN"
  );
  const preview = receipt.reframe.split("\n")[0];

  return (
    <div className="rounded-xl border border-[var(--border)] bg-white p-5 transition hover:border-purple-primary/30">
      <button type="button" onClick={onToggle} className="w-full text-left">
        <p className="line-clamp-2 text-lg leading-relaxed">
          「{receipt.original_input}」
        </p>
        <p className="mt-3 text-base text-[var(--text-secondary)]">
          {styleInfo.emoji} {styleLabel} · {dateStr}
        </p>
        <p
          className={`mt-3 text-base leading-relaxed text-[var(--text-primary)] ${
            expanded ? "" : "line-clamp-1"
          }`}
        >
          {preview}
        </p>
        <p className="mt-2 text-right text-sm text-purple-primary">
          {expanded ? "↓" : "↑"}
        </p>
      </button>
      {expanded && (
        <button
          type="button"
          onClick={onOpen}
          className="mt-4 w-full rounded-lg border border-[var(--border)] py-3 text-base text-purple-primary transition hover:bg-purple-light/50"
        >
          {t.receiptsViewFull}
        </button>
      )}
    </div>
  );
}
