import { Storage } from "@google-cloud/storage";
import { NextResponse } from "next/server";

const BUCKET_NAME = process.env.GCS_BUCKET_NAME || "navico-uploads";

// GET /api/files/[filename] - proxy anh tu GCS ve client
export async function GET(
    _req: Request,
  { params }: { params: Promise<{ filename: string }> }
  ) {
    try {
          const { filename } = await params;

      // Sanitize filename
      if (!filename || !/^[\w\-\.]+$/.test(filename)) {
              return new NextResponse("Not found", { status: 404 });
      }

      const storage = new Storage();
          const bucket = storage.bucket(BUCKET_NAME);
          const file = bucket.file(`uploads/${filename}`);

      // Check file exists
      const [exists] = await file.exists();
          if (!exists) {
                  return new NextResponse("Not found", { status: 404 });
          }

      // Get metadata for content type
      const [metadata] = await file.getMetadata();
          const contentType = (metadata.contentType as string) || "application/octet-stream";

      // Download file
      const [buffer] = await file.download();

      return new NextResponse(new Uint8Array(buffer), {
              status: 200,
              headers: {
                        "Content-Type": contentType,
                        "Cache-Control": "public, max-age=31536000, immutable",
                        "Content-Length": String(buffer.length),
              },
      });
    } catch (err) {
          console.error("file proxy error", err);
          return new NextResponse("Internal error", { status: 500 });
    }
}
