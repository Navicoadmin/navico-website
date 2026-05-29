# Hướng dẫn triển khai NAVICO lên VPS Linux

Tài liệu này hướng dẫn deploy website NAVICO (Next.js + PostgreSQL + Prisma) lên
VPS chạy **Ubuntu 22.04 / 24.04**. Stack: Node.js 20, PostgreSQL 16, PM2, Nginx,
HTTPS (Let's Encrypt).

> Giai đoạn này CHƯA bao gồm Docker/CI-CD và backup (để giai đoạn 2).

---

## 1. Chuẩn bị VPS

```bash
# Cập nhật hệ thống
sudo apt update && sudo apt upgrade -y

# Công cụ cơ bản
sudo apt install -y curl git build-essential ufw
```

### Tường lửa (mở SSH, HTTP, HTTPS)
```bash
sudo ufw allow OpenSSH
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

---

## 2. Cài Node.js 20 LTS

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node -v   # v20.x
```

---

## 3. Cài & cấu hình PostgreSQL

```bash
sudo apt install -y postgresql postgresql-contrib
sudo systemctl enable --now postgresql
```

Tạo database và user riêng cho ứng dụng:
```bash
sudo -u postgres psql
```
Trong psql:
```sql
CREATE USER navico WITH PASSWORD 'doi_mat_khau_manh_o_day';
CREATE DATABASE navico OWNER navico;
GRANT ALL PRIVILEGES ON DATABASE navico TO navico;
\q
```

Chuỗi kết nối sẽ là:
```
postgresql://navico:doi_mat_khau_manh_o_day@localhost:5432/navico?schema=public
```

---

## 4. Lấy mã nguồn & cấu hình môi trường

```bash
# Tạo thư mục deploy
sudo mkdir -p /var/www/navico && sudo chown $USER:$USER /var/www/navico
cd /var/www/navico

# Đưa mã nguồn lên (git clone hoặc scp). Mã nguồn nằm trong thư mục web/
git clone <REPO_URL> .
cd web
```

Tạo file `.env` (dựa trên `.env.example`):
```bash
cp .env.example .env
nano .env
```
Nội dung `.env` cho production:
```env
DATABASE_URL="postgresql://navico:doi_mat_khau_manh_o_day@localhost:5432/navico?schema=public"
NEXT_PUBLIC_SITE_URL="https://navico.vn"
JWT_SECRET="<chuoi-ngau-nhien-rat-dai>"   # tạo bằng: openssl rand -base64 48
SESSION_MAX_AGE="604800"
ADMIN_EMAIL="admin@navico.vn"
ADMIN_PASSWORD="<mat-khau-admin-manh>"
```

> ⚠️ Đổi `JWT_SECRET` và `ADMIN_PASSWORD` thành giá trị mạnh. Tạo secret:
> `openssl rand -base64 48`

---

## 5. Cài dependencies, migrate DB, seed, build

```bash
# Cài gói (npm ci dùng đúng phiên bản trong package-lock)
npm ci

# Áp dụng schema vào DB production
npx prisma migrate deploy

# Seed dữ liệu ban đầu (tạo tài khoản admin + dữ liệu mẫu)
npm run db:seed

# Build production
npm run build
```

> Sau lần seed đầu tiên, nên **đăng nhập admin và đổi mật khẩu** (hoặc bỏ
> `ADMIN_PASSWORD` khỏi `.env`).

---

## 6. Chạy ứng dụng với PM2

```bash
sudo npm install -g pm2

# Khởi động (Next.js mặc định cổng 3000)
pm2 start npm --name navico -- start

# Tự khởi động lại khi reboot
pm2 startup systemd      # chạy lệnh mà nó in ra
pm2 save
```

Kiểm tra:
```bash
pm2 status
pm2 logs navico
curl http://localhost:3000
```

---

## 7. Nginx reverse proxy

```bash
sudo apt install -y nginx
sudo nano /etc/nginx/sites-available/navico
```

Nội dung:
```nginx
server {
    listen 80;
    server_name navico.vn www.navico.vn;

    # Giới hạn kích thước upload (ảnh/PDF tối đa 8MB)
    client_max_body_size 10M;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Kích hoạt:
```bash
sudo ln -s /etc/nginx/sites-available/navico /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

> `X-Forwarded-For` cần thiết để rate-limit nhận đúng IP client.

---

## 8. HTTPS với Let's Encrypt

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d navico.vn -d www.navico.vn
```

Certbot tự cấu hình HTTPS và gia hạn tự động. Kiểm tra gia hạn:
```bash
sudo certbot renew --dry-run
```

---

## 9. Thư mục upload (ảnh/PDF)

Ảnh tải lên qua admin được lưu tại `web/public/uploads/`. Khi deploy lại:

- **KHÔNG** xóa thư mục này (chứa file người dùng đã tải).
- Đảm bảo quyền ghi cho user chạy app:
  ```bash
  mkdir -p /var/www/navico/web/public/uploads
  chmod 775 /var/www/navico/web/public/uploads
  ```
- Nên sao lưu định kỳ cùng với database (giai đoạn 2 sẽ có hướng dẫn backup).

---

## 10. Cập nhật phiên bản mới

```bash
cd /var/www/navico/web
git pull
npm ci
npx prisma migrate deploy   # nếu có thay đổi schema
npm run build
pm2 restart navico
```

---

## Phụ lục: Lệnh hữu ích

| Mục đích | Lệnh |
|----------|------|
| Xem log app | `pm2 logs navico` |
| Restart app | `pm2 restart navico` |
| Xem DB bằng GUI | `npm run db:studio` (chỉ dùng khi cần, mở cổng tạm) |
| Tạo migration mới (dev) | `npm run db:migrate` |
| Kiểm tra Nginx | `sudo nginx -t && sudo systemctl reload nginx` |

## Checklist bảo mật trước khi go-live
- [ ] Đổi `JWT_SECRET` thành chuỗi ngẫu nhiên dài
- [ ] Đổi mật khẩu admin (không để mật khẩu seed mặc định)
- [ ] `NEXT_PUBLIC_SITE_URL` trỏ đúng domain HTTPS
- [ ] PostgreSQL chỉ lắng nghe `localhost` (mặc định)
- [ ] Tường lửa (ufw) đã bật, chỉ mở 22/80/443
- [ ] Đã có chứng chỉ SSL (HTTPS hoạt động)
