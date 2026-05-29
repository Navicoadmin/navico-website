import { prisma } from "@/lib/prisma";
import { heroSlideSchema } from "@/lib/validation";
import { ok, notFound, requireAuth, serverError, zodError } from "@/lib/api";
import { ZodError } from "zod";

type Ctx = { params: Promise<{ id: string }> };

// PUT /api/hero-slides/[id] (admin)
export async function PUT(req: Request, { params }: Ctx) {
  const auth = await requireAuth();
  if ("error" in auth) return auth.error;
  const { id } = await params;
  try {
    const data = heroSlideSchema.parse(await req.json());
    const slide = await prisma.heroSlide.update({
      where: { id },
      data: {
        image: data.image,
        title: data.title,
        subtitle: data.subtitle || null,
        ctaLabel: data.ctaLabel || null,
        ctaHref: data.ctaHref || null,
        order: data.order ?? 0,
        active: data.active ?? true,
      },
    });
    return ok({ slide });
  } catch (err) {
    if (err instanceof ZodError) return zodError(err);
    console.error("update slide error", err);
    return serverError();
  }
}

// DELETE /api/hero-slides/[id] (admin)
export async function DELETE(_req: Request, { params }: Ctx) {
  const auth = await requireAuth();
  if ("error" in auth) return auth.error;
  const { id } = await params;
  try {
    await prisma.heroSlide.delete({ where: { id } });
    return ok({ success: true });
  } catch {
    return notFound("Slide không tồn tại");
  }
}
