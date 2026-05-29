import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { SESSION_COOKIE } from "@/lib/constants";

// Middleware bảo vệ khu vực /admin. Chạy trên edge runtime nên dùng jose
// (không dùng bcrypt/Prisma ở đây).

const PUBLIC_ADMIN_PATHS = ["/admin/login"];

async function isValidToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    await jwtVerify(token, secret);
    return true;
  } catch {
    return false;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const valid = await isValidToken(token);

  const isLoginPage = PUBLIC_ADMIN_PATHS.some((p) => pathname.startsWith(p));

  // Đã đăng nhập mà vào trang login -> chuyển vào dashboard
  if (isLoginPage && valid) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  // Chưa đăng nhập mà vào trang admin (trừ login) -> chuyển ra login
  if (!isLoginPage && !valid) {
    const loginUrl = new URL("/admin/login", req.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  // Chỉ áp dụng cho /admin (không gồm API admin, API tự kiểm tra riêng)
  matcher: ["/admin/:path*"],
};
