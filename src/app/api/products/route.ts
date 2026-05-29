import { prisma } from "@/lib/prisma";
import { productSchema } from "@/lib/validation";
import { badRequest, created, ok, requireAuth, serverError, zodError } from "@/lib/api";
import { ZodError } from "zod";

// GET /api/products — danh sách sản phẩm (công khai)
// Hỗ trợ ?category=<slug>&q=<từ khóa>&all=1 (all=1 gồm cả chưa publish, cho admin)
export async function GET(req: Request) {
  const url = new URL(req.url);
  const category = url.searchParams.get("category");
  const q = url.searchParams.get("q");
  const all = url.searchParams.get("all") === "1";

  const products = await prisma.product.findMany({
    where: {
      ...(all ? {} : { published: true }),
      ...(category ? { category: { slug: category } } : {}),
      ...(q
        ? {
            OR: [
              { name: { contains: q, mode: "insensitive" } },
              { shortDescription: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    include: { category: true },
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
  });
  return ok({ products });
}

// POST /api/products — tạo sản phẩm (admin)
export async function POST(req: Request) {
  const auth = await requireAuth();
  if ("error" in auth) return auth.error;

  try {
    const data = productSchema.parse(await req.json());

    const dup = await prisma.product.findFirst({
      where: { OR: [{ slug: data.slug }, { code: data.code }] },
    });
    if (dup) return badRequest("Slug hoặc mã sản phẩm đã tồn tại");

    const product = await prisma.product.create({
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
    return created({ product });
  } catch (err) {
    if (err instanceof ZodError) return zodError(err);
    console.error("create product error", err);
    return serverError();
  }
}
