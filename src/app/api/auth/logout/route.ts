import { clearSessionCookie } from "@/lib/auth";
import { ok } from "@/lib/api";

// POST /api/auth/logout — đăng xuất
export async function POST() {
  await clearSessionCookie();
  return ok({ success: true });
}
