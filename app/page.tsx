"use client";

import { useState } from "react";
import InputPage from "@/components/InputPage";
import ImpactPage from "@/components/ImpactPage";
import LanguageToggle from "@/components/LanguageToggle";
import ReceiptsPage from "@/components/ReceiptsPage";
import { useLocale } from "@/components/LocaleProvider";

type Tab = "input" | "receipts" | "impact";

export default function Home() {
  const [tab, setTab] = useState<Tab>("input");
  const { t } = useLocale();

  return (
    <main className="relative z-0 mx-auto flex min-h-screen max-w-2xl flex-col px-8 pb-36 pt-14">
      <header className="relative z-10 mb-12 text-center">
        <div className="absolute right-0 top-0 z-20">
          <LanguageToggle />
        </div>
        <h1 className="text-5xl font-medium tracking-wide text-purple-primary">
          InnerWeather☁️
        </h1>
        <p className="mt-3 text-lg text-[var(--text-secondary)]">{t.tagline}</p>
      </header>

      <div className="flex-1">
        {tab === "input" && <InputPage />}
        {tab === "receipts" && <ReceiptsPage onGoToInput={() => setTab("input")} />}
        {tab === "impact" && <ImpactPage />}
      </div>

      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-[var(--border)] bg-white/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-2xl">
          {(
            [
              { id: "input", label: t.tabInput },
              { id: "receipts", label: t.tabReceipts },
              { id: "impact", label: t.tabImpact },
            ] as const
          ).map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={`flex-1 py-6 text-base tracking-[0.15em] transition ${
                tab === id
                  ? "font-medium text-purple-primary"
                  : "text-[var(--text-secondary)]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </nav>
    </main>
  );
}
