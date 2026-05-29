import { prisma } from "@/lib/prisma";
import { activitySchema } from "@/lib/validation";
import { badRequest, created, ok, requireAuth, serverError, zodError } from "@/lib/api";
import { ZodError } from "zod";

// GET /api/activities — danh sách hoạt động (?all=1 cho admin)
export async function GET(req: Request) {
  const all = new URL(req.url).searchParams.get("all") === "1";
  const activities = await prisma.activity.findMany({
    where: all ? {} : { published: true },
    orderBy: { date: "desc" },
  });
  return ok({ activities });
}

// POST /api/activities — thêm hoạt động (admin)
export async function POST(req: Request) {
  const auth = await requireAuth();
  if ("error" in auth) return auth.error;
  try {
    const data = activitySchema.parse(await req.json());
    const dup = await prisma.activity.findUnique({ where: { slug: data.slug } });
    if (dup) return badRequest("Slug đã tồn tại");
    const activity = await prisma.activity.create({
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
    return created({ activity });
  } catch (err) {
    if (err instanceof ZodError) return zodError(err);
    console.error("create activity error", err);
    return serverError();
  }
}
