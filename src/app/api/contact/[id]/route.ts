import { prisma } from "@/lib/prisma";
import { ok, notFound, requireAuth } from "@/lib/api";

type Ctx = { params: Promise<{ id: string }> };

// PATCH /api/contact/[id] — đánh dấu đã/chưa xử lý (admin)
export async function PATCH(req: Request, { params }: Ctx) {
  const auth = await requireAuth();
  if ("error" in auth) return auth.error;
  const { id } = await params;

  const body = await req.json().catch(() => ({}));
  const handled = Boolean(body.handled);

  try {
    const message = await prisma.contactMessage.update({
      where: { id },
      data: { handled },
    });
    return ok({ message });
  } catch {
    return notFound("Tin nhắn không tồn tại");
  }
}

// DELETE /api/contact/[id] — xóa tin nhắn (admin)
export async function DELETE(_req: Request, { params }: Ctx) {
  const auth = await requireAuth();
  if ("error" in auth) return auth.error;
  const { id } = await params;

  try {
    await prisma.contactMessage.delete({ where: { id } });
    return ok({ success: true });
  } catch {
    return notFound("Tin nhắn không tồn tại");
  }
}
