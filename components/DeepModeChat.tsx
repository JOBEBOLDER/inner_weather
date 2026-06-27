"use client";

import { useEffect, useRef, useState } from "react";
import ReceiptCard from "@/components/Receipt";
import { useLocale } from "@/components/LocaleProvider";
import { useReceipts } from "@/components/ReceiptsProvider";
import { formatRound } from "@/lib/i18n";
import { DEEP_MODE_STYLE, type ConversationMessage, type Receipt } from "@/types/receipt";

interface DeepModeChatProps {
  initialThought: string;
  onBack: () => void;
}

type ChatMessage = { role: "user" | "assistant"; content: string };

export default function DeepModeChat({
  initialThought,
  onBack,
}: DeepModeChatProps) {
  const { locale, t } = useLocale();
  const { addReceipt } = useReceipts();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [round, setRound] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const hasStarted = useRef(false);

  const apiHistory = (): ConversationMessage[] =>
    messages.map((m) => ({ role: m.role, content: m.content }));

  async function startChat() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/deep/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          style: DEEP_MODE_STYLE,
          round: 1,
          initial_thought: initialThought,
          history: [],
          locale,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? t.deepChatStartFailed);

      setMessages([{ role: "assistant", content: data.reply }]);
      setRound(1);
    } catch (err) {
      setError(err instanceof Error ? err.message : t.deepChatStartFailed);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!hasStarted.current) {
      hasStarted.current = true;
      startChat();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function sendReply() {
    if (!input.trim() || loading || isComplete) return;

    const userMessage = input.trim();
    setInput("");
    const nextMessages: ChatMessage[] = [
      ...messages,
      { role: "user", content: userMessage },
    ];
    setMessages(nextMessages);
    setLoading(true);
    setError(null);

    const nextRound = round + 1;

    try {
      const res = await fetch("/api/deep/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          style: DEEP_MODE_STYLE,
          round: nextRound,
          initial_thought: initialThought,
          history: nextMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          locale,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? t.deepChatSendFailed);

      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
      setRound(nextRound);
      if (data.is_complete) setIsComplete(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : t.deepChatSendFailed);
      setMessages(messages);
      setInput(userMessage);
    } finally {
      setLoading(false);
    }
  }

  async function generateReceipt() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/deep/receipt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          style: DEEP_MODE_STYLE,
          initial_thought: initialThought,
          history: apiHistory(),
          locale,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? t.deepChatReceiptFailed);
      setReceipt(data.receipt);
      await addReceipt(data.receipt);
    } catch (err) {
      setError(err instanceof Error ? err.message : t.deepChatReceiptFailed);
    } finally {
      setLoading(false);
    }
  }

  if (receipt) {
    return (
      <ReceiptCard
        receipt={receipt}
        onReset={() => {
          setReceipt(null);
          onBack();
        }}
      />
    );
  }

  if (round === 0) {
    return (
      <div className="space-y-4 text-center">
        {error ? (
          <>
            <p className="rounded-xl bg-red-50 px-4 py-3 text-base text-red-600">
              {error}
            </p>
            <button
              type="button"
              onClick={startChat}
              disabled={loading}
              className="w-full rounded-xl bg-purple-primary py-4 text-base font-medium text-white transition hover:bg-purple-dark disabled:opacity-60"
            >
              {loading ? t.deepChatConnecting : t.deepChatRetry}
            </button>
            <button
              type="button"
              onClick={onBack}
              className="text-sm text-[var(--text-secondary)] underline"
            >
              {t.deepChatBack}
            </button>
          </>
        ) : (
          <p className="text-sm text-[var(--text-secondary)]">{t.deepChatConnecting}</p>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
        <span>{formatRound(locale, round)}</span>
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[var(--border)]">
          <div
            className="h-full rounded-full bg-purple-primary transition-all"
            style={{ width: `${(round / 3) * 100}%` }}
          />
        </div>
      </div>

      <div className="space-y-3">
        <div className="ml-auto max-w-[85%] rounded-xl bg-purple-light px-4 py-3 text-base text-purple-dark">
          {initialThought}
        </div>

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`max-w-[85%] rounded-xl px-4 py-3 text-base leading-relaxed ${
              msg.role === "user"
                ? "ml-auto bg-purple-primary text-white"
                : "mr-auto border border-[var(--border)] bg-white"
            }`}
          >
            {msg.role === "assistant" && (
              <p className="mb-1 text-xs text-[var(--text-secondary)]">
                {t.deepChatAssistant}
              </p>
            )}
            {msg.content}
          </div>
        ))}

        {loading && (
          <p className="text-sm text-[var(--text-secondary)]">{t.deepChatThinking}</p>
        )}
      </div>

      {error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-base text-red-600">
          {error}
        </p>
      )}

      {isComplete ? (
        <div className="space-y-3 text-center">
          <p className="text-base text-purple-primary">{t.deepChatComplete}</p>
          <button
            type="button"
            onClick={generateReceipt}
            disabled={loading}
            className="w-full rounded-xl bg-purple-primary py-4 text-base font-medium text-white transition hover:bg-purple-dark disabled:opacity-60"
          >
            {loading ? t.deepChatGenerating : t.deepChatGenerateCta}
          </button>
        </div>
      ) : (
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendReply()}
            placeholder={t.deepChatReplyPlaceholder}
            disabled={loading}
            className="flex-1 rounded-xl border border-[var(--border)] bg-white px-4 py-3 text-base outline-none focus:border-purple-primary focus:ring-2 focus:ring-purple-light"
          />
          <button
            type="button"
            onClick={sendReply}
            disabled={loading || !input.trim()}
            className="rounded-xl bg-purple-primary px-5 py-3 text-base text-white transition hover:bg-purple-dark disabled:opacity-60"
          >
            {t.deepChatSend}
          </button>
        </div>
      )}
    </div>
  );
}
