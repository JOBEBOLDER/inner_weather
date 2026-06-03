export function cleanJSON(raw: string): string {
  let cleaned = raw.replace(/<thinking>[\s\S]*?<\/thinking>/g, "").trim();

  const fenceMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenceMatch) {
    cleaned = fenceMatch[1].trim();
  }

  return cleaned;
}

export function formatConversation(
  initialThought: string,
  history: { role: string; content: string }[]
): string {
  const lines = [`用户初始想法：${initialThought}\n`];

  history.forEach((msg, i) => {
    if (msg.role === "user" && i === 0) return;
    const role = msg.role === "user" ? "用户" : "引导者";
    lines.push(`${role}：${msg.content}`);
  });

  return lines.join("\n");
}
