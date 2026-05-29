import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Icon } from "@/components/Icon";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [productCount, categoryCount, newsCount, messageCount, unreadCount, recentMessages] =
    await Promise.all([
      prisma.product.count(),
      prisma.category.count(),
      prisma.news.count(),
      prisma.contactMessage.count(),
      prisma.contactMessage.count({ where: { handled: false } }),
      prisma.contactMessage.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
    ]);

  const stats = [
    { label: "Sản phẩm", value: productCount, icon: "inventory_2", href: "/admin/products" },
    { label: "Danh mục", value: categoryCount, icon: "category", href: "/admin/categories" },
    { label: "Bài viết", value: newsCount, icon: "article", href: "/admin/news" },
    { label: "Tin nhắn", value: messageCount, icon: "mail", href: "/admin/messages", badge: unreadCount },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-primary">Tổng quan hệ thống</h1>
        <p className="text-on-surface-variant mt-1">
          Chào mừng quay lại trang quản trị NAVICO.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="bg-white rounded-2xl p-6 border border-outline-variant/60 hover:border-secondary hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="size-12 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center">
                <Icon name={s.icon} className="text-2xl" />
              </div>
              {!!s.badge && (
                <span className="text-xs font-bold bg-error text-white rounded-full px-2 py-0.5">
                  {s.badge} mới
                </span>
              )}
            </div>
            <div className="text-3xl font-black text-primary">{s.value}</div>
            <div className="text-sm text-on-surface-variant mt-1">{s.label}</div>
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-outline-variant/60 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/60">
          <h2 className="font-bold text-primary">Tin nhắn gần đây</h2>
          <Link href="/admin/messages" className="text-sm text-secondary font-semibold hover:underline">
            Xem tất cả
          </Link>
        </div>
        {recentMessages.length === 0 ? (
          <p className="px-6 py-10 text-center text-on-surface-variant">
            Chưa có tin nhắn nào.
          </p>
        ) : (
          <ul className="divide-y divide-outline-variant/40">
            {recentMessages.map((m) => (
              <li key={m.id} className="px-6 py-4 flex items-start gap-4">
                <div className="size-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant shrink-0">
                  <Icon name="person" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-primary">{m.name}</p>
                    {!m.handled && (
                      <span className="size-2 rounded-full bg-secondary" />
                    )}
                  </div>
                  <p className="text-sm text-on-surface-variant truncate">
                    {m.message}
                  </p>
                </div>
                <span className="text-xs text-outline shrink-0">
                  {new Date(m.createdAt).toLocaleDateString("vi-VN")}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
