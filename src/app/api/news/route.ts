import { prisma } from "@/lib/prisma";
import { newsSchema } from "@/lib/validation";
import { badRequest, created, ok, requireAuth, serverError, zodError } from "@/lib/api";
import { ZodError } from "zod";

// GET /api/news — danh sách tin (công khai). ?all=1 cho admin (gồm chưa publish)
export async function GET(req: Request) {
  const all = new URL(req.url).searchParams.get("all") === "1";
  const news = await prisma.news.findMany({
    where: all ? {} : { published: true },
    orderBy: { publishedAt: "desc" },
  });
  return ok({ news });
}

// POST /api/news — tạo tin (admin)
export async function POST(req: Request) {
  const auth = await requireAuth();
  if ("error" in auth) return auth.error;

  try {
    const data = newsSchema.parse(await req.json());
    const dup = await prisma.news.findUnique({ where: { slug: data.slug } });
    if (dup) return badRequest("Slug đã tồn tại");

    const news = await prisma.news.create({
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
    return created({ news });
  } catch (err) {
    if (err instanceof ZodError) return zodError(err);
    console.error("create news error", err);
    return serverError();
  }
}
