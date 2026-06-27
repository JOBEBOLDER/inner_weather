export function cleanJSON(raw: string): string {
  let cleaned = raw.replace(/<thinking>[\s\S]*?<\/thinking>/g, "").trim();

  const fenceMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenceMatch) {
    cleaned = fenceMatch[1].trim();
  }

  return cleaned;
}

import type { Locale } from "@/lib/language";

const ROLE_LABELS: Record<Locale, { user: string; assistant: string; initial: string }> = {
  zh: { initial: "用户初始想法", user: "用户", assistant: "引导者" },
  en: { initial: "Initial thought", user: "User", assistant: "Guide" },
};

export function formatConversation(
  initialThought: string,
  history: { role: string; content: string }[],
  lang: Locale = "zh"
): string {
  const labels = ROLE_LABELS[lang];
  const lines = [`${labels.initial}: ${initialThought}\n`];

  history.forEach((msg, i) => {
    if (msg.role === "user" && i === 0) return;
    const role = msg.role === "user" ? labels.user : labels.assistant;
    lines.push(`${role}: ${msg.content}`);
  });

  return lines.join("\n");
}
