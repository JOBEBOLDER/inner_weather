"use client";

import { useState } from "react";
import InputPage from "@/components/InputPage";

type Tab = "input" | "receipts" | "impact";

export default function Home() {
  const [tab, setTab] = useState<Tab>("input");

  return (
    <main className="mx-auto flex min-h-screen max-w-lg flex-col px-4 pb-24 pt-10">
      <header className="mb-8 text-center">
        <h1 className="text-2xl font-medium tracking-wide text-purple-primary">
        Refract
        </h1>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">
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

      <nav className="fixed bottom-0 left-0 right-0 border-t border-[var(--border)] bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-lg">
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
              className={`flex-1 py-4 text-xs tracking-[0.15em] transition ${
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
    <div className="rounded-lg border border-dashed border-[var(--border)] bg-white p-8 text-center">
      <p className="text-sm font-medium tracking-wider text-purple-primary">
        {title}
      </p>
      <p className="mt-2 text-sm text-[var(--text-secondary)]">{hint}</p>
    </div>
  );
}
