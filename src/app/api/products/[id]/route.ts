import { prisma } from "@/lib/prisma";
import { productSchema } from "@/lib/validation";
import { badRequest, ok, notFound, requireAuth, serverError, zodError } from "@/lib/api";
import { ZodError } from "zod";

type Ctx = { params: Promise<{ id: string }> };

// GET /api/products/[id] — chi tiết (admin dùng để sửa)
export async function GET(_req: Request, { params }: Ctx) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: { category: true, faqs: { orderBy: { order: "asc" } } },
  });
  if (!product) return notFound("Sản phẩm không tồn tại");
  return ok({ product });
}

// PUT /api/products/[id] — cập nhật (admin)
export async function PUT(req: Request, { params }: Ctx) {
  const auth = await requireAuth();
  if ("error" in auth) return auth.error;
  const { id } = await params;

  try {
    const data = productSchema.parse(await req.json());

    const dup = await prisma.product.findFirst({
      where: {
        OR: [{ slug: data.slug }, { code: data.code }],
        NOT: { id },
      },
    });
    if (dup) return badRequest("Slug hoặc mã sản phẩm đã tồn tại");

    // Cập nhật sản phẩm + thay toàn bộ FAQ (xóa cũ, tạo mới) trong 1 transaction
    const product = await prisma.$transaction(async (tx) => {
      await tx.productFaq.deleteMany({ where: { productId: id } });
      return tx.product.update({
        where: { id },
        data: {
          name: data.name,
          slug: data.slug,
          code: data.code,
          categoryId: data.categoryId,
          shortDescription: data.shortDescription,
          activeIngredients: data.activeIngredients || null,
          benefits: data.benefits || null,
          usageInstructions: data.usageInstructions || null,
          dosage: data.dosage || null,
          heroImage: data.heroImage || null,
          gallery: data.gallery ?? [],
          subBrandLogo: data.subBrandLogo || null,
          metaTitle: data.metaTitle || null,
          metaDescription: data.metaDescription || null,
          featured: data.featured ?? false,
          published: data.published ?? true,
          faqs: data.faqs?.length
            ? {
                create: data.faqs.map((f, i) => ({
                  question: f.question,
                  answer: f.answer,
                  order: i,
                })),
              }
            : undefined,
        },
      });
    });
    return ok({ product });
  } catch (err) {
    if (err instanceof ZodError) return zodError(err);
    console.error("update product error", err);
    return serverError();
  }
}

// DELETE /api/products/[id] — xóa (admin)
export async function DELETE(_req: Request, { params }: Ctx) {
  const auth = await requireAuth();
  if ("error" in auth) return auth.error;
  const { id } = await params;

  try {
    await prisma.product.delete({ where: { id } });
    return ok({ success: true });
  } catch {
    return notFound("Sản phẩm không tồn tại");
  }
}
