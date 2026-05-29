# NAVICO — Website thủy sản & công nghệ sinh học

Website chính thức của NAVICO: giới thiệu công ty, sản phẩm (men vi sinh, dinh dưỡng, khoáng, xử lý nước...), tin tức kỹ thuật, tuyển dụng, hoạt động, liên hệ — kèm trang quản trị `/admin` và chatbot AI tư vấn.

## Công nghệ
- **Next.js 15** (App Router) + **TypeScript** + **Tailwind CSS v3**
- **PostgreSQL** + **Prisma ORM**
- Auth JWT (jose) + bcrypt, upload ảnh/PDF, rate limit, validate zod
- Chatbot AI qua OpenAI (tùy chọn, cấu hình bằng `OPENAI_API_KEY`)
- Font Be Vietnam Pro, SEO (sitemap/robots/metadata/OG)

## Chạy ở môi trường dev
```bash
npm ci
cp .env.example .env          # điền DATABASE_URL, JWT_SECRET, ...
npx prisma migrate dev        # tạo bảng
npm run db:seed               # tạo admin + dữ liệu mẫu
npm run dev                   # http://localhost:3000
```

Tài khoản admin mặc định (sau seed): `admin@navico.vn` / `Navico@123` — **đổi mật khẩu khi lên production**.

## Triển khai production
Xem hướng dẫn chi tiết trong [DEPLOY.md](./DEPLOY.md) (VPS Linux: Node 20 + PostgreSQL + PM2 + Nginx + SSL).

## Biến môi trường
Xem [.env.example](./.env.example). Lưu ý: KHÔNG commit file `.env` thật.


## Production

Deployed on Google Cloud Run at https://navico.vn
