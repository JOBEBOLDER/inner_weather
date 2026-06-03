"use client";

import { useState } from "react";
import StyleSelector from "@/components/StyleSelector";
import ReceiptCard from "@/components/Receipt";
import type { Receipt, Style } from "@/types/receipt";

export default function InputPage() {
  const [thought, setThought] = useState("");
  const [style, setStyle] = useState<Style>("cbt");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<Receipt | null>(null);

  async function handleCheckout() {
    if (!thought.trim()) {
      setError("请先输入你现在的想法");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/quick", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ thought: thought.trim(), style }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "出单失败，请稍后再试");
      }

      setReceipt(data.receipt);
    } catch (err) {
      setError(err instanceof Error ? err.message : "出单失败，请稍后再试");
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setReceipt(null);
    setThought("");
    setError(null);
  }

  if (receipt) {
    return <ReceiptCard receipt={receipt} onReset={handleReset} />;
  }

  return (
    <div className="space-y-5">
      <div className="flex rounded-lg border border-[var(--border)] bg-white p-1 text-sm">
        <span className="flex-1 rounded-md bg-purple-light py-2 text-center font-medium text-purple-dark">
          ⚡ 快速模式
        </span>
        <span className="flex-1 py-2 text-center text-[var(--text-secondary)]">
          🌿 深度模式
        </span>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">你现在的想法</label>
        <textarea
          value={thought}
          onChange={(e) => setThought(e.target.value)}
          placeholder="e.g. 我总觉得自己不够好..."
          rows={4}
          className="w-full resize-none rounded-lg border border-[var(--border)] bg-white px-4 py-3 text-sm leading-relaxed outline-none transition focus:border-purple-primary focus:ring-2 focus:ring-purple-light"
        />
      </div>

      <div>
        <p className="mb-2 text-sm font-medium">智伴风格</p>
        <StyleSelector selected={style} onSelect={setStyle} />
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={handleCheckout}
        disabled={loading}
        className="w-full rounded-lg bg-purple-primary py-3.5 text-sm font-medium tracking-wide text-white transition hover:bg-purple-dark disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "正在出单..." : "结算 CHECKOUT 🧾"}
      </button>
    </div>
  );
}
