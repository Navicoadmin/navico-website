// Rate limit đơn giản theo IP, lưu trong bộ nhớ (token bucket / cửa sổ cố định).
// Phù hợp cho 1 instance VPS. Khi scale nhiều instance nên thay bằng Redis.

type Bucket = { count: number; resetAt: number };
const store = new Map<string, Bucket>();

// Dọn bucket hết hạn định kỳ để tránh rò rỉ bộ nhớ
let lastSweep = Date.now();
function sweep(now: number) {
  if (now - lastSweep < 60_000) return;
  lastSweep = now;
  for (const [key, b] of store) {
    if (b.resetAt <= now) store.delete(key);
  }
}

export type RateLimitResult = {
  success: boolean;
  remaining: number;
  retryAfter: number; // giây
};

/**
 * @param key    Định danh (thường là IP + tên route)
 * @param limit  Số request tối đa trong cửa sổ
 * @param windowMs Độ dài cửa sổ (ms)
 */
export function rateLimit(
  key: string,
  limit = 5,
  windowMs = 60_000
): RateLimitResult {
  const now = Date.now();
  sweep(now);

  const bucket = store.get(key);
  if (!bucket || bucket.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { success: true, remaining: limit - 1, retryAfter: 0 };
  }

  if (bucket.count >= limit) {
    return {
      success: false,
      remaining: 0,
      retryAfter: Math.ceil((bucket.resetAt - now) / 1000),
    };
  }

  bucket.count += 1;
  return { success: true, remaining: limit - bucket.count, retryAfter: 0 };
}

// Lấy IP client từ request (qua proxy/Nginx)
export function getClientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "unknown";
}
