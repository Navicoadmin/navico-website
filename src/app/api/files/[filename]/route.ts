import { Storage } from "@google-cloud/storage";
import { NextResponse } from "next/server";

const BUCKET_NAME = process.env.GCS_BUCKET_NAME || "navico-uploads";

// GET /api/files/[filename] – proxy ảnh từ GCS về client
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;

    // Sanitize filename - chỉ cho phép ký tự an toàn
    if (!filename || !/^[\w\-\.]+$/.test(filename)) {
      return new NextResponse("Not found", { status: 404 });
    }

    const storage = new Storage();
    const bucket = storage.bucket(BUCKET_NAME);
    const file = bucket.file(`uploads/${filename}`);

    // Kiểm tra file tồn tại
    const [exists] = await file.exists();
    if (!exists) {
      return new NextResponse("Not found", { status: 404 });
    }

    // Lấy metadata để biết content type
    const [metadata] = await file.getMetadata();
    const contentType = (metadata.contentType as string) || "application/octet-stream";

    // Stream file về client
    const [buffer] = await file.download();

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
        "Content-Length": String(buffer.length),
      },
    });
  } catch (err) {
    console.error("file proxy error", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export const runtime = "nodejs";
