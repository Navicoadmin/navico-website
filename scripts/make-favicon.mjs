// Tạo favicon vuông từ biểu tượng nguyên tử (phần bên trái logo.png).
import sharp from "sharp";
import { mkdir } from "fs/promises";

const SRC = "public/logo.png";

const meta = await sharp(SRC).metadata();
console.log("logo:", meta.width + "x" + meta.height);

// Cắt phần biểu tượng nguyên tử bên trái (trước chữ NAVICO), rồi trim viền trong suốt
const cropped = await sharp(SRC)
  .extract({ left: 0, top: 0, width: 128, height: meta.height })
  .png()
  .toBuffer();
const atom = await sharp(cropped).trim().png().toBuffer();

async function build(size, out, bg) {
  const pad = Math.round(size * 0.12);
  await sharp(atom)
    .resize(size - pad * 2, size - pad * 2, {
      fit: "contain",
      background: { r: 255, g: 255, b: 255, alpha: 0 },
    })
    .extend({ top: pad, bottom: pad, left: pad, right: pad, background: bg })
    .flatten({ background: bg })
    .png()
    .toFile(out);
  console.log("written", out);
}

await mkdir("src/app", { recursive: true });
const white = { r: 255, g: 255, b: 255 };
// icon.png cho favicon (Next tự nhận), apple-icon cho iOS, bản preview để xem
await build(512, "src/app/icon.png", white);
await build(180, "src/app/apple-icon.png", white);
await build(256, "public/_fav_preview.png", white);
