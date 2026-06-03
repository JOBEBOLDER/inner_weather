export const ROUND_GOALS: Record<number, string> = {
  1: "第1轮目标：接住用户的情绪，问一个开放性问题。只理解，不分析，不给建议。",
  2: "第2轮目标：基于用户上一轮的回答，往深处挖一层。触碰想法背后的假设。不给结论。",
  3: "第3轮目标：帮用户看到一个新的可能性。问一个让用户自己总结的问题。不替用户总结。",
};

export function buildDeepSystemPrompt(basePrompt: string, round: number): string {
  return `${basePrompt}

【当前状态】
当前轮次：第${round}轮 / 共3轮
${ROUND_GOALS[round]}
请只回复这一轮的内容，控制在3句话以内。`;
}
