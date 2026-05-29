import { prisma } from "@/lib/prisma";
import { partnerSchema } from "@/lib/validation";
import { created, ok, requireAuth, serverError, zodError } from "@/lib/api";
import { ZodError } from "zod";

// GET /api/partners — danh sách đối tác (công khai)
export async function GET() {
  const partners = await prisma.partner.findMany({ orderBy: { order: "asc" } });
  return ok({ partners });
}

// POST /api/partners — thêm đối tác (admin)
export async function POST(req: Request) {
  const auth = await requireAuth();
  if ("error" in auth) return auth.error;
  try {
    const data = partnerSchema.parse(await req.json());
    const partner = await prisma.partner.create({
      data: {
        name: data.name,
        logo: data.logo,
        url: data.url || null,
        order: data.order ?? 0,
      },
    });
    return created({ partner });
  } catch (err) {
    if (err instanceof ZodError) return zodError(err);
    console.error("create partner error", err);
    return serverError();
  }
}
