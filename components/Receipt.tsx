"use client";

import { STYLE_LABELS, type Receipt } from "@/types/receipt";

interface ReceiptProps {
  receipt: Receipt;
  onReset: () => void;
}

export default function ReceiptCard({ receipt, onReset }: ReceiptProps) {
  const styleInfo = STYLE_LABELS[receipt.style];

  return (
    <div className="animate-receipt-in mx-auto w-full max-w-md">
      <div className="receipt rounded-lg border border-dashed border-[var(--border)] bg-white p-6 font-mono text-sm shadow-sm">
        <div className="mb-4 text-center">
          <p className="text-xs tracking-[0.2em] text-[var(--text-secondary)]">
            RECEIPT
          </p>
          <p className="mt-1 text-[11px] text-[var(--text-secondary)]">
            Reframing your thoughts, one receipt at a time.
          </p>
        </div>

        <Section num="01" title="原念头 INPUT">
          <p className="leading-relaxed">「{receipt.original_input}」</p>
          <div className="mt-2 flex gap-2">
            <Tag>{styleInfo.emoji} {styleInfo.label}</Tag>
            <Tag>{receipt.mode === "quick" ? "⚡ 快速" : "🌿 深度"}</Tag>
          </div>
        </Section>

        <Section num="02" title="消费明细 ITEMS">
          {receipt.items.map((item, i) => (
            <div key={i} className="flex justify-between gap-2 py-1">
              <span>{item.name}</span>
              <span className="shrink-0 text-[var(--text-secondary)]">
                {item.cost}
              </span>
            </div>
          ))}
        </Section>

        <Section num="03" title="觉察 BE AWARE OF">
          <Row label="情绪识别" value={receipt.awareness.emotion} />
          <Row label="思维偏差" value={receipt.awareness.bias} />
        </Section>

        <Section num="04" title="新视角 REFRAME">
          <p className="whitespace-pre-wrap leading-relaxed">{receipt.reframe}</p>
        </Section>

        <Section num="05" title="小行动 ACTION">
          <ActionBlock icon="⏱" title="现在可以做" content={receipt.action.now} />
          <ActionBlock
            icon="🔁"
            title="下次这个想法来了"
            content={
              <>
                <p>如果… {receipt.action.if_then_trigger}</p>
                <p className="mt-2 border-t border-dashed border-[var(--border)] pt-2">
                  我就… {receipt.action.if_then_response}
                </p>
              </>
            }
          />
          <p className="mt-3 text-[11px] leading-relaxed text-[var(--text-secondary)]">
            有时候想法暂时改变不了，也没关系。转念是练习，不是考试。
          </p>
        </Section>

        {receipt.merit && (
          <div className="mt-4 border-t border-dashed border-[var(--border)] pt-4 text-center">
            <span className="text-purple-primary">🪷 {receipt.merit}</span>
          </div>
        )}

        <div className="mt-4 flex justify-between text-[10px] text-[var(--text-secondary)]">
          <span>#{receipt.id.slice(0, 6).toUpperCase()}</span>
          <span>
            {new Date(receipt.created_at).toLocaleDateString("zh-CN")}
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={onReset}
        className="mt-4 w-full rounded-lg border border-[var(--border)] bg-white py-3 text-sm text-[var(--text-secondary)] transition hover:border-purple-primary/40"
      >
        ← 再转一个念
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
    <div className="border-t border-dashed border-[var(--border)] py-4 first:border-t-0 first:pt-0">
      <p className="mb-2 text-[10px] tracking-wider text-[var(--text-secondary)]">
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
    <span className="rounded-full bg-purple-light px-2 py-0.5 text-[10px] text-purple-dark">
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
    <div className="mt-2 rounded border border-[var(--border)] p-3 text-[12px] leading-relaxed">
      <p className="mb-1 font-medium">
        {icon} {title}
      </p>
      {content}
    </div>
  );
}
