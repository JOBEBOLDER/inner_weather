import { OpenAI } from "openai";
import { NextResponse } from "next/server";
import { buildDeepSystemPrompt } from "@/lib/deep-mode";
import { resolveLanguage, type Locale } from "@/lib/language";
import { loadDeepPrompt } from "@/lib/prompts";
import { localeUserMessage } from "@/lib/prompt-locale";
import type { ConversationMessage, Style } from "@/types/receipt";

function getClient() {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) throw new Error("DEEPSEEK_API_KEY is not configured");
  return new OpenAI({ apiKey, baseURL: "https://api.deepseek.com" });
}

function stripThinking(text: string): string {
  return text.replace(/<thinking>[\s\S]*?<\/thinking>/g, "").trim();
}

export async function POST(req: Request) {
  try {
    const { style, round, history, initial_thought, locale } = (await req.json()) as {
      style?: Style;
      round?: number;
      history?: ConversationMessage[];
      initial_thought?: string;
      locale?: Locale;
    };

    if (!style || !round || round < 1 || round > 3) {
      return NextResponse.json({ error: "Invalid style or round" }, { status: 400 });
    }

    if (!initial_thought?.trim()) {
      return NextResponse.json({ error: "initial_thought is required" }, { status: 400 });
    }

    const lang = resolveLanguage(locale, initial_thought);
    const basePrompt = await loadDeepPrompt(style, lang);
    const systemPrompt = buildDeepSystemPrompt(basePrompt, round, lang);

    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      { role: "system", content: systemPrompt },
      { role: "user", content: localeUserMessage(initial_thought.trim(), lang) },
      ...(history ?? []),
    ];

    const client = getClient();
    const response = await client.chat.completions.create({
      model: process.env.DEEPSEEK_MODEL ?? "deepseek-chat",
      messages,
      temperature: 0.7,
    });

    const reply = stripThinking(response.choices[0].message.content ?? "");

    return NextResponse.json({
      reply,
      is_complete: round === 3,
    });
  } catch (error) {
    console.error("[/api/deep/chat]", error);
    const message =
      error instanceof Error ? error.message : "Failed to generate reply";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
