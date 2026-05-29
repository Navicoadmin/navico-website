import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";
import { ProductCard } from "@/components/ProductCard";
import { Icon } from "@/components/Icon";
import { getCategories, getProducts } from "@/lib/data";

export const metadata: Metadata = {
  title: "Sản phẩm",
  description:
    "Danh mục sản phẩm Navico: men vi sinh, dinh dưỡng, khoáng chất, xử lý nước, tăng cường miễn dịch cho ngành nuôi trồng thủy sản.",
};

// searchParams trong Next 15 là Promise — phải await
export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const { category, q } = await searchParams;
  const categories = getCategories();
  const products = getProducts({ categorySlug: category, query: q });

  const buildHref = (slug?: string) => {
    const params = new URLSearchParams();
    if (slug) params.set("category", slug);
    if (q) params.set("q", q);
    const s = params.toString();
    return s ? `/san-pham?${s}` : "/san-pham";
  };

  return (
    <div className="max-w-container-max mx-auto px-margin-mobile lg:px-margin-desktop py-10">
      <Breadcrumb
        items={[{ label: "Trang chủ", href: "/" }, { label: "Sản phẩm" }]}
      />

      <div className="mt-8 mb-12 max-w-3xl">
        <span className="text-secondary font-bold uppercase tracking-widest text-sm">
          Danh mục sản phẩm
        </span>
        <h1 className="text-3xl lg:text-4xl font-bold text-primary mt-3 mb-4">
          Giải pháp toàn diện cho ngành thủy sản
        </h1>
        <p className="text-on-surface-variant text-lg">
          Các dòng sản phẩm được nghiên cứu và sản xuất theo tiêu chuẩn cao,
          đồng hành cùng người nuôi qua từng giai đoạn.
        </p>
      </div>

      {/* Bộ lọc danh mục */}
      <div className="flex flex-wrap gap-3 mb-12">
        <Link
          href={buildHref()}
          className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
            !category
              ? "bg-primary-container text-white"
              : "text-on-surface-variant hover:bg-surface-container"
          }`}
        >
          Tất cả
        </Link>
        {categories.map((c) => (
          <Link
            key={c.slug}
            href={buildHref(c.slug)}
            className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              category === c.slug
                ? "bg-primary-container text-white"
                : "text-on-surface-variant hover:bg-surface-container"
            }`}
          >
            {c.name}
          </Link>
        ))}
      </div>

      {q && (
        <p className="mb-6 text-on-surface-variant">
          Kết quả tìm kiếm cho:{" "}
          <span className="font-bold text-primary">&quot;{q}&quot;</span>
        </p>
      )}

      {products.length > 0 ? (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </section>
      ) : (
        <div className="py-20 text-center text-on-surface-variant">
          <Icon name="search_off" className="text-5xl mb-4 text-outline" />
          <p>Không tìm thấy sản phẩm phù hợp.</p>
        </div>
      )}

      {/* Banner tư vấn */}
      <section className="mt-20 p-8 md:p-12 bg-primary-container rounded-2xl text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-secondary/20 to-transparent" />
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-2xl lg:text-3xl font-bold mb-4">
            Cần tư vấn giải pháp kỹ thuật?
          </h2>
          <p className="opacity-80 mb-8">
            Đội ngũ chuyên gia của chúng tôi luôn sẵn sàng hỗ trợ bạn thiết kế
            quy trình nuôi trồng tối ưu nhất dựa trên dữ liệu thực tế.
          </p>
          <Link
            href="/lien-he"
            className="inline-block px-8 py-3 bg-secondary text-white rounded-lg font-semibold hover:brightness-110 transition-all"
          >
            Liên hệ chuyên gia
          </Link>
        </div>
      </section>
    </div>
  );
}
