"use client";

import { useState } from "react";
import StyleSelector from "@/components/StyleSelector";
import ReceiptCard from "@/components/Receipt";
import DeepModeChat from "@/components/DeepModeChat";
import type { Mode, Receipt, Style } from "@/types/receipt";

export default function InputPage() {
  const [mode, setMode] = useState<Mode>("quick");
  const [thought, setThought] = useState("");
  const [style, setStyle] = useState<Style>("cbt");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [deepStarted, setDeepStarted] = useState(false);

  async function handleCheckout() {
    if (!thought.trim()) {
      setError("请先输入你现在的想法");
      return;
    }

    if (mode === "deep") {
      setDeepStarted(true);
      setError(null);
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
    setDeepStarted(false);
  }

  function handleModeChange(next: Mode) {
    setMode(next);
    setError(null);
    setDeepStarted(false);
    setReceipt(null);
  }

  if (receipt) {
    return <ReceiptCard receipt={receipt} onReset={handleReset} />;
  }

  if (mode === "deep" && deepStarted && thought.trim()) {
    return (
      <DeepModeChat
        initialThought={thought.trim()}
        onBack={() => setDeepStarted(false)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex rounded-xl border border-[var(--border)] bg-white p-1.5 text-base">
        <button
          type="button"
          onClick={() => handleModeChange("quick")}
          className={`flex-1 rounded-lg py-3 text-center font-medium transition ${
            mode === "quick"
              ? "bg-purple-light text-purple-dark"
              : "text-[var(--text-secondary)] hover:text-purple-primary"
          }`}
        >
          ⚡ 快速模式
        </button>
        <button
          type="button"
          onClick={() => handleModeChange("deep")}
          className={`flex-1 rounded-lg py-3 text-center font-medium transition ${
            mode === "deep"
              ? "bg-purple-light text-purple-dark"
              : "text-[var(--text-secondary)] hover:text-purple-primary"
          }`}
        >
          🌿 深度模式
        </button>
      </div>

      {mode === "deep" && (
        <p className="text-center text-sm italic text-gray-400">
          没有标准答案，只有你自己的答案。
        </p>
      )}

      <div>
        <label className="mb-3 block text-base font-medium">你现在的想法</label>
        <textarea
          value={thought}
          onChange={(e) => setThought(e.target.value)}
          placeholder="e.g. 我总觉得自己不够好..."
          rows={5}
          className="w-full resize-none rounded-xl border border-[var(--border)] bg-white px-5 py-4 text-base leading-relaxed outline-none transition focus:border-purple-primary focus:ring-2 focus:ring-purple-light"
        />
      </div>

      {mode === "quick" && (
        <div>
          <p className="mb-3 text-base font-medium">智伴风格</p>
          <StyleSelector selected={style} onSelect={setStyle} />
        </div>
      )}

      {error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-base text-red-600">
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={handleCheckout}
        disabled={loading}
        className="w-full rounded-xl bg-purple-primary py-4 text-base font-medium tracking-wide text-white transition hover:bg-purple-dark disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading
          ? "正在出单..."
          : mode === "deep"
            ? "开始深度转念 →"
            : "结算 CHECKOUT 🧾"}
      </button>
    </div>
  );
}
