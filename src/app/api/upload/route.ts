import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { randomBytes } from "crypto";
import { badRequest, created, requireAuth, serverError } from "@/lib/api";

// Cấu hình upload
const MAX_SIZE = 8 * 1024 * 1024; // 8MB
const ALLOWED: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "application/pdf": ".pdf",
};

// POST /api/upload — tải lên 1 file (ảnh hoặc PDF). Chỉ admin.
export async function POST(req: Request) {
  const auth = await requireAuth();
  if ("error" in auth) return auth.error;

  try {
    const form = await req.formData();
    const file = form.get("file");

    if (!(file instanceof File)) {
      return badRequest("Không tìm thấy file");
    }
    if (file.size === 0) return badRequest("File rỗng");
    if (file.size > MAX_SIZE) {
      return badRequest("File vượt quá 8MB");
    }
    const ext = ALLOWED[file.type];
    if (!ext) {
      return badRequest("Chỉ chấp nhận ảnh (JPG/PNG/WEBP/GIF) hoặc PDF");
    }

    // Tên file ngẫu nhiên để tránh trùng và chống đoán đường dẫn
    const filename = `${Date.now()}-${randomBytes(8).toString("hex")}${ext}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(uploadDir, filename), buffer);

    const url = `/uploads/${filename}`;
    return created({ url, type: file.type, size: file.size });
  } catch (err) {
    console.error("upload error", err);
    return serverError("Tải lên thất bại");
  }
}

// Tăng giới hạn body cho route này
export const runtime = "nodejs";
