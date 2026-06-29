"use client";

import { useLocale } from "@/components/LocaleProvider";
import { getStyleLabel } from "@/lib/i18n";
import { STYLE_LABELS, STYLE_ORDER, type Style } from "@/types/receipt";

interface StyleSelectorProps {
  selected: Style;
  onSelect: (style: Style) => void;
}

export default function StyleSelector({ selected, onSelect }: StyleSelectorProps) {
  const { locale, t } = useLocale();

  return (
    <div className="relative z-10 space-y-4">
      <div className="grid grid-cols-2 gap-4" role="group" aria-label={t.styleAriaLabel}>
        {STYLE_ORDER.map((style) => {
          const { emoji } = STYLE_LABELS[style];
          const label = getStyleLabel(style, locale);
          const isSelected = selected === style;

          return (
            <button
              key={style}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onSelect(style)}
              className={`cursor-pointer rounded-xl border-2 px-5 py-5 text-left text-lg transition-all active:scale-[0.98] ${
                isSelected
                  ? "border-purple-primary bg-purple-light text-purple-dark shadow-md ring-2 ring-purple-primary/30"
                  : "border-[var(--border)] bg-white text-[var(--text-primary)] hover:border-purple-primary/50 hover:bg-purple-light/30"
              }`}
            >
              <span className="mr-2 text-xl">{emoji}</span>
              {label}
            </button>
          );
        })}
      </div>
      <p className="text-center text-base text-purple-dark">
        {t.styleSelected}
        {STYLE_LABELS[selected].emoji} {getStyleLabel(selected, locale)}
      </p>
    </div>
  );
}
