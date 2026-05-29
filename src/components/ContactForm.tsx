"use client";

import { useState } from "react";

type Status = "idle" | "sending" | "success" | "error";

// Form liên hệ: gửi tới /api/contact (xây dựng ở bước backend).
// `variant` đổi màu chữ cho nền tối (trang chủ) hoặc nền sáng (trang liên hệ).
export function ContactForm({ variant = "dark" }: { variant?: "dark" | "light" }) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  const dark = variant === "dark";
  const inputBase = dark
    ? "bg-white/5 border-white/10 text-white placeholder:text-white/40"
    : "bg-white border-outline-variant text-on-surface placeholder:text-on-surface-variant";

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setError("");
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || "Gửi không thành công");
      }
      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Có lỗi xảy ra");
    }
  }

  if (status === "success") {
    return (
      <div
        className={`rounded-lg p-6 ${
          dark ? "bg-white/10 text-white" : "bg-secondary/10 text-secondary"
        }`}
      >
        <p className="font-bold mb-1">Cảm ơn bạn đã liên hệ!</p>
        <p className="text-sm opacity-80">
          Đội ngũ Navico sẽ phản hồi trong thời gian sớm nhất.
        </p>
      </div>
    );
  }

  const inputCls = `w-full rounded-lg p-4 border outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition ${inputBase}`;

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-4">
        <input name="name" required placeholder="Họ và tên" className={inputCls} />
        <input
          name="email"
          type="email"
          required
          placeholder="Email"
          className={inputCls}
        />
      </div>
      <input name="phone" placeholder="Số điện thoại" className={inputCls} />
      <textarea
        name="message"
        required
        rows={4}
        placeholder="Nội dung cần tư vấn"
        className={inputCls}
      />
      {status === "error" && (
        <p className="text-sm text-error bg-error-container rounded px-3 py-2">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full bg-secondary text-white py-4 rounded-lg font-bold hover:shadow-lg hover:shadow-secondary/20 transition-all disabled:opacity-60"
      >
        {status === "sending" ? "Đang gửi..." : "Gửi thông tin"}
      </button>
    </form>
  );
}
