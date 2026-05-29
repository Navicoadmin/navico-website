import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Icon } from "@/components/Icon";
import { NewsForm } from "@/components/admin/NewsForm";

export const dynamic = "force-dynamic";

export default async function EditNewsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const news = await prisma.news.findUnique({ where: { id } });
  if (!news) notFound();

  return (
    <div className="space-y-6">
      <Link
        href="/admin/news"
        className="inline-flex items-center gap-1 text-sm text-on-surface-variant hover:text-secondary"
      >
        <Icon name="arrow_back" className="text-lg" /> Quay lại danh sách
      </Link>
      <h1 className="text-2xl font-bold text-primary line-clamp-1">
        Sửa: {news.title}
      </h1>
      <NewsForm
        initial={{
          id: news.id,
          title: news.title,
          slug: news.slug,
          excerpt: news.excerpt,
          content: news.content,
          coverImage: news.coverImage ?? "",
          tag: news.tag ?? "",
          author: news.author,
          published: news.published,
          metaTitle: news.metaTitle ?? "",
          metaDescription: news.metaDescription ?? "",
        }}
      />
    </div>
  );
}
