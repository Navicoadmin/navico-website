import { prisma } from "@/lib/prisma";
import { categorySchema } from "@/lib/validation";
import { badRequest, created, ok, requireAuth, serverError, zodError } from "@/lib/api";
import { ZodError } from "zod";

// GET /api/categories — danh sách danh mục (công khai)
export async function GET() {
  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
    include: { _count: { select: { products: true } } },
  });
  return ok({ categories });
}

// POST /api/categories — tạo danh mục (admin)
export async function POST(req: Request) {
  const auth = await requireAuth();
  if ("error" in auth) return auth.error;

  try {
    const data = categorySchema.parse(await req.json());
    const exists = await prisma.category.findUnique({
      where: { slug: data.slug },
    });
    if (exists) return badRequest("Slug đã tồn tại");

    const category = await prisma.category.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description || null,
        icon: data.icon || null,
        order: data.order ?? 0,
      },
    });
    return created({ category });
  } catch (err) {
    if (err instanceof ZodError) return zodError(err);
    console.error("create category error", err);
    return serverError();
  }
}
