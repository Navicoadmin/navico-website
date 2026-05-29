import { prisma } from "@/lib/prisma";
import { newsSchema } from "@/lib/validation";
import { badRequest, ok, notFound, requireAuth, serverError, zodError } from "@/lib/api";
import { ZodError } from "zod";

type Ctx = { params: Promise<{ id: string }> };

// GET /api/news/[id] — chi tiết (admin)
export async function GET(_req: Request, { params }: Ctx) {
  const { id } = await params;
  const news = await prisma.news.findUnique({ where: { id } });
  if (!news) return notFound("Bài viết không tồn tại");
  return ok({ news });
}

// PUT /api/news/[id] — cập nhật (admin)
export async function PUT(req: Request, { params }: Ctx) {
  const auth = await requireAuth();
  if ("error" in auth) return auth.error;
  const { id } = await params;

  try {
    const data = newsSchema.parse(await req.json());
    const dup = await prisma.news.findFirst({
      where: { slug: data.slug, NOT: { id } },
    });
    if (dup) return badRequest("Slug đã tồn tại");

    const news = await prisma.news.update({
      where: { id },
      data: {
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        content: data.content,
        coverImage: data.coverImage || null,
        tag: data.tag || null,
        author: data.author || "Navico",
        published: data.published ?? true,
        metaTitle: data.metaTitle || null,
        metaDescription: data.metaDescription || null,
      },
    });
    return ok({ news });
  } catch (err) {
    if (err instanceof ZodError) return zodError(err);
    console.error("update news error", err);
    return serverError();
  }
}

// DELETE /api/news/[id] — xóa (admin)
export async function DELETE(_req: Request, { params }: Ctx) {
  const auth = await requireAuth();
  if ("error" in auth) return auth.error;
  const { id } = await params;

  try {
    await prisma.news.delete({ where: { id } });
    return ok({ success: true });
  } catch {
    return notFound("Bài viết không tồn tại");
  }
}
