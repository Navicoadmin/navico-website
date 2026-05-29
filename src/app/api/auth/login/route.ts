import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validation";
import { signSession, verifyPassword, setSessionCookie } from "@/lib/auth";
import { badRequest, ok, serverError, tooMany, zodError } from "@/lib/api";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { ZodError } from "zod";

// POST /api/auth/login — đăng nhập admin
export async function POST(req: Request) {
  // Chống brute-force: tối đa 5 lần/phút theo IP
  const ip = getClientIp(req);
  const rl = rateLimit(`login:${ip}`, 5, 60_000);
  if (!rl.success) return tooMany(rl.retryAfter);

  try {
    const body = await req.json();
    const { email, password } = loginSchema.parse(body);

    const user = await prisma.user.findUnique({ where: { email } });
    // Thông báo chung để tránh dò email tồn tại
    if (!user || !(await verifyPassword(password, user.passwordHash))) {
      return badRequest("Email hoặc mật khẩu không đúng");
    }

    const sessionUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
    const token = await signSession(sessionUser);
    await setSessionCookie(token);

    return ok({ user: sessionUser });
  } catch (err) {
    if (err instanceof ZodError) return zodError(err);
    console.error("login error", err);
    return serverError();
  }
}
