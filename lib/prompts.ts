import fs from "fs/promises";
import path from "path";
import type { Locale } from "@/lib/language";

const EN_OUTPUT_PREFIX = `[LANGUAGE]
Respond entirely in English. All JSON field values and user-facing text must be in English.

`;

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

export async function loadPrompt(
  style: string,
  lang: Locale,
  mode: "quick" | "deep"
): Promise<string> {
  try {
    return await readPromptFile(style, lang, mode);
  } catch {
    if (lang === "en") {
      const zh = await readPromptFile(style, "zh", mode);
      return `${EN_OUTPUT_PREFIX}${zh}`;
    }
    throw new Error(`Prompt not found for style=${style} lang=${lang} mode=${mode}`);
  }
}

const DEEP_MODE_WRAPPER: Record<Locale, string> = {
  zh: "现在是深度模式——你要陪用户走3轮对话，先听再回应，对话阶段不给结论。",
  en: "This is deep mode—guide the user through 3 rounds of dialogue. Listen first, respond second. Do not give conclusions during the dialogue phase.",
};

/** Deep mode prompt; falls back to quick prompt if style-specific deep file is missing. */
export async function loadDeepPrompt(style: string, lang: Locale): Promise<string> {
  const deepPath = path.join(
    process.cwd(),
    "prompts",
    lang,
    "deep_mode",
    `${style}_deep_${lang}_v1.txt`
  );

  try {
    await fs.access(deepPath);
    const content = await fs.readFile(deepPath, "utf-8");
    if (lang === "en") return `${EN_OUTPUT_PREFIX}${content}`;
    return content;
  } catch {
    const quick = await loadPrompt(style, lang, "quick");
    return `${DEEP_MODE_WRAPPER[lang]}\n\n${quick}`;
  }
}

export async function loadReceiptGeneratorPrompt(
  style: string,
  conversationText: string,
  lang: Locale
): Promise<string> {
  const filePath = path.join(
    process.cwd(),
    "prompts",
    "zh",
    "deep_mode",
    "receipt_generator_v1.txt"
  );
  const template = await fs.readFile(filePath, "utf-8");
  const filled = template
    .replace("{STYLE}", style)
    .replace("{CONVERSATION}", conversationText);

  if (lang === "en") {
    return `${EN_OUTPUT_PREFIX}${filled}`;
  }
  return filled;
}
