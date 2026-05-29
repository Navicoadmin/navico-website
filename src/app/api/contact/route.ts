import { prisma } from "@/lib/prisma";
import { contactSchema } from "@/lib/validation";
import { created, ok, serverError, tooMany, zodError, requireAuth } from "@/lib/api";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { ZodError } from "zod";

// POST /api/contact — gửi liên hệ (công khai, có rate limit)
export async function POST(req: Request) {
  const ip = getClientIp(req);
  const rl = rateLimit(`contact:${ip}`, 3, 60_000); // tối đa 3 lần/phút
  if (!rl.success) return tooMany(rl.retryAfter);

  try {
    const body = await req.json();
    const data = contactSchema.parse(body);

    await prisma.contactMessage.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        message: data.message,
      },
    });

    return created({ success: true });
  } catch (err) {
    if (err instanceof ZodError) return zodError(err);
    console.error("contact error", err);
    return serverError();
  }
}

// GET /api/contact — danh sách tin nhắn (chỉ admin)
export async function GET() {
  const auth = await requireAuth();
  if ("error" in auth) return auth.error;

  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
  });
  return ok({ messages });
}
