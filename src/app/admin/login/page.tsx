import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata: Metadata = {
  title: "Đăng nhập quản trị",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-5 bg-surface [background-image:radial-gradient(circle_at_100%_100%,rgba(119,245,255,0.06)_0%,transparent_50%),radial-gradient(circle_at_0%_0%,rgba(0,33,71,0.04)_0%,transparent_50%)]">
      <div className="w-full max-w-[440px] bg-white p-8 md:p-10 rounded-2xl shadow-glass border border-outline-variant/30">
        <div className="mb-8 text-center">
          <div className="text-3xl font-black text-primary mb-2">NAVICO</div>
          <h1 className="text-2xl font-bold text-primary mb-1">
            Cổng quản trị
          </h1>
          <p className="text-on-surface-variant text-sm">
            Đăng nhập để quản lý nội dung website.
          </p>
        </div>
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
      <p className="mt-8 text-xs text-on-surface-variant/60 text-center">
        © 2026 Navico. Khu vực dành riêng cho người được cấp quyền.
      </p>
    </main>
  );
}
