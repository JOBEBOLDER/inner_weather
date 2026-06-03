export function detectLanguage(text: string): "zh" | "en" {
  const chineseChars = (text.match(/[\u4e00-\u9fff]/g) || []).length;
  const ratio = text.length > 0 ? chineseChars / text.length : 0;
  return ratio > 0.3 ? "zh" : "en";
}
