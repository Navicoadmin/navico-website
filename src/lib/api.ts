import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { getCurrentUser, type SessionUser } from "@/lib/auth";

// Helper trả JSON thống nhất cho API routes.

export function ok<T>(data: T, init?: ResponseInit) {
  return NextResponse.json(data, init);
}

export function created<T>(data: T) {
  return NextResponse.json(data, { status: 201 });
}

export function badRequest(message: string, details?: unknown) {
  return NextResponse.json({ message, details }, { status: 400 });
}

export function unauthorized(message = "Chưa đăng nhập") {
  return NextResponse.json({ message }, { status: 401 });
}

export function forbidden(message = "Không có quyền") {
  return NextResponse.json({ message }, { status: 403 });
}

export function notFound(message = "Không tìm thấy") {
  return NextResponse.json({ message }, { status: 404 });
}

export function tooMany(retryAfter: number) {
  return NextResponse.json(
    { message: "Quá nhiều yêu cầu, vui lòng thử lại sau." },
    { status: 429, headers: { "Retry-After": String(retryAfter) } }
  );
}

export function serverError(message = "Lỗi máy chủ") {
  return NextResponse.json({ message }, { status: 500 });
}

// Chuyển lỗi zod thành response 400 dễ đọc
export function zodError(err: ZodError) {
  const first = err.issues[0];
  return badRequest(first?.message || "Dữ liệu không hợp lệ", err.flatten());
}

// Bảo vệ API admin: trả user nếu đã đăng nhập, ngược lại trả null kèm response lỗi.
export async function requireAuth(): Promise<
  { user: SessionUser } | { error: NextResponse }
> {
  const user = await getCurrentUser();
  if (!user) return { error: unauthorized() };
  return { user };
}
