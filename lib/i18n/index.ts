import { STYLE_LABELS, type Style } from "@/types/receipt";
import { messages, type Locale, type Messages } from "./messages";

export type { Locale, Messages };
export { messages };

export function getMessages(locale: Locale): Messages {
  return messages[locale];
}

export function getStyleLabel(style: Style, locale: Locale): string {
  const info = STYLE_LABELS[style];
  return locale === "en" ? info.labelEn : info.label;
}

export function formatRound(locale: Locale, round: number): string {
  return getMessages(locale).deepChatRound.replace("{round}", String(round));
}
