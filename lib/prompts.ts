import fs from "fs/promises";
import path from "path";
import type { Locale } from "@/lib/language";
import { applyLocaleToPrompt } from "@/lib/prompt-locale";

async function readPromptFile(
  style: string,
  lang: string,
  mode: "quick" | "deep"
): Promise<string> {
  const fileName =
    mode === "quick"
      ? `${style}_${lang}_v1.txt`
      : `${style}_deep_${lang}_v1.txt`;

  const segments =
    mode === "deep"
      ? ["prompts", lang, "deep_mode", fileName]
      : ["prompts", lang, fileName];

  const filePath = path.join(process.cwd(), ...segments);
  return fs.readFile(filePath, "utf-8");
}

async function readPromptWithFallback(
  style: string,
  lang: Locale,
  mode: "quick" | "deep"
): Promise<{ content: string; nativeEnglish: boolean }> {
  try {
    const content = await readPromptFile(style, lang, mode);
    return { content, nativeEnglish: lang === "en" };
  } catch {
    if (lang === "en") {
      const content = await readPromptFile(style, "zh", mode);
      return { content, nativeEnglish: false };
    }
    throw new Error(`Prompt not found for style=${style} lang=${lang} mode=${mode}`);
  }
}

export async function loadPrompt(
  style: string,
  lang: Locale,
  mode: "quick" | "deep"
): Promise<string> {
  const { content, nativeEnglish } = await readPromptWithFallback(style, lang, mode);
  return applyLocaleToPrompt(content, lang, nativeEnglish);
}

const DEEP_MODE_WRAPPER: Record<Locale, string> = {
  zh: "现在是深度模式——你要陪用户走3轮对话，先听再回应，对话阶段不给结论。",
  en: "This is deep mode—guide the user through 3 rounds of dialogue. Listen first, respond second. Do not give conclusions during the dialogue phase.",
};

/** Deep mode prompt; falls back to quick prompt if style-specific deep file is missing. */
export async function loadDeepPrompt(style: string, lang: Locale): Promise<string> {
  try {
    const { content, nativeEnglish } = await readPromptWithFallback(style, lang, "deep");
    return applyLocaleToPrompt(content, lang, nativeEnglish);
  } catch {
    const quick = await loadPrompt(style, lang, "quick");
    const wrapped = `${DEEP_MODE_WRAPPER[lang]}\n\n${quick}`;
    return applyLocaleToPrompt(wrapped, lang, lang === "en");
  }
}

export async function loadReceiptGeneratorPrompt(
  style: string,
  conversationText: string,
  lang: Locale
): Promise<string> {
  const dir = lang === "en" ? "en" : "zh";
  const fileName =
    lang === "en" ? "receipt_generator_en_v1.txt" : "receipt_generator_v1.txt";

  const filePath = path.join(process.cwd(), "prompts", dir, "deep_mode", fileName);
  let template: string;
  let nativeEnglish = lang === "en";

  try {
    template = await fs.readFile(filePath, "utf-8");
  } catch {
    template = await fs.readFile(
      path.join(process.cwd(), "prompts", "zh", "deep_mode", "receipt_generator_v1.txt"),
      "utf-8"
    );
    nativeEnglish = false;
  }

  const filled = template
    .replace("{STYLE}", style)
    .replace("{CONVERSATION}", conversationText);

  return applyLocaleToPrompt(filled, lang, nativeEnglish);
}
