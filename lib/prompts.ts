import fs from "fs/promises";
import path from "path";

export async function loadPrompt(
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

/** Deep mode prompt; falls back to quick prompt if style-specific deep file is missing. */
export async function loadDeepPrompt(style: string, lang: string): Promise<string> {
  const deepPath = path.join(
    process.cwd(),
    "prompts",
    lang,
    "deep_mode",
    `${style}_deep_${lang}_v1.txt`
  );

  try {
    await fs.access(deepPath);
    return fs.readFile(deepPath, "utf-8");
  } catch {
    const quick = await loadPrompt(style, lang, "quick");
    return `现在是深度模式——你要陪用户走3轮对话，先听再回应，对话阶段不给结论。\n\n${quick}`;
  }
}

export async function loadReceiptGeneratorPrompt(
  style: string,
  conversationText: string
): Promise<string> {
  const filePath = path.join(
    process.cwd(),
    "prompts",
    "zh",
    "deep_mode",
    "receipt_generator_v1.txt"
  );
  const template = await fs.readFile(filePath, "utf-8");
  return template
    .replace("{STYLE}", style)
    .replace("{CONVERSATION}", conversationText);
}
