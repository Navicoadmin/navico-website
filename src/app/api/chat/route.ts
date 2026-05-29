import { prisma } from "@/lib/prisma";
import { chatSchema } from "@/lib/validation";
import { badRequest, ok, serverError, tooMany, zodError } from "@/lib/api";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { siteConfig } from "@/lib/site";
import { ZodError } from "zod";

const MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

// Xây ngữ cảnh về Navico để AI trả lời chính xác (lấy sản phẩm từ DB).
async function buildSystemPrompt(): Promise<string> {
  const products = await prisma.product.findMany({
    where: { published: true },
    select: { name: true, shortDescription: true, category: { select: { name: true } } },
    take: 30,
  });
  const lines = products
    .map((p) => `- ${p.name} (${p.category.name}): ${p.shortDescription}`)
    .join("\n");

  return `Bạn là trợ lý tư vấn của NAVICO - công ty cung cấp giải pháp dinh dưỡng, men vi sinh, khoáng chất, xử lý nước và công nghệ sinh học cho ngành nuôi trồng thủy sản (tôm, cá) tại Việt Nam.

Nhiệm vụ:
- Tư vấn sản phẩm, kỹ thuật nuôi, xử lý môi trường ao nuôi một cách thân thiện, chuyên nghiệp.
- Trả lời NGẮN GỌN, bằng tiếng Việt, dễ hiểu cho người nuôi.
- Chỉ tư vấn trong phạm vi thủy sản/sản phẩm Navico. Nếu hỏi ngoài phạm vi, lịch sự từ chối và hướng về chủ đề thủy sản.
- Khi cần báo giá hoặc tư vấn sâu, hướng dẫn liên hệ Hotline ${siteConfig.hotline} hoặc email ${siteConfig.email}.
- KHÔNG bịa đặt thông tin sản phẩm không có trong danh sách. Nếu không chắc, đề nghị liên hệ chuyên gia.

Danh sách sản phẩm hiện có:
${lines || "(đang cập nhật)"}

Thông tin liên hệ: Hotline ${siteConfig.hotline}, Email ${siteConfig.email}, Địa chỉ ${siteConfig.address}.`;
}

// POST /api/chat — chatbox AI (OpenAI). Công khai, có rate limit.
export async function POST(req: Request) {
  const ip = getClientIp(req);
  const rl = rateLimit(`chat:${ip}`, 15, 60_000); // 15 tin/phút/IP
  if (!rl.success) return tooMany(rl.retryAfter);

  try {
    const { messages } = chatSchema.parse(await req.json());

    const apiKey = process.env.OPENAI_API_KEY;
    // Chưa cấu hình key -> trả lời nhã nhặn thay vì lỗi
    if (!apiKey) {
      return ok({
        reply: `Xin lỗi, trợ lý AI đang được cấu hình. Vui lòng liên hệ Hotline ${siteConfig.hotline} hoặc email ${siteConfig.email} để được hỗ trợ ngay.`,
        configured: false,
      });
    }

    const system = await buildSystemPrompt();

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 500,
        temperature: 0.4,
        messages: [{ role: "system", content: system }, ...messages],
      }),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error("openai error", res.status, detail);
      // Trả lời nhã nhặn cho người dùng cuối (không phơi lỗi kỹ thuật)
      return ok({
        reply: `Xin lỗi, trợ lý đang bận. Vui lòng liên hệ Hotline ${siteConfig.hotline} hoặc email ${siteConfig.email} để được hỗ trợ ngay.`,
        configured: true,
      });
    }

    const data = await res.json();
    const reply =
      data?.choices?.[0]?.message?.content?.trim() ||
      "Xin lỗi, tôi chưa có câu trả lời phù hợp.";

    return ok({ reply, configured: true });
  } catch (err) {
    if (err instanceof ZodError) return zodError(err);
    console.error("chat error", err);
    return serverError();
  }
}
