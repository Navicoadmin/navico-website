import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Icon } from "@/components/Icon";
import { ProductForm } from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
    select: { id: true, name: true },
  });

  return (
    <div className="space-y-6">
      <Link
        href="/admin/products"
        className="inline-flex items-center gap-1 text-sm text-on-surface-variant hover:text-secondary"
      >
        <Icon name="arrow_back" className="text-lg" /> Quay lại danh sách
      </Link>
      <h1 className="text-2xl font-bold text-primary">Thêm sản phẩm</h1>
      {categories.length === 0 ? (
        <p className="text-on-surface-variant">
          Vui lòng tạo danh mục trước khi thêm sản phẩm.
        </p>
      ) : (
        <ProductForm categories={categories} />
      )}
    </div>
  );
}
