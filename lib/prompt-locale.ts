import type { Locale } from "@/lib/language";

const EN_HEADER = `=== MANDATORY OUTPUT LANGUAGE: ENGLISH ===
The user selected English in the UI. This overrides every other language rule in this prompt.
- ALL JSON string values MUST be in English (items, awareness, reframe, action, merit).
- Chat replies MUST be in English.
- Chinese examples below are for structure/persona reference ONLY — do NOT copy Chinese phrases into output.
- Any Chinese in output = invalid response.

`;

const EN_FOOTER = `
=== FINAL CHECK BEFORE YOU RESPOND ===
1. Output language: ENGLISH ONLY
2. items[].name and items[].cost: English (cost format e.g. "-30 clarity/reality")
3. awareness.emotion and awareness.bias: English
4. reframe and all action fields: English sentences
5. Do not use Chinese characters anywhere in JSON values or chat replies
`;

const EN_USER_SUFFIX =
  "\n\n[Respond in English only. All output must be in English.]";

export function applyLocaleToPrompt(
  prompt: string,
  lang: Locale,
  nativeEnglish = false
): string {
  if (lang === "zh" || nativeEnglish) return prompt;
  return `${EN_HEADER}${prompt}${EN_FOOTER}`;
}

export function localeUserMessage(content: string, lang: Locale): string {
  if (lang === "zh") return content;
  return `${content}${EN_USER_SUFFIX}`;
}

export function localeReceiptUserMessage(lang: Locale): string {
  return lang === "en"
    ? "Generate a reframe receipt based on the conversation above. All JSON values must be in English."
    : "请根据以上对话生成转念小票。";
}
