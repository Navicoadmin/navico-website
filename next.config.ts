import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output standalone giúp deploy gọn nhẹ lên VPS (chỉ cần .next/standalone)
  output: "standalone",
  images: {
    remotePatterns: [
      // Ảnh seed tạm thời từ Google (sẽ thay bằng ảnh upload thật)
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;
