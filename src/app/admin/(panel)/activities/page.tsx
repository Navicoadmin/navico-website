import { prisma } from "@/lib/prisma";
import { ActivityManager } from "@/components/admin/ActivityManager";

export const dynamic = "force-dynamic";

export default async function AdminActivitiesPage() {
  const activities = await prisma.activity.findMany({ orderBy: { date: "desc" } });
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary">Hoạt động &amp; Sự kiện</h1>
        <p className="text-on-surface-variant mt-1">
          Đăng và quản lý các hoạt động, sự kiện của công ty.
        </p>
      </div>
      <ActivityManager
        initial={activities.map((a) => ({
          id: a.id,
          title: a.title,
          slug: a.slug,
          tag: a.tag,
          description: a.description,
          date: a.date.toISOString().slice(0, 10),
          images: a.images,
          published: a.published,
        }))}
      />
    </div>
  );
}
