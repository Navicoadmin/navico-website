import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Icon } from "@/components/Icon";
import { ProductForm } from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: { faqs: { orderBy: { order: "asc" } } },
    }),
    prisma.category.findMany({
      orderBy: { order: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  if (!product) notFound();

  return (
    <div className="space-y-6">
      <Link
        href="/admin/products"
        className="inline-flex items-center gap-1 text-sm text-on-surface-variant hover:text-secondary"
      >
        <Icon name="arrow_back" className="text-lg" /> Quay lại danh sách
      </Link>
      <h1 className="text-2xl font-bold text-primary">Sửa: {product.name}</h1>
      <ProductForm
        categories={categories}
        initial={{
          id: product.id,
          name: product.name,
          slug: product.slug,
          code: product.code,
          categoryId: product.categoryId,
          shortDescription: product.shortDescription,
          activeIngredients: product.activeIngredients ?? "",
          benefits: product.benefits ?? "",
          usageInstructions: product.usageInstructions ?? "",
          dosage: product.dosage ?? "",
          heroImage: product.heroImage ?? "",
          metaTitle: product.metaTitle ?? "",
          metaDescription: product.metaDescription ?? "",
          featured: product.featured,
          published: product.published,
          faqs: product.faqs.map((f) => ({
            question: f.question,
            answer: f.answer,
          })),
        }}
      />
    </div>
  );
}
