import { prisma } from "@/lib/prisma";
import { heroSlideSchema } from "@/lib/validation";
import { created, ok, requireAuth, serverError, zodError } from "@/lib/api";
import { ZodError } from "zod";

// GET /api/hero-slides — danh sách slide (?all=1 cho admin, gồm slide ẩn)
export async function GET(req: Request) {
  const all = new URL(req.url).searchParams.get("all") === "1";
  const slides = await prisma.heroSlide.findMany({
    where: all ? {} : { active: true },
    orderBy: { order: "asc" },
  });
  return ok({ slides });
}

// POST /api/hero-slides — thêm slide (admin)
export async function POST(req: Request) {
  const auth = await requireAuth();
  if ("error" in auth) return auth.error;
  try {
    const data = heroSlideSchema.parse(await req.json());
    const slide = await prisma.heroSlide.create({
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
    return created({ slide });
  } catch (err) {
    if (err instanceof ZodError) return zodError(err);
    console.error("create slide error", err);
    return serverError();
  }
}
