import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/Breadcrumb";
import { ProductCard } from "@/components/ProductCard";
import { Icon } from "@/components/Icon";
import {
  getProductBySlug,
  getProducts,
  getRelatedProducts,
} from "@/lib/data";

// Tạo sẵn các trang sản phẩm ở build time (SSG)
export function generateStaticParams() {
  return getProducts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: "Không tìm thấy sản phẩm" };
  return {
    title: product.name,
    description: product.shortDescription,
    openGraph: {
      title: product.name,
      description: product.shortDescription,
      images: product.heroImage ? [product.heroImage] : undefined,
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const related = getRelatedProducts(product);
  const hasIngredients = product.activeIngredients.length > 0;
  const hasBenefits = product.benefits.length > 0;
  const hasDosage = product.dosage.length > 0;
  const hasFaqs = product.faqs.length > 0;

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_50%_50%,rgba(119,245,255,0.12)_0%,rgba(249,249,249,1)_70%)]">
        <div className="max-w-container-max mx-auto px-margin-mobile lg:px-margin-desktop pt-8">
          <Breadcrumb
            items={[
              { label: "Trang chủ", href: "/" },
              { label: "Sản phẩm", href: "/san-pham" },
              { label: product.name },
            ]}
          />
        </div>
        <div className="max-w-container-max mx-auto px-margin-mobile lg:px-margin-desktop py-16 grid md:grid-cols-2 gap-12 items-center">
          <div>
            {product.badge && (
              <span className="inline-block px-4 py-1.5 rounded-full bg-secondary/10 text-secondary text-sm font-semibold mb-6">
                {product.badge}
              </span>
            )}
            <h1 className="text-4xl lg:text-5xl font-bold text-deep-navy mb-4 leading-tight">
              {product.name}
            </h1>
            {product.tagline && (
              <h2 className="text-xl lg:text-2xl font-semibold text-secondary mb-6">
                {product.tagline}
              </h2>
            )}
            <p className="text-lg text-on-surface-variant mb-8 max-w-lg">
              {product.shortDescription}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/lien-he"
                className="bg-secondary text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                Nhận tư vấn kỹ thuật
              </Link>
              <a
                href="#chi-tiet"
                className="border-2 border-secondary text-secondary px-8 py-4 rounded-xl font-semibold hover:bg-secondary/5 transition-all"
              >
                Tài liệu chi tiết
              </a>
            </div>
          </div>
          <div className="relative flex justify-center">
            <div className="absolute inset-0 bg-secondary/10 blur-[100px] rounded-full" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.heroImage}
              alt={product.name}
              className="relative z-10 w-full max-w-[420px] object-contain drop-shadow-2xl"
            />
          </div>
        </div>
      </section>

      <div id="chi-tiet" />

      {/* Thành phần */}
      {hasIngredients && (
        <section className="py-20 bg-surface-container-lowest">
          <div className="max-w-container-max mx-auto px-margin-mobile lg:px-margin-desktop">
            <h3 className="text-2xl lg:text-3xl font-bold text-deep-navy mb-8">
              Thành phần công thức
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {product.activeIngredients.map((ing) => (
                <div
                  key={ing.name}
                  className="p-6 bg-surface-container-low rounded-2xl border border-outline-variant/30"
                >
                  <Icon name={ing.icon} className="text-secondary text-3xl mb-3" />
                  <h4 className="font-semibold text-deep-navy mb-1">
                    {ing.name}
                  </h4>
                  <p className="text-sm text-on-surface-variant">{ing.effect}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Công dụng */}
      {hasBenefits && (
        <section className="py-20">
          <div className="max-w-container-max mx-auto px-margin-mobile lg:px-margin-desktop">
            <div className="text-center mb-14">
              <h2 className="text-2xl lg:text-3xl font-bold text-deep-navy mb-4">
                Công dụng vượt trội
              </h2>
              <div className="w-24 h-1 bg-secondary mx-auto rounded-full" />
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {product.benefits.map((b) => (
                <div
                  key={b.title}
                  className="glass-card p-8 rounded-3xl text-center hover:shadow-xl transition-all"
                >
                  <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Icon name={b.icon} className="text-secondary text-3xl" />
                  </div>
                  <h4 className="text-xl font-bold text-deep-navy mb-4">
                    {b.title}
                  </h4>
                  <p className="text-on-surface-variant">{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Liều dùng */}
      {hasDosage && (
        <section className="py-20 bg-surface-container">
          <div className="max-w-container-max mx-auto px-margin-mobile lg:px-margin-desktop">
            <div className="bg-surface-container-lowest rounded-3xl p-6 md:p-12 shadow-sm">
              <div className="flex flex-col md:flex-row justify-between md:items-end mb-10 gap-6">
                <div>
                  <h2 className="text-2xl lg:text-3xl font-bold text-deep-navy mb-2">
                    Liều dùng &amp; Cách sử dụng
                  </h2>
                  <p className="text-on-surface-variant">
                    Tối ưu hiệu quả dựa trên tình trạng ao nuôi cụ thể.
                  </p>
                </div>
                <div className="bg-secondary/10 px-4 py-2 rounded-lg flex items-center gap-2 w-fit">
                  <Icon name="info" className="text-secondary" />
                  <span className="text-secondary font-semibold text-sm">
                    Nên sử dụng lúc 8-10 giờ sáng
                  </span>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[560px]">
                  <thead>
                    <tr className="border-b border-outline-variant">
                      <th className="py-4 font-semibold text-deep-navy">
                        Giai đoạn / Điều kiện
                      </th>
                      <th className="py-4 font-semibold text-deep-navy">
                        Liều lượng
                      </th>
                      <th className="py-4 font-semibold text-deep-navy">
                        Định kỳ
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/30">
                    {product.dosage.map((row, i) => (
                      <tr key={i} className={row.warning ? "bg-error-container/20" : ""}>
                        <td
                          className={`py-5 font-semibold ${
                            row.warning ? "text-error" : "text-deep-navy"
                          }`}
                        >
                          {row.stage}
                        </td>
                        <td
                          className={`py-5 ${
                            row.warning
                              ? "text-error font-semibold"
                              : "text-on-surface-variant"
                          }`}
                        >
                          {row.dose}
                        </td>
                        <td
                          className={`py-5 ${
                            row.warning ? "text-error" : "text-on-surface-variant"
                          }`}
                        >
                          {row.frequency}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-8 grid md:grid-cols-2 gap-6">
                {product.usageNote && (
                  <div className="flex gap-4 items-start p-6 rounded-2xl bg-surface">
                    <Icon name="science" className="text-secondary" />
                    <div>
                      <h5 className="font-semibold text-deep-navy mb-1">
                        Cách dùng
                      </h5>
                      <p className="text-sm text-on-surface-variant">
                        {product.usageNote}
                      </p>
                    </div>
                  </div>
                )}
                {product.warningNote && (
                  <div className="flex gap-4 items-start p-6 rounded-2xl bg-surface">
                    <Icon name="warning" className="text-secondary" />
                    <div>
                      <h5 className="font-semibold text-deep-navy mb-1">
                        Lưu ý
                      </h5>
                      <p className="text-sm text-on-surface-variant">
                        {product.warningNote}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      {hasFaqs && (
        <section className="py-20 bg-surface-container-lowest">
          <div className="max-w-container-max mx-auto px-margin-mobile lg:px-margin-desktop">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl lg:text-3xl font-bold text-deep-navy mb-10 text-center">
                Câu hỏi thường gặp
              </h2>
              <div className="space-y-4">
                {product.faqs.map((faq, i) => (
                  <details
                    key={i}
                    className="group border border-outline-variant/50 rounded-2xl overflow-hidden shadow-sm [&_summary::-webkit-details-marker]:hidden"
                    open={i === 0}
                  >
                    <summary className="flex justify-between items-center p-6 cursor-pointer bg-white group-open:bg-secondary/5">
                      <span className="font-semibold text-deep-navy pr-4">
                        {faq.question}
                      </span>
                      <Icon
                        name="expand_more"
                        className="transition-transform group-open:rotate-180 shrink-0"
                      />
                    </summary>
                    <div className="p-6 pt-0 bg-white group-open:bg-secondary/5 text-on-surface-variant">
                      {faq.answer}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Sản phẩm liên quan */}
      {related.length > 0 && (
        <section className="py-20 bg-surface">
          <div className="max-w-container-max mx-auto px-margin-mobile lg:px-margin-desktop">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-2xl lg:text-3xl font-bold text-deep-navy">
                Sản phẩm liên quan
              </h2>
              <Link
                href="/san-pham"
                className="text-secondary font-semibold flex items-center gap-1 hover:underline"
              >
                Xem tất cả <Icon name="arrow_forward" className="text-base" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
