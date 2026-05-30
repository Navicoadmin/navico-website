import { Storage } from "@google-cloud/storage";
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

const BUCKET_NAME = process.env.GCS_BUCKET_NAME || "navico-uploads";

// POST /api/upload – tải lên 1 file (ảnh hoặc PDF). Chỉ admin.
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

    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload lên Google Cloud Storage
    const storage = new Storage();
    const bucket = storage.bucket(BUCKET_NAME);
    const gcsFile = bucket.file(`uploads/${filename}`);

    await gcsFile.save(buffer, {
      metadata: {
        contentType: file.type,
        cacheControl: "public, max-age=31536000",
      },
    });

    // URL serve qua API proxy của chính website (không cần public bucket)
    const url = `/api/files/${filename}`;
    return created({ url, type: file.type, size: file.size });
  } catch (err) {
    console.error("upload error", err);
    return serverError("Tải lên thất bại");
  }
}

// Tăng giới hạn body cho route này
export const runtime = "nodejs";
