import { prisma } from "@/lib/prisma";
import { JobManager } from "@/components/admin/JobManager";

export const dynamic = "force-dynamic";

export default async function AdminJobsPage() {
  const jobs = await prisma.job.findMany({ orderBy: { order: "asc" } });
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary">Tuyển dụng</h1>
        <p className="text-on-surface-variant mt-1">
          Đăng và quản lý các vị trí tuyển dụng.
        </p>
      </div>
      <JobManager
        initial={jobs.map((j) => ({
          id: j.id,
          title: j.title,
          slug: j.slug,
          department: j.department,
          type: j.type,
          location: j.location,
          description: j.description,
          published: j.published,
          order: j.order,
        }))}
      />
    </div>
  );
}
