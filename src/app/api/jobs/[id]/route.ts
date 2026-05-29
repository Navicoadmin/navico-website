import { prisma } from "@/lib/prisma";
import { jobSchema } from "@/lib/validation";
import { badRequest, ok, notFound, requireAuth, serverError, zodError } from "@/lib/api";
import { ZodError } from "zod";

type Ctx = { params: Promise<{ id: string }> };

// PUT /api/jobs/[id] (admin)
export async function PUT(req: Request, { params }: Ctx) {
  const auth = await requireAuth();
  if ("error" in auth) return auth.error;
  const { id } = await params;
  try {
    const data = jobSchema.parse(await req.json());
    const dup = await prisma.job.findFirst({
      where: { slug: data.slug, NOT: { id } },
    });
    if (dup) return badRequest("Slug đã tồn tại");
    const job = await prisma.job.update({
      where: { id },
      data: {
        title: data.title,
        slug: data.slug,
        department: data.department || null,
        type: data.type || null,
        location: data.location || null,
        description: data.description || null,
        published: data.published ?? true,
        order: data.order ?? 0,
      },
    });
    return ok({ job });
  } catch (err) {
    if (err instanceof ZodError) return zodError(err);
    console.error("update job error", err);
    return serverError();
  }
}

// DELETE /api/jobs/[id] (admin)
export async function DELETE(_req: Request, { params }: Ctx) {
  const auth = await requireAuth();
  if ("error" in auth) return auth.error;
  const { id } = await params;
  try {
    await prisma.job.delete({ where: { id } });
    return ok({ success: true });
  } catch {
    return notFound("Vị trí không tồn tại");
  }
}
