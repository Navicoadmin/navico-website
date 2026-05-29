"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Icon } from "@/components/Icon";

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.message || "Đăng nhập thất bại");

      // Điều hướng tới trang trước đó (nếu có) hoặc dashboard
      const next = params.get("next") || "/admin";
      router.replace(next);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Có lỗi xảy ra");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-semibold text-on-surface-variant">
          Email
        </label>
        <div className="relative">
          <Icon
            name="mail"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-outline text-xl"
          />
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="username"
            placeholder="admin@navico.vn"
            className="w-full pl-10 pr-4 py-3 bg-white border border-outline-variant rounded-lg text-sm focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-semibold text-on-surface-variant">
          Mật khẩu
        </label>
        <div className="relative">
          <Icon
            name="lock"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-outline text-xl"
          />
          <input
            id="password"
            name="password"
            type={showPw ? "text" : "password"}
            required
            autoComplete="current-password"
            placeholder="••••••••"
            className="w-full pl-10 pr-12 py-3 bg-white border border-outline-variant rounded-lg text-sm focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
          />
          <button
            type="button"
            onClick={() => setShowPw((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface-variant"
            aria-label={showPw ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
          >
            <Icon name={showPw ? "visibility_off" : "visibility"} className="text-xl" />
          </button>
        </div>
      </div>

      {error && (
        <p className="text-sm text-error bg-error-container/40 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-primary-container text-white py-3.5 rounded-lg font-semibold hover:bg-primary transition-all flex items-center justify-center gap-2 disabled:opacity-60"
      >
        {loading ? "Đang đăng nhập..." : "Đăng nhập"}
        {!loading && <Icon name="arrow_forward" className="text-lg" />}
      </button>
    </form>
  );
}
