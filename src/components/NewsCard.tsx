import Link from "next/link";
import { Icon } from "@/components/Icon";
import type { News } from "@/lib/data";

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function NewsCard({ item }: { item: News }) {
  return (
    <Link
      href={`/tin-tuc/${item.slug}`}
      className="group bg-white rounded-xl overflow-hidden border border-surface-variant hover:border-secondary/30 hover:shadow-md transition-all flex flex-col"
    >
      <div className="aspect-video overflow-hidden bg-surface-container">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.coverImage}
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      <div className="p-6 flex-grow flex flex-col">
        <div className="flex justify-between items-center mb-3">
          <span className="px-2 py-0.5 rounded bg-secondary/5 text-secondary text-xs font-semibold">
            {item.tag}
          </span>
          <span className="text-outline text-xs">
            {formatDate(item.publishedAt)}
          </span>
        </div>
        <h3 className="font-bold text-primary mb-3 group-hover:text-secondary transition-colors line-clamp-2">
          {item.title}
        </h3>
        <p className="text-on-surface-variant text-sm line-clamp-3 mb-4">
          {item.excerpt}
        </p>
        <span className="mt-auto inline-flex items-center gap-2 text-secondary text-sm font-semibold">
          Đọc thêm <Icon name="arrow_forward" className="text-base" />
        </span>
      </div>
    </Link>
  );
}

export { formatDate };
