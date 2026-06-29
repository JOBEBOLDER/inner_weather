"use client";

import { useLocale } from "@/components/LocaleProvider";
import { getStyleLabel } from "@/lib/i18n";
import { STYLE_LABELS, type Receipt } from "@/types/receipt";

interface ReceiptProps {
  receipt: Receipt;
  onReset: () => void;
}

export default function ReceiptCard({ receipt, onReset }: ReceiptProps) {
  const { locale, t } = useLocale();
  const styleInfo = STYLE_LABELS[receipt.style];
  const styleLabel = getStyleLabel(receipt.style, locale);

  return (
    <div className="animate-receipt-in mx-auto w-full max-w-2xl">
      <div className="receipt rounded-xl border border-dashed border-[var(--border)] bg-white p-8 font-mono text-lg shadow-sm">
        <div className="mb-6 text-center">
          <p className="text-base tracking-[0.2em] text-[var(--text-secondary)]">
            {t.receiptTitle}
          </p>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            {t.receiptSubtitle}
          </p>
        </div>

        <Section num="01" title={t.sectionInput}>
          <p className="leading-relaxed">「{receipt.original_input}」</p>
          <div className="mt-2 flex gap-2">
            <Tag>
              {styleInfo.emoji} {styleLabel}
            </Tag>
            <Tag>
              {receipt.mode === "quick" ? t.modeQuickTag : t.modeDeepTag}
            </Tag>
          </div>
        </Section>

        <Section num="02" title={t.sectionItems}>
          {receipt.items.map((item, i) => (
            <div key={i} className="flex justify-between gap-2 py-1">
              <span>{item.name}</span>
              <span className="shrink-0 text-[var(--text-secondary)]">
                {item.cost}
              </span>
            </div>
          ))}
        </Section>

        <Section num="03" title={t.sectionAwareness}>
          <Row label={t.awarenessEmotion} value={receipt.awareness.emotion} />
          <Row label={t.awarenessBias} value={receipt.awareness.bias} />
        </Section>

        <Section num="04" title={t.sectionReframe}>
          <p className="whitespace-pre-wrap leading-relaxed">{receipt.reframe}</p>
        </Section>

        <Section num="05" title={t.sectionAction}>
          <ActionBlock icon="⏱" title={t.actionNow} content={receipt.action.now} />
          <ActionBlock
            icon="🔁"
            title={t.actionIfThen}
            content={
              <>
                <p>
                  {t.actionIf} {receipt.action.if_then_trigger}
                </p>
                <p className="mt-2 border-t border-dashed border-[var(--border)] pt-2">
                  {t.actionThen} {receipt.action.if_then_response}
                </p>
              </>
            }
          />
          <p className="mt-4 text-xs leading-relaxed text-[var(--text-secondary)]">
            {t.actionFooter}
          </p>
        </Section>

        {receipt.merit && (
          <div className="mt-4 border-t border-dashed border-[var(--border)] pt-4 text-center">
            <span className="text-purple-primary">🪷 {receipt.merit}</span>
          </div>
        )}

        <div className="mt-5 flex justify-between text-xs text-[var(--text-secondary)]">
          <span>#{receipt.id.slice(0, 6).toUpperCase()}</span>
          <span>
            {new Date(receipt.created_at).toLocaleDateString(
              locale === "en" ? "en-US" : "zh-CN"
            )}
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={onReset}
        className="mt-6 w-full rounded-xl border border-[var(--border)] bg-white py-5 text-lg text-[var(--text-secondary)] transition hover:border-purple-primary/40"
      >
        {t.resetButton}
      </button>
    </div>
  );
}

function Section({
  num,
  title,
  children,
}: {
  num: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-t border-dashed border-[var(--border)] py-5 first:border-t-0 first:pt-0">
      <p className="mb-3 text-sm tracking-wider text-[var(--text-secondary)]">
        {title} <span className="float-right">{num}.</span>
      </p>
      {children}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 py-1">
      <span className="text-[var(--text-secondary)]">{label}</span>
      <span>{value}</span>
    </div>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-purple-light px-3 py-1.5 text-sm text-purple-dark">
      {children}
    </span>
  );
}

function ActionBlock({
  icon,
  title,
  content,
}: {
  icon: string;
  title: string;
  content: React.ReactNode;
}) {
  return (
    <div className="mt-3 rounded border border-[var(--border)] p-5 text-base leading-relaxed">
      <p className="mb-1 font-medium">
        {icon} {title}
      </p>
      {content}
    </div>
  );
}
