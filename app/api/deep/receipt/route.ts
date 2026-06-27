import { OpenAI } from "openai";
import { resolveLanguage, type Locale } from "@/lib/language";
import { NextResponse } from "next/server";
import { loadReceiptGeneratorPrompt } from "@/lib/prompts";
import { cleanJSON, formatConversation } from "@/lib/utils";
import type { ConversationMessage, Receipt, ReceiptPayload, Style } from "@/types/receipt";

function getClient() {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) throw new Error("DEEPSEEK_API_KEY is not configured");
  return new OpenAI({ apiKey, baseURL: "https://api.deepseek.com" });
}

export async function POST(req: Request) {
  try {
    const { style, initial_thought, history, locale } = (await req.json()) as {
      style?: Style;
      initial_thought?: string;
      history?: ConversationMessage[];
      locale?: Locale;
    };

    if (!style || !initial_thought?.trim()) {
      return NextResponse.json(
        { error: "style and initial_thought are required" },
        { status: 400 }
      );
    }

    const lang = resolveLanguage(locale, initial_thought.trim());
    const conversationText = formatConversation(
      initial_thought.trim(),
      history ?? [],
      lang
    );
    const systemPrompt = await loadReceiptGeneratorPrompt(
      style,
      conversationText,
      lang
    );

    const userMessage =
      lang === "en"
        ? "Generate a reframe receipt based on the conversation above."
        : "请根据以上对话生成转念小票。";

    const client = getClient();
    const response = await client.chat.completions.create({
      model: process.env.DEEPSEEK_MODEL ?? "deepseek-chat",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
      temperature: 0.3,
    });

    const raw = response.choices[0].message.content ?? "";
    const payload = JSON.parse(cleanJSON(raw)) as ReceiptPayload;

    const receipt: Receipt = {
      ...payload,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      mode: "deep",
    };

    return NextResponse.json({ receipt });
  } catch (error) {
    console.error("[/api/deep/receipt]", error);
    const message =
      error instanceof Error ? error.message : "Failed to generate receipt";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
