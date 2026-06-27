import { OpenAI } from "openai";
import { NextResponse } from "next/server";
import { detectLanguage, resolveLanguage, type Locale } from "@/lib/language";
import { loadPrompt } from "@/lib/prompts";
import { cleanJSON } from "@/lib/utils";
import type { Receipt, ReceiptPayload, Style } from "@/types/receipt";

export async function POST(req: Request) {
  try {
    const { thought, style, locale } = (await req.json()) as {
      thought?: string;
      style?: Style;
      locale?: Locale;
    };

    if (!thought?.trim()) {
      return NextResponse.json({ error: "thought is required" }, { status: 400 });
    }

    if (!style) {
      return NextResponse.json({ error: "style is required" }, { status: 400 });
    }

    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "DEEPSEEK_API_KEY is not configured" },
        { status: 500 }
      );
    }

    const lang = resolveLanguage(locale, thought);
    const systemPrompt = await loadPrompt(style, lang, "quick");

    const client = new OpenAI({
      apiKey,
      baseURL: "https://api.deepseek.com",
    });

    const response = await client.chat.completions.create({
      model: process.env.DEEPSEEK_MODEL ?? "deepseek-chat",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: thought.trim() },
      ],
      temperature: 0.7,
    });

    const raw = response.choices[0].message.content ?? "";
    const cleaned = cleanJSON(raw);
    const payload = JSON.parse(cleaned) as ReceiptPayload;

    const receipt: Receipt = {
      ...payload,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      mode: "quick",
    };

    return NextResponse.json({ receipt });
  } catch (error) {
    console.error("[/api/quick]", error);
    const message =
      error instanceof Error ? error.message : "Failed to generate receipt";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
