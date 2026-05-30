import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";
import { NewsCard, formatDate } from "@/components/NewsCard";
import { Icon } from "@/components/Icon";
import { getNewsListFromDB, getTrendingNewsFromDB } from "@/lib/db-data";

export const metadata: Metadata = {
  title: "Tin tức & Sự kiện",
  description:
    "Cập nhật tin tức ngành thủy sản, kỹ thuật nuôi, dinh dưỡng, vi sinh và công nghệ mới nhất từ chuyên gia Navico.",
};

export default async function NewsPage() {
  const list = await getNewsListFromDB();
  const [featured, ...rest] = list;
  const trending = await getTrendingNewsFromDB(3);

  return (
    <div className="max-w-container-max mx-auto px-margin-mobile lg:px-margin-desktop py-10">
      <Breadcrumb
        items={[{ label: "Trang chủ", href: "/" }, { label: "Tin tức" }]}
      />

      <div className="mt-8 mb-12">
        <span className="text-secondary font-bold uppercase tracking-widest text-sm">
          Knowledge Hub
        </span>
        <h1 className="text-3xl lg:text-4xl font-bold text-primary mt-3">
          Tin tức &amp; Sự kiện
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Cột nội dung */}
        <div className="lg:col-span-8">
          {/* Bài nổi bật */}
          {featured && (
            <Link
              href={`/tin-tuc/${featured.slug}`}
              className="group relative block rounded-xl overflow-hidden bg-white shadow-glass mb-12 transition-all hover:shadow-card-hover"
            >
              <div className="aspect-[21/9] w-full overflow-hidden bg-surface-container">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={featured.coverImage}
                  alt={featured.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="p-8">
                <div className="flex items-center gap-4 mb-4">
                  <span className="px-3 py-1 rounded-md bg-secondary/10 text-secondary text-xs font-semibold uppercase tracking-wider">
                    {featured.tag}
                  </span>
                  <span className="text-on-surface-variant text-xs">
                    {formatDate(featured.publishedAt)}
                  </span>
                </div>
                <h2 className="text-2xl lg:text-3xl font-bold text-primary mb-4 group-hover:text-secondary transition-colors">
                  {featured.title}
                </h2>
                <p className="text-on-surface-variant text-lg line-clamp-2 mb-6">
                  {featured.excerpt}
                </p>
                <span className="inline-flex items-center gap-2 text-secondary font-semibold">
                  Xem chi tiết bài viết{" "}
                  <Icon name="arrow_forward" className="text-lg" />
                </span>
              </div>
            </Link>
          )}

          {/* Lưới bài viết */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {rest.map((item) => (
              <NewsCard key={item.id} item={item} />
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-4 space-y-10">
          <section>
            <div className="flex items-center gap-2 mb-6">
              <span className="w-8 h-0.5 bg-secondary" />
              <h4 className="font-semibold text-primary uppercase tracking-wider text-sm">
                Xem nhiều nhất
              </h4>
            </div>
            <div className="space-y-6">
              {trending.map((item) => (
                <Link
                  key={item.id}
                  href={`/tin-tuc/${item.slug}`}
                  className="group flex gap-4"
                >
                  <div className="shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-surface-container">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.coverImage}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform group-hover:scale-110"
                    />
                  </div>
                  <div className="flex flex-col">
                    <h5 className="text-on-surface font-semibold text-sm group-hover:text-secondary transition-colors line-clamp-2">
                      {item.title}
                    </h5>
                    <span className="text-outline text-xs mt-1">
                      {item.views.toLocaleString("vi-VN")} lượt xem
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* CTA đăng ký */}
          <section className="bg-primary rounded-2xl p-8 text-white">
            <h4 className="font-bold text-lg mb-2">Đăng ký nhận tin</h4>
            <p className="text-sm text-white/70 mb-4">
              Nhận bài viết kỹ thuật mới nhất qua email.
            </p>
            <form className="space-y-3">
              <input
                type="email"
                placeholder="Email của bạn"
                className="w-full rounded-lg p-3 text-sm bg-white/10 border border-white/10 text-white placeholder:text-white/40 outline-none focus:border-secondary"
                aria-label="Email"
              />
              <button
                type="submit"
                className="w-full bg-secondary py-3 rounded-lg font-semibold text-sm hover:brightness-110 transition"
              >
                Đăng ký
              </button>
            </form>
          </section>
        </aside>
      </div>
    </div>
  );
}
