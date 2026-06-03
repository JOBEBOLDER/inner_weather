"use client";

import { STYLE_LABELS, STYLE_ORDER, type Style } from "@/types/receipt";

interface StyleSelectorProps {
  selected: Style;
  onSelect: (style: Style) => void;
}

export default function StyleSelector({ selected, onSelect }: StyleSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {STYLE_ORDER.map((style) => {
        const { emoji, label } = STYLE_LABELS[style];
        const isSelected = selected === style;

        return (
          <button
            key={style}
            type="button"
            onClick={() => onSelect(style)}
            className={`rounded-lg border px-3 py-3 text-left text-sm transition-all ${
              isSelected
                ? "border-purple-primary bg-purple-light text-purple-dark shadow-sm"
                : "border-[var(--border)] bg-white text-[var(--text-secondary)] hover:border-purple-primary/40"
            }`}
          >
            <span className="mr-1.5">{emoji}</span>
            {label}
          </button>
        );
      })}
    </div>
  );
}
