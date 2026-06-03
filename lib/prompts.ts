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
