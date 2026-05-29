"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/Icon";

type Message = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  handled: boolean;
  createdAt: string;
};

export function MessageList({ initial }: { initial: Message[] }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState("");

  async function toggle(m: Message) {
    setBusyId(m.id);
    await fetch(`/api/contact/${m.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ handled: !m.handled }),
    });
    setBusyId("");
    router.refresh();
  }

  async function remove(m: Message) {
    if (!confirm(`Xóa tin nhắn từ "${m.name}"?`)) return;
    setBusyId(m.id);
    await fetch(`/api/contact/${m.id}`, { method: "DELETE" });
    setBusyId("");
    router.refresh();
  }

  if (initial.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-outline-variant/60 py-16 text-center text-on-surface-variant">
        Chưa có tin nhắn nào.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {initial.map((m) => (
        <div
          key={m.id}
          className={`bg-white rounded-2xl border p-5 ${
            m.handled ? "border-outline-variant/60" : "border-secondary/40"
          }`}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-primary">{m.name}</span>
                {!m.handled && (
                  <span className="text-xs font-semibold bg-secondary/10 text-secondary rounded-full px-2 py-0.5">
                    Mới
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4 text-sm text-on-surface-variant mt-1 flex-wrap">
                <a href={`mailto:${m.email}`} className="hover:text-secondary flex items-center gap-1">
                  <Icon name="mail" className="text-base" /> {m.email}
                </a>
                {m.phone && (
                  <a href={`tel:${m.phone}`} className="hover:text-secondary flex items-center gap-1">
                    <Icon name="call" className="text-base" /> {m.phone}
                  </a>
                )}
              </div>
            </div>
            <span className="text-xs text-outline shrink-0">
              {new Date(m.createdAt).toLocaleString("vi-VN")}
            </span>
          </div>
          <p className="mt-3 text-on-surface whitespace-pre-wrap">{m.message}</p>
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => toggle(m)}
              disabled={busyId === m.id}
              className={`inline-flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-lg disabled:opacity-50 ${
                m.handled
                  ? "text-on-surface-variant border border-outline-variant"
                  : "bg-secondary text-white"
              }`}
            >
              <Icon name={m.handled ? "undo" : "check"} className="text-base" />
              {m.handled ? "Đánh dấu chưa xử lý" : "Đã xử lý"}
            </button>
            <button
              onClick={() => remove(m)}
              disabled={busyId === m.id}
              className="inline-flex items-center gap-1.5 text-sm text-error px-3 py-1.5 rounded-lg hover:bg-error-container/40 disabled:opacity-50"
            >
              <Icon name="delete" className="text-base" /> Xóa
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
