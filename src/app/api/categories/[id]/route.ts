import { prisma } from "@/lib/prisma";
import { categorySchema } from "@/lib/validation";
import { badRequest, ok, notFound, requireAuth, serverError, zodError } from "@/lib/api";
import { ZodError } from "zod";

type Ctx = { params: Promise<{ id: string }> };

// PUT /api/categories/[id] — cập nhật (admin)
export async function PUT(req: Request, { params }: Ctx) {
  const auth = await requireAuth();
  if ("error" in auth) return auth.error;
  const { id } = await params;

  try {
    const data = categorySchema.parse(await req.json());
    // Slug phải duy nhất (trừ chính nó)
    const dup = await prisma.category.findFirst({
      where: { slug: data.slug, NOT: { id } },
    });
    if (dup) return badRequest("Slug đã tồn tại");

    const category = await prisma.category.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description || null,
        icon: data.icon || null,
        order: data.order ?? 0,
      },
    });
    return ok({ category });
  } catch (err) {
    if (err instanceof ZodError) return zodError(err);
    console.error("update category error", err);
    return serverError();
  }
}

// DELETE /api/categories/[id] — xóa (admin)
export async function DELETE(_req: Request, { params }: Ctx) {
  const auth = await requireAuth();
  if ("error" in auth) return auth.error;
  const { id } = await params;

  const count = await prisma.product.count({ where: { categoryId: id } });
  if (count > 0) {
    return badRequest(
      `Không thể xóa: còn ${count} sản phẩm thuộc danh mục này.`
    );
  }

  try {
    await prisma.category.delete({ where: { id } });
    return ok({ success: true });
  } catch {
    return notFound("Danh mục không tồn tại");
  }
}
