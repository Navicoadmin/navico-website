import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Icon } from "@/components/Icon";
import { DeleteButton } from "@/components/admin/DeleteButton";

export const dynamic = "force-dynamic";

export default async function AdminNewsPage() {
  const news = await prisma.news.findMany({ orderBy: { publishedAt: "desc" } });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary">Tin tức</h1>
          <p className="text-on-surface-variant mt-1">{news.length} bài viết</p>
        </div>
        <Link
          href="/admin/news/new"
          className="inline-flex items-center gap-2 bg-secondary text-white px-5 py-2.5 rounded-lg font-semibold hover:brightness-110"
        >
          <Icon name="add" className="text-lg" /> Viết bài
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-outline-variant/60 overflow-x-auto">
        <table className="w-full text-sm min-w-[640px]">
          <thead className="bg-surface-container-low text-on-surface-variant">
            <tr>
              <th className="text-left px-4 py-3 font-semibold">Tiêu đề</th>
              <th className="text-left px-4 py-3 font-semibold">Chủ đề</th>
              <th className="text-left px-4 py-3 font-semibold">Ngày</th>
              <th className="text-center px-4 py-3 font-semibold">Trạng thái</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/40">
            {news.map((n) => (
              <tr key={n.id}>
                <td className="px-4 py-3 font-medium text-primary max-w-md">
                  <span className="line-clamp-1">{n.title}</span>
                </td>
                <td className="px-4 py-3 text-on-surface-variant">{n.tag || "-"}</td>
                <td className="px-4 py-3 text-on-surface-variant">
                  {new Date(n.publishedAt).toLocaleDateString("vi-VN")}
                </td>
                <td className="px-4 py-3 text-center">
                  {n.published ? (
                    <span className="text-xs font-semibold bg-secondary/10 text-secondary rounded-full px-2.5 py-1">
                      Hiển thị
                    </span>
                  ) : (
                    <span className="text-xs font-semibold bg-surface-container text-on-surface-variant rounded-full px-2.5 py-1">
                      Nháp
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-right whitespace-nowrap">
                  <Link
                    href={`/admin/news/${n.id}/edit`}
                    className="inline-flex text-secondary hover:bg-secondary/10 rounded p-1.5"
                    aria-label="Sửa"
                  >
                    <Icon name="edit" className="text-lg" />
                  </Link>
                  <span className="inline-flex ml-1">
                    <DeleteButton endpoint={`/api/news/${n.id}`} label={n.title} />
                  </span>
                </td>
              </tr>
            ))}
            {news.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-on-surface-variant">
                  Chưa có bài viết nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
