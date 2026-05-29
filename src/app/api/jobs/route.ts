import { prisma } from "@/lib/prisma";
import { jobSchema } from "@/lib/validation";
import { badRequest, created, ok, requireAuth, serverError, zodError } from "@/lib/api";
import { ZodError } from "zod";

// GET /api/jobs — danh sách vị trí (?all=1 cho admin)
export async function GET(req: Request) {
  const all = new URL(req.url).searchParams.get("all") === "1";
  const jobs = await prisma.job.findMany({
    where: all ? {} : { published: true },
    orderBy: { order: "asc" },
  });
  return ok({ jobs });
}

// POST /api/jobs — thêm vị trí (admin)
export async function POST(req: Request) {
  const auth = await requireAuth();
  if ("error" in auth) return auth.error;
  try {
    const data = jobSchema.parse(await req.json());
    const dup = await prisma.job.findUnique({ where: { slug: data.slug } });
    if (dup) return badRequest("Slug đã tồn tại");
    const job = await prisma.job.create({
      data: {
        title: data.title,
        slug: data.slug,
        department: data.department || null,
        type: data.type || null,
        location: data.location || null,
        description: data.description || null,
        published: data.published ?? true,
        order: data.order ?? 0,
      },
    });
    return created({ job });
  } catch (err) {
    if (err instanceof ZodError) return zodError(err);
    console.error("create job error", err);
    return serverError();
  }
}
