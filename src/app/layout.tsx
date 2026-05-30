import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";

// Font Be Vietnam Pro: tối ưu hiển thị tiếng Việt, hỗ trợ đầy đủ dấu
const beVietnam = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-be-vietnam",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://navico.vn";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "NAVICO | Giải pháp Thủy sản & Công nghệ Sinh học",
    template: "%s | NAVICO",
  },
  description:
    "Navico cung cấp giải pháp dinh dưỡng, men vi sinh, khoáng chất và công nghệ sinh học cho ngành nuôi trồng thủy sản, hướng đến hiệu quả và phát triển bền vững.",
  keywords: [
    "men vi sinh",
    "thủy sản",
    "nuôi tôm",
    "nuôi cá",
    "dinh dưỡng thủy sản",
    "xử lý nước ao nuôi",
    "Navico",
  ],
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: siteUrl,
    siteName: "NAVICO",
    title: "NAVICO | Giải pháp Thủy sản & Công nghệ Sinh học",
    description:
      "Giải pháp dinh dưỡng, men vi sinh và công nghệ sinh học cho ngành nuôi trồng thủy sản.",
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1500,
        height: 788,
        alt: "NAVICO - Giải pháp Thủy sản & Công nghệ Sinh học",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NAVICO | Giải pháp Thủy sản & Công nghệ Sinh học",
    description:
      "Giải pháp dinh dưỡng, men vi sinh và công nghệ sinh học cho ngành nuôi trồng thủy sản.",
    images: [`${siteUrl}/og-image.png`],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi" className={beVietnam.variable}>
      <head>
        {/* Icon font Material Symbols (dùng xuyên suốt giao diện) */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        />
      </head>
      <body className="font-sans">{children}</body>
    </html>
  );
}
