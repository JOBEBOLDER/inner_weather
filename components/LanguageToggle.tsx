"use client";

import { useLocale } from "@/components/LocaleProvider";

export default function LanguageToggle() {
  const { locale, setLocale, t } = useLocale();

  return (
    <div
      role="group"
      aria-label="Language"
      className="relative z-20 inline-flex rounded-full border border-[var(--border)] bg-white/95 p-1 text-base shadow-sm backdrop-blur"
    >
      {(["zh", "en"] as const).map((lang) => (
        <button
          key={lang}
          type="button"
          aria-pressed={locale === lang}
          onClick={() => setLocale(lang)}
          className={`rounded-full px-4 py-2 font-medium transition ${
            locale === lang
              ? "bg-purple-primary text-white shadow-sm"
              : "text-[var(--text-secondary)] hover:text-purple-primary"
          }`}
        >
          {lang === "zh" ? t.langZh : t.langEn}
        </button>
      ))}
    </div>
  );
}
