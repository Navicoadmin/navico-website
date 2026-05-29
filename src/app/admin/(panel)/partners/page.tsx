import { prisma } from "@/lib/prisma";
import { PartnerManager } from "@/components/admin/PartnerManager";

export const dynamic = "force-dynamic";

export default async function AdminPartnersPage() {
  const partners = await prisma.partner.findMany({ orderBy: { order: "asc" } });
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary">Thương hiệu đồng hành</h1>
        <p className="text-on-surface-variant mt-1">
          Quản lý logo các đối tác hiển thị ở trang Giới thiệu.
        </p>
      </div>
      <PartnerManager
        initial={partners.map((p) => ({
          id: p.id,
          name: p.name,
          logo: p.logo,
          url: p.url,
          order: p.order,
        }))}
      />
    </div>
  );
}
