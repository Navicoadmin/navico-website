"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Icon } from "@/components/Icon";

const navItems = [
  { label: "Tổng quan", href: "/admin", icon: "dashboard", exact: true },
  { label: "Ảnh trang chủ", href: "/admin/hero", icon: "wallpaper" },
  { label: "Sản phẩm", href: "/admin/products", icon: "inventory_2" },
  { label: "Danh mục", href: "/admin/categories", icon: "category" },
  { label: "Tin tức", href: "/admin/news", icon: "article" },
  { label: "Hoạt động", href: "/admin/activities", icon: "event" },
  { label: "Tuyển dụng", href: "/admin/jobs", icon: "work" },
  { label: "Đối tác", href: "/admin/partners", icon: "handshake" },
  { label: "Tin nhắn", href: "/admin/messages", icon: "mail" },
];

export function AdminShell({
  user,
  children,
}: {
  user: { name: string; email: string; role: string };
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  const sidebar = (
    <div className="flex flex-col h-full">
      <div className="px-6 py-6 border-b border-white/10">
        <Link href="/admin" className="text-2xl font-black text-white">
          NAVICO
        </Link>
        <p className="text-xs text-white/50 mt-1">Hệ thống quản trị</p>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              isActive(item.href, item.exact)
                ? "bg-secondary text-white"
                : "text-white/70 hover:bg-white/10 hover:text-white"
            }`}
          >
            <Icon name={item.icon} className="text-xl" />
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="px-3 py-4 border-t border-white/10">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-white/70 hover:bg-white/10 hover:text-white"
        >
          <Icon name="open_in_new" className="text-xl" />
          Xem website
        </Link>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-white/70 hover:bg-white/10 hover:text-white"
        >
          <Icon name="logout" className="text-xl" />
          Đăng xuất
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-surface-container-low">
      {/* Sidebar desktop */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-64 bg-primary flex-col">
        {sidebar}
      </aside>

      {/* Sidebar mobile (overlay) */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="w-64 bg-primary">{sidebar}</div>
          <div
            className="flex-1 bg-black/40"
            onClick={() => setOpen(false)}
            aria-hidden
          />
        </div>
      )}

      {/* Nội dung */}
      <div className="lg:pl-64">
        {/* Topbar */}
        <header className="sticky top-0 z-40 bg-white border-b border-outline-variant h-16 flex items-center justify-between px-4 lg:px-8">
          <button
            onClick={() => setOpen(true)}
            className="lg:hidden size-10 flex items-center justify-center text-primary"
            aria-label="Mở menu"
          >
            <Icon name="menu" className="text-2xl" />
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-primary leading-tight">
                {user.name}
              </p>
              <p className="text-xs text-on-surface-variant">{user.email}</p>
            </div>
            <div className="size-10 rounded-full bg-secondary/15 text-secondary flex items-center justify-center font-bold">
              {user.name.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
