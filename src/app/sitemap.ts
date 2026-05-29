import type { MetadataRoute } from "next";
import { getNewsList, getProducts } from "@/lib/data";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://navico.vn";

// Sitemap động. Hiện đọc từ lớp dữ liệu tĩnh; khi nối DB chỉ cần đổi
// getProducts/getNewsList sang truy vấn Prisma.
export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/gioi-thieu`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/san-pham`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/tin-tuc`, changeFrequency: "daily", priority: 0.8 },
    { url: `${SITE_URL}/hoat-dong`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/tuyen-dung`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${SITE_URL}/lien-he`, changeFrequency: "monthly", priority: 0.6 },
  ];

  const productRoutes: MetadataRoute.Sitemap = getProducts().map((p) => ({
    url: `${SITE_URL}/san-pham/${p.slug}`,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const newsRoutes: MetadataRoute.Sitemap = getNewsList().map((n) => ({
    url: `${SITE_URL}/tin-tuc/${n.slug}`,
    lastModified: new Date(n.publishedAt),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...productRoutes, ...newsRoutes];
}
