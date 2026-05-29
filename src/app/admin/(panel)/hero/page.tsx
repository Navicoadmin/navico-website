import { prisma } from "@/lib/prisma";
import { HeroManager } from "@/components/admin/HeroManager";

export const dynamic = "force-dynamic";

export default async function AdminHeroPage() {
  const slides = await prisma.heroSlide.findMany({ orderBy: { order: "asc" } });
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary">Ảnh đầu trang chủ</h1>
        <p className="text-on-surface-variant mt-1">
          Quản lý các slide hiển thị ở đầu trang chủ.
        </p>
      </div>
      <HeroManager
        initial={slides.map((s) => ({
          id: s.id,
          image: s.image,
          title: s.title,
          subtitle: s.subtitle,
          ctaLabel: s.ctaLabel,
          ctaHref: s.ctaHref,
          order: s.order,
          active: s.active,
        }))}
      />
    </div>
  );
}
