"use client";

import { STYLE_LABELS, STYLE_ORDER, type Style } from "@/types/receipt";

interface StyleSelectorProps {
  selected: Style;
  onSelect: (style: Style) => void;
}

export default function StyleSelector({ selected, onSelect }: StyleSelectorProps) {
  const selectedLabel = STYLE_LABELS[selected];

  return (
    <div className="relative z-10 space-y-3">
      <div className="grid grid-cols-2 gap-3" role="group" aria-label="智伴风格">
        {STYLE_ORDER.map((style) => {
          const { emoji, label } = STYLE_LABELS[style];
          const isSelected = selected === style;

          return (
            <button
              key={style}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onSelect(style)}
              className={`cursor-pointer rounded-xl border-2 px-4 py-4 text-left text-base transition-all active:scale-[0.98] ${
                isSelected
                  ? "border-purple-primary bg-purple-light text-purple-dark shadow-md ring-2 ring-purple-primary/30"
                  : "border-[var(--border)] bg-white text-[var(--text-primary)] hover:border-purple-primary/50 hover:bg-purple-light/30"
              }`}
            >
              <span className="mr-2 text-lg">{emoji}</span>
              {label}
            </button>
          );
        })}
      </div>
      <p className="text-center text-sm text-purple-dark">
        已选：{selectedLabel.emoji} {selectedLabel.label}
      </p>
    </div>
  );
}
