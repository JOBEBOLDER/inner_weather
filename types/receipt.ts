export type Style =
  | "savage"
  | "buddha"
  | "mindful"
  | "cbt"
  | "socratic"
  | "mentor";

export type Mode = "quick" | "deep";

export interface ReceiptItem {
  name: string;
  cost: string;
}

export interface Awareness {
  emotion: string;
  bias: string;
}

export interface Action {
  now: string;
  if_then_trigger: string;
  if_then_response: string;
}

export interface ReceiptPayload {
  original_input: string;
  items: ReceiptItem[];
  awareness: Awareness;
  reframe: string;
  action: Action;
  style: Style;
  merit?: string;
}

export interface Receipt extends ReceiptPayload {
  id: string;
  created_at: string;
  mode: Mode;
}

export interface ConversationMessage {
  role: "user" | "assistant";
  content: string;
}

export const STYLE_LABELS: Record<
  Style,
  { emoji: string; label: string; labelEn: string }
> = {
  cbt: { emoji: "🧠", label: "理性分析", labelEn: "CBT Analyst" },
  mindful: { emoji: "🍃", label: "正念接纳", labelEn: "Mindful" },
  socratic: { emoji: "🔍", label: "引导发现", labelEn: "Socratic" },
  savage: { emoji: "🗡️", label: "毒舌闺蜜", labelEn: "Savage BFF" },
  buddha: { emoji: "🪷", label: "赛博佛祖", labelEn: "Cyber Buddha" },
  mentor: { emoji: "💼", label: "职业导师", labelEn: "Mentor" },
};

export const STYLE_ORDER: Style[] = [
  "cbt",
  "mindful",
  "socratic",
  "savage",
  "buddha",
  "mentor",
];
