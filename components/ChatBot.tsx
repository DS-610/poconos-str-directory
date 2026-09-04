"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  text: string;
}

const QUICK_ACTIONS = [
  { label: "Find a cleaner", query: "I need a cleaning service" },
  { label: "Find HVAC help", query: "I need HVAC or plumbing" },
  { label: "Pricing info", query: "What are the pricing plans?" },
  { label: "List my business", query: "How do I list my business?" },
];

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: "Hey! I'm the Poconos STR Directory assistant. I can help you find service providers, answer questions about pricing, or navigate the site. What are you looking for?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEnd = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage(text: string) {
    if (!text.trim()) return;
    const userMsg: Message = { role: "user", text: text.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text.trim(), history: messages }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", text: data.reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "Sorry, something went wrong. Try again or browse providers at poconossrt.com/providers." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    sendMessage(input);
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-5 right-5 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-pine-800 text-xl text-white shadow-lg transition hover:bg-pine-900 hover:scale-105 sm:bottom-6 sm:right-6 sm:h-14 sm:w-14 sm:text-2xl"
        aria-label="Open chat assistant"
      >
        {open ? "✕" : "💬"}
      </button>

      {/* Chat window */}
      {open && (
        <div className="fixed inset-x-3 bottom-20 z-50 flex max-h-[70vh] flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-2xl sm:inset-x-auto sm:bottom-24 sm:right-5 sm:w-[380px] sm:max-h-[480px] md:right-6 md:w-[400px]">
          {/* Header */}
          <div className="flex shrink-0 items-center gap-3 border-b border-stone-200 bg-pine-800 px-4 py-3">
            <span className="text-lg sm:text-xl">🏔️</span>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white">Poconos STR Directory</p>
              <p className="text-xs text-pine-200">Ask me anything about the site</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-3 py-3 sm:px-4 sm:py-4">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`mb-2.5 flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3 py-2 text-[13px] leading-5 sm:px-4 sm:py-2.5 sm:text-sm sm:leading-6 ${
                    msg.role === "user"
                      ? "bg-pine-800 text-white"
                      : "bg-stone-100 text-stone-800"
                  }`}
                >
                  <div dangerouslySetInnerHTML={{ __html: formatMessage(msg.text) }} />
                </div>
              </div>
            ))}
            {loading && (
              <div className="mb-2.5 flex justify-start">
                <div className="rounded-2xl bg-stone-100 px-3 py-2 text-[13px] text-stone-500 sm:px-4 sm:text-sm">
                  Thinking...
                </div>
              </div>
            )}
            <div ref={messagesEnd} />
          </div>

          {/* Quick actions */}
          {messages.length <= 1 && (
            <div className="flex shrink-0 flex-wrap gap-1.5 px-3 pb-2 sm:gap-2 sm:px-4">
              {QUICK_ACTIONS.map((action) => (
                <button
                  key={action.label}
                  onClick={() => sendMessage(action.query)}
                  className="rounded-full border border-stone-200 bg-white px-2.5 py-1 text-[11px] font-medium text-stone-700 transition hover:bg-pine-50 hover:text-pine-800 sm:px-3 sm:py-1.5 sm:text-xs"
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <form onSubmit={handleSubmit} className="flex shrink-0 gap-2 border-t border-stone-200 p-2.5 sm:p-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about providers, pricing..."
              className="min-w-0 flex-1 rounded-full border border-stone-300 bg-white px-3 py-2 text-[13px] focus:border-pine-500 focus:outline-none focus:ring-2 focus:ring-pine-200 sm:px-4 sm:text-sm"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-pine-800 text-sm text-white transition hover:bg-pine-900 disabled:opacity-40 sm:h-9 sm:w-9"
            >
              →
            </button>
          </form>
        </div>
      )}
    </>
  );
}

function formatMessage(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\n/g, "<br/>")
    .replace(/• /g, "&bull; ");
}
