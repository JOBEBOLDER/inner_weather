"use client";

import { useState } from "react";
import InputPage from "@/components/InputPage";

type Tab = "input" | "receipts" | "impact";

export default function Home() {
  const [tab, setTab] = useState<Tab>("input");

  return (
    <main className="relative z-0 mx-auto flex min-h-screen max-w-xl flex-col px-6 pb-32 pt-12">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-medium tracking-wide text-purple-primary">
        InnerWeather☁️
        </h1>
        <p className="mt-2 text-base text-[var(--text-secondary)]">
        让想法换个角度发光。
        </p>
      </header>

      <div className="flex-1">
        {tab === "input" && <InputPage />}
        {tab === "receipts" && (
          <Placeholder title="RECEIPTS" hint="Day 4：历史小票将在这里展示" />
        )}
        {tab === "impact" && (
          <Placeholder title="IMPACT" hint="Day 5：数据统计将在这里展示" />
        )}
      </div>

      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-[var(--border)] bg-white/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-xl">
          {(
            [
              { id: "input", label: "INPUT" },
              { id: "receipts", label: "RECEIPTS" },
              { id: "impact", label: "IMPACT" },
            ] as const
          ).map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={`flex-1 py-5 text-sm tracking-[0.15em] transition ${
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

function Placeholder({ title, hint }: { title: string; hint: string }) {
  return (
    <div className="rounded-lg border border-dashed border-[var(--border)] bg-white p-10 text-center">
      <p className="text-base font-medium tracking-wider text-purple-primary">
        {title}
      </p>
      <p className="mt-3 text-base text-[var(--text-secondary)]">{hint}</p>
    </div>
  );
}
