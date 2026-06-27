"use client";

import { useState } from "react";
import StyleSelector from "@/components/StyleSelector";
import ReceiptCard from "@/components/Receipt";
import DeepModeChat from "@/components/DeepModeChat";
import { useLocale } from "@/components/LocaleProvider";
import { useReceipts } from "@/components/ReceiptsProvider";
import type { Mode, Receipt, Style } from "@/types/receipt";

export default function InputPage() {
  const { locale, t } = useLocale();
  const { addReceipt } = useReceipts();
  const [mode, setMode] = useState<Mode>("quick");
  const [thought, setThought] = useState("");
  const [style, setStyle] = useState<Style>("cbt");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [deepStarted, setDeepStarted] = useState(false);

  async function handleCheckout() {
    if (!thought.trim()) {
      setError(t.errorThoughtRequired);
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
        body: JSON.stringify({
          thought: thought.trim(),
          style,
          locale,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? t.errorCheckoutFailed);
      }

      setReceipt(data.receipt);
      await addReceipt(data.receipt);
    } catch (err) {
      setError(err instanceof Error ? err.message : t.errorCheckoutFailed);
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
          {t.modeQuick}
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
          {t.modeDeep}
        </button>
      </div>

      {mode === "deep" && (
        <p className="text-center text-sm italic text-gray-400">{t.deepSubtitle}</p>
      )}

      <div>
        <label className="mb-3 block text-base font-medium">{t.thoughtLabel}</label>
        <textarea
          value={thought}
          onChange={(e) => setThought(e.target.value)}
          placeholder={t.thoughtPlaceholder}
          rows={5}
          className="w-full resize-none rounded-xl border border-[var(--border)] bg-white px-5 py-4 text-base leading-relaxed outline-none transition focus:border-purple-primary focus:ring-2 focus:ring-purple-light"
        />
      </div>

      {mode === "quick" && (
        <div className="relative z-10">
          <p className="mb-3 text-base font-medium">{t.styleHeading}</p>
          <StyleSelector
            selected={style}
            onSelect={(next) => {
              setStyle(next);
              setError(null);
            }}
          />
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
          ? t.loadingCheckout
          : mode === "deep"
            ? t.ctaDeepStart
            : t.ctaCheckout}
      </button>
    </div>
  );
}
