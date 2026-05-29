#!/usr/bin/env bash
# Script deploy/cập nhật NAVICO trên VPS Linux.
# Dùng: bash deploy.sh   (chạy tại thư mục gốc repo, sau khi đã có file .env)
set -euo pipefail

cd "$(dirname "$0")"

if [ ! -f .env ]; then
  echo "❌ Chưa có file .env. Hãy: cp .env.example .env && nano .env"
  exit 1
fi

echo "==> 1/4 Cài dependencies (npm ci)"
npm ci

echo "==> 2/4 Áp dụng migration vào database"
npx prisma migrate deploy

echo "==> 3/4 Build production"
npm run build

echo "==> 4/4 Khởi động ứng dụng"
if command -v pm2 >/dev/null 2>&1; then
  if pm2 describe navico >/dev/null 2>&1; then
    pm2 restart navico
  else
    pm2 start npm --name navico -- start
  fi
  pm2 save
  echo "✔ Đã chạy qua PM2 (cổng 3000). Xem log: pm2 logs navico"
else
  echo "⚠ Chưa cài PM2. Cài bằng: sudo npm i -g pm2  rồi chạy lại."
  echo "  Hoặc chạy tạm: npm start"
fi
