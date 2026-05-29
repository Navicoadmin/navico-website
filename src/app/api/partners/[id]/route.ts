import { prisma } from "@/lib/prisma";
import { partnerSchema } from "@/lib/validation";
import { ok, notFound, requireAuth, serverError, zodError } from "@/lib/api";
import { ZodError } from "zod";

type Ctx = { params: Promise<{ id: string }> };

// PUT /api/partners/[id] — cập nhật (admin)
export async function PUT(req: Request, { params }: Ctx) {
  const auth = await requireAuth();
  if ("error" in auth) return auth.error;
  const { id } = await params;
  try {
    const data = partnerSchema.parse(await req.json());
    const partner = await prisma.partner.update({
      where: { id },
      data: {
        name: data.name,
        logo: data.logo,
        url: data.url || null,
        order: data.order ?? 0,
      },
    });
    return ok({ partner });
  } catch (err) {
    if (err instanceof ZodError) return zodError(err);
    console.error("update partner error", err);
    return serverError();
  }
}

// DELETE /api/partners/[id] — xóa (admin)
export async function DELETE(_req: Request, { params }: Ctx) {
  const auth = await requireAuth();
  if ("error" in auth) return auth.error;
  const { id } = await params;
  try {
    await prisma.partner.delete({ where: { id } });
    return ok({ success: true });
  } catch {
    return notFound("Đối tác không tồn tại");
  }
}
