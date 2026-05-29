"use client";

import { useEffect, useRef, useState } from "react";
import { siteConfig } from "@/lib/site";

type Msg = { role: "user" | "assistant"; content: string };

const GREETING: Msg = {
  role: "assistant",
  content:
    "Xin chào! Tôi là trợ lý NAVICO. Bạn cần tư vấn về men vi sinh, dinh dưỡng hay xử lý nước ao nuôi? Hãy nhắn cho tôi nhé.",
};

// Icon SVG inline (không dùng icon font => không bị lỗi ô vuông khi font chưa tải)
function ChatIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 3C6.48 3 2 6.94 2 11.5c0 2.08.93 3.97 2.47 5.41-.1 1.2-.46 2.3-1.06 3.24-.2.31.05.71.42.66 1.6-.23 2.9-.78 3.9-1.45 1.05.38 2.2.59 3.37.59 5.52 0 10-3.94 10-8.5S17.52 3 12 3z" />
    </svg>
  );
}
function CloseIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={className} aria-hidden="true">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}
function SendIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M3.4 20.4 21 12 3.4 3.6 3 10l12 2-12 2z" />
    </svg>
  );
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([GREETING]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    const next = [...messages, { role: "user" as const, content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Bỏ lời chào mở đầu khi gửi cho API
        body: JSON.stringify({ messages: next.filter((m) => m !== GREETING) }),
      });
      const body = await res.json().catch(() => ({}));
      const reply =
        body.reply ||
        `Xin lỗi, có lỗi xảy ra. Vui lòng gọi Hotline ${siteConfig.hotline}.`;
      setMessages((m) => [...m, { role: "assistant", content: reply }]);
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: `Không kết nối được trợ lý. Vui lòng gọi Hotline ${siteConfig.hotline}.`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Panel chat */}
      {open && (
        <div className="fixed bottom-24 right-4 sm:right-8 z-50 w-[calc(100vw-2rem)] sm:w-96 h-[70vh] max-h-[560px] bg-white rounded-2xl shadow-2xl border border-outline-variant/40 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-primary text-white px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-full bg-secondary flex items-center justify-center">
                <ChatIcon className="size-5 text-white" />
              </div>
              <div>
                <p className="font-bold leading-tight">Trợ lý NAVICO</p>
                <p className="text-xs text-white/60">Tư vấn thủy sản</p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="size-8 flex items-center justify-center rounded-full hover:bg-white/10"
              aria-label="Đóng"
            >
              <CloseIcon className="size-5" />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-surface-container-low">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap ${
                    m.role === "user"
                      ? "bg-secondary text-white rounded-br-sm"
                      : "bg-white text-on-surface border border-outline-variant/40 rounded-bl-sm"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-outline-variant/40 rounded-2xl rounded-bl-sm px-4 py-3">
                  <div className="flex gap-1">
                    <span className="size-2 bg-outline rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="size-2 bg-outline rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="size-2 bg-outline rounded-full animate-bounce" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <form onSubmit={send} className="p-3 border-t border-outline-variant/40 flex items-center gap-2 bg-white">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Nhập câu hỏi của bạn..."
              className="flex-1 px-4 py-2.5 rounded-full border border-outline-variant text-sm focus:outline-none focus:border-secondary"
              aria-label="Nội dung chat"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="size-10 shrink-0 rounded-full bg-secondary text-white flex items-center justify-center hover:brightness-110 disabled:opacity-50"
              aria-label="Gửi"
            >
              <SendIcon className="size-5" />
            </button>
          </form>
        </div>
      )}

      {/* Nút nổi */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-8 right-4 sm:right-8 size-16 bg-secondary text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50"
        aria-label={open ? "Đóng chat" : "Mở chat tư vấn"}
      >
        {open ? <CloseIcon className="size-7" /> : <ChatIcon className="size-8" />}
      </button>
    </>
  );
}
