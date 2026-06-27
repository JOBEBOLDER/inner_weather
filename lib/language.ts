export type Locale = "zh" | "en";

export function detectLanguage(text: string): Locale {
  const chineseChars = (text.match(/[\u4e00-\u9fff]/g) || []).length;
  const ratio = text.length > 0 ? chineseChars / text.length : 0;
  return ratio > 0.3 ? "zh" : "en";
}

/** UI locale takes priority; falls back to input-text detection. */
export function resolveLanguage(locale: Locale | undefined, text: string): Locale {
  if (locale === "zh" || locale === "en") return locale;
  return detectLanguage(text);
}
