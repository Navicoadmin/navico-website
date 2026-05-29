import Link from "next/link";
import { Icon } from "@/components/Icon";
import { getCategoryBySlug, type Product } from "@/lib/data";

export function ProductCard({ product }: { product: Product }) {
  const category = getCategoryBySlug(product.categorySlug);
  return (
    <Link
      href={`/san-pham/${product.slug}`}
      className="group flex flex-col bg-white rounded-xl overflow-hidden border border-outline-variant/60 hover:border-secondary hover:shadow-card-hover transition-all"
    >
      <div className="h-56 bg-surface-container-highest flex items-center justify-center p-6 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.heroImage}
          alt={product.name}
          className="h-full object-contain transition-transform group-hover:scale-110"
        />
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <span className="text-xs font-semibold text-secondary uppercase tracking-widest">
          {category?.name}
        </span>
        <h3 className="text-lg font-bold text-primary mt-2 mb-2 group-hover:text-secondary transition-colors">
          {product.name}
        </h3>
        <p className="text-sm text-on-surface-variant mb-6 line-clamp-2 flex-grow">
          {product.shortDescription}
        </p>
        <span className="inline-flex items-center gap-2 font-semibold text-sm text-primary group-hover:text-secondary transition-colors">
          Xem chi tiết <Icon name="arrow_forward" className="text-lg" />
        </span>
      </div>
    </Link>
  );
}
