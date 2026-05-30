import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/Breadcrumb";
import { NewsCard, formatDate } from "@/components/NewsCard";
import { Icon } from "@/components/Icon";
import { getNewsBySlugFromDB, getNewsListFromDB } from "@/lib/db-data";

export async function generateStaticParams() {
  return await getNewsListFromDB().map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = await getNewsBySlugFromDB(slug);
  if (!item) return { title: "Không tìm thấy bài viết" };
  return {
    title: item.title,
    description: item.excerpt,
    openGraph: {
      type: "article",
      title: item.title,
      description: item.excerpt,
      images: [item.coverImage],
      publishedTime: item.publishedAt,
    },
  };
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = await getNewsBySlugFromDB(slug);
  if (!item) notFound();

  // Bài viết khác cùng chủ đề
  const others = await getNewsListFromDB()
    .filter((n) => n.id !== item.id)
    .slice(0, 3);

  return (
    <article className="max-w-container-max mx-auto px-margin-mobile lg:px-margin-desktop py-10">
      <Breadcrumb
        items={[
          { label: "Trang chủ", href: "/" },
          { label: "Tin tức", href: "/tin-tuc" },
          { label: item.title },
        ]}
      />

      <div className="max-w-3xl mx-auto mt-8">
        <div className="flex items-center gap-4 mb-4">
          <span className="px-3 py-1 rounded-md bg-secondary/10 text-secondary text-xs font-semibold uppercase tracking-wider">
            {item.tag}
          </span>
          <span className="text-on-surface-variant text-sm flex items-center gap-1">
            <Icon name="calendar_today" className="text-sm" />
            {formatDate(item.publishedAt)}
          </span>
          <span className="text-on-surface-variant text-sm flex items-center gap-1">
            <Icon name="visibility" className="text-sm" />
            {item.views.toLocaleString("vi-VN")} lượt xem
          </span>
        </div>
        <h1 className="text-3xl lg:text-4xl font-bold text-primary leading-tight mb-6">
          {item.title}
        </h1>
        <p className="text-lg text-on-surface-variant mb-8">{item.excerpt}</p>
      </div>

      <div className="max-w-3xl mx-auto rounded-2xl overflow-hidden mb-10 bg-surface-container">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.coverImage}
          alt={item.title}
          className="w-full aspect-video object-cover"
        />
      </div>

      {/* Nội dung bài viết (HTML từ CMS). Dữ liệu nội bộ, không phải input người dùng. */}
      <div
        className="max-w-3xl mx-auto prose-navico"
        dangerouslySetInnerHTML={{ __html: item.content }}
      />

      {/* Bài viết khác */}
      {others.length > 0 && (
        <section className="mt-20">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-primary">Bài viết khác</h2>
            <Link
              href="/tin-tuc"
              className="text-secondary font-semibold flex items-center gap-1 hover:underline"
            >
              Xem tất cả <Icon name="arrow_forward" className="text-base" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {others.map((n) => (
              <NewsCard key={n.id} item={n} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
