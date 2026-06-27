import type { Locale } from "@/lib/language";

const ROUND_GOALS: Record<Locale, Record<number, string>> = {
  zh: {
    1: "第1轮目标：接住用户的情绪，问一个开放性问题。只理解，不分析，不给建议。",
    2: "第2轮目标：基于用户上一轮的回答，往深处挖一层。触碰想法背后的假设。不给结论。",
    3: "第3轮目标：帮用户看到一个新的可能性。问一个让用户自己总结的问题。不替用户总结。",
  },
  en: {
    1: "Round 1 goal: Hold space for the user's feelings. Ask one open question. Understand only—no analysis or advice.",
    2: "Round 2 goal: Based on their last reply, dig one layer deeper. Touch the assumption behind the thought. No conclusions.",
    3: "Round 3 goal: Help them glimpse a new possibility. Ask a question that lets them summarize for themselves. Don't summarize for them.",
  },
};

const ROUND_STATUS: Record<Locale, (round: number) => string> = {
  zh: (round) => `当前轮次：第${round}轮 / 共3轮`,
  en: (round) => `Current round: ${round} of 3`,
};

const REPLY_LIMIT: Record<Locale, string> = {
  zh: "请只回复这一轮的内容，控制在3句话以内。",
  en: "Reply only for this round. Keep it within 3 sentences.",
};

export function buildDeepSystemPrompt(
  basePrompt: string,
  round: number,
  lang: Locale
): string {
  return `${basePrompt}

【当前状态】
${ROUND_STATUS[lang](round)}
${ROUND_GOALS[lang][round]}
${REPLY_LIMIT[lang]}`;
}
