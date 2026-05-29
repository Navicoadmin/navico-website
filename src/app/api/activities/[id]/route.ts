import { prisma } from "@/lib/prisma";
import { activitySchema } from "@/lib/validation";
import { badRequest, ok, notFound, requireAuth, serverError, zodError } from "@/lib/api";
import { ZodError } from "zod";

type Ctx = { params: Promise<{ id: string }> };

// PUT /api/activities/[id] (admin)
export async function PUT(req: Request, { params }: Ctx) {
  const auth = await requireAuth();
  if ("error" in auth) return auth.error;
  const { id } = await params;
  try {
    const data = activitySchema.parse(await req.json());
    const dup = await prisma.activity.findFirst({
      where: { slug: data.slug, NOT: { id } },
    });
    if (dup) return badRequest("Slug đã tồn tại");
    const activity = await prisma.activity.update({
      where: { id },
      data: {
        title: data.title,
        slug: data.slug,
        tag: data.tag || null,
        description: data.description,
        date: new Date(data.date),
        images: data.images ?? [],
        published: data.published ?? true,
      },
    });
    return ok({ activity });
  } catch (err) {
    if (err instanceof ZodError) return zodError(err);
    console.error("update activity error", err);
    return serverError();
  }
}

// DELETE /api/activities/[id] (admin)
export async function DELETE(_req: Request, { params }: Ctx) {
  const auth = await requireAuth();
  if ("error" in auth) return auth.error;
  const { id } = await params;
  try {
    await prisma.activity.delete({ where: { id } });
    return ok({ success: true });
  } catch {
    return notFound("Hoạt động không tồn tại");
  }
}
