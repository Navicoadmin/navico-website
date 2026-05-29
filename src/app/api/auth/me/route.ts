import { getCurrentUser } from "@/lib/auth";
import { ok, unauthorized } from "@/lib/api";

// GET /api/auth/me — thông tin tài khoản đang đăng nhập
export async function GET() {
  const user = await getCurrentUser();
  if (!user) return unauthorized();
  return ok({ user });
}
