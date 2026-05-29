// Lớp dữ liệu tạm thời (in-memory) cho các trang public.
// Khi backend sẵn sàng, chỉ cần thay thân các hàm getXxx bằng truy vấn Prisma;
// chữ ký hàm giữ nguyên nên các trang không phải sửa.

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
};

export type ProductFaq = { question: string; answer: string };

export type DosageRow = {
  stage: string;
  dose: string;
  frequency: string;
  warning?: boolean;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  code: string;
  categorySlug: string;
  shortDescription: string;
  badge?: string;
  tagline?: string;
  activeIngredients: { name: string; effect: string; icon: string }[];
  benefits: { title: string; desc: string; icon: string }[];
  dosage: DosageRow[];
  usageNote?: string;
  warningNote?: string;
  heroImage: string;
  gallery: string[];
  faqs: ProductFaq[];
  featured: boolean;
};

export type News = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  tag: string;
  author: string;
  views: number;
  publishedAt: string; // ISO date
};

const IMG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCXOmb90289xgi4p18HYAZcBxGfrY5hL7m74U48faY6nWA5ZJMdH8o1PaJFQK6_byEbqj9m4y6fk5_2-nw1fMgdFpXCdA-FzXAmaKFIn2YjeFFaBjtx6HX11GnJyBljGNOI9YyyS7GT9bQQn9Kuda23YHw13GNBeK6AWUBdUUyy7cFbdfs53wpgjMEgvyrJlpoDeMUPui1SUQZzJijQOSUtkpTZM9RGV7kLYHJPk-ZqEMecw4LXrFvTpw0VOO_6bQyyJmtvQWXDj5Y";

const categories: Category[] = [
  {
    id: "c1",
    name: "Men vi sinh",
    slug: "men-vi-sinh",
    icon: "biotech",
    description:
      "Ứng dụng công nghệ lợi khuẩn đa dòng, tối ưu hóa hệ tiêu hóa và môi trường ao nuôi.",
  },
  {
    id: "c2",
    name: "Dinh dưỡng",
    slug: "dinh-duong",
    icon: "set_meal",
    description:
      "Hỗn hợp vitamin và acid amin thiết yếu cho sự tăng trưởng vượt trội.",
  },
  {
    id: "c3",
    name: "Khoáng chất",
    slug: "khoang-chat",
    icon: "water_drop",
    description:
      "Cân bằng khoáng vi lượng đa lượng, đặc biệt hiệu quả trong mùa mưa.",
  },
  {
    id: "c4",
    name: "Xử lý nước",
    slug: "xu-ly-nuoc",
    icon: "filter_alt",
    description:
      "Khử phèn, kim loại nặng và kiểm soát nồng độ khí độc trong ao nuôi an toàn.",
  },
  {
    id: "c5",
    name: "Tăng cường miễn dịch",
    slug: "tang-cuong-mien-dich",
    icon: "vaccines",
    description:
      "Beta-glucan và thảo dược tự nhiên giúp vật nuôi chống chọi mầm bệnh.",
  },
  {
    id: "c6",
    name: "Phụ gia",
    slug: "phu-gia",
    icon: "science",
    description:
      "Các hoạt chất chuyên biệt tối ưu hóa khả năng hấp thụ và chuyển hóa thức ăn.",
  },
];

const products: Product[] = [
  {
    id: "p1",
    name: "NaVibac 5F",
    slug: "navibac-5f",
    code: "NAV-BIO-5F",
    categorySlug: "men-vi-sinh",
    featured: true,
    badge: "Sản phẩm chủ lực",
    tagline:
      "Giải pháp Vi sinh 5 thành phần chuyên biệt cho môi trường ao nuôi",
    shortDescription:
      "Công thức đột phá kết hợp lợi khuẩn mật độ cao và enzyme sinh học, tối ưu môi trường nước, bảo vệ sức khỏe vật nuôi từ giai đoạn giống đến thu hoạch.",
    activeIngredients: [
      {
        name: "Bacillus subtilis",
        effect: "Phân hủy chất hữu cơ nhanh chóng",
        icon: "biotech",
      },
      {
        name: "Bacillus licheniformis",
        effect: "Cạnh tranh vi khuẩn gây hại",
        icon: "microbiology",
      },
      {
        name: "Nitrosomonas spp",
        effect: "Oxy hóa Amoniac (NH3)",
        icon: "waves",
      },
      {
        name: "Nitrobacter spp",
        effect: "Chuyển hóa Nitrit (NO2-)",
        icon: "filter_alt",
      },
    ],
    benefits: [
      {
        title: "Xử lý mùn bã",
        desc: "Phân hủy nhanh thức ăn thừa, xác tảo và chất thải, làm sạch nền đáy ao bền vững.",
        icon: "cleaning_services",
      },
      {
        title: "Kiểm soát khí độc",
        desc: "Ngăn chặn và triệt tiêu NH3, NO2 và H2S, giúp tôm cá tránh nổi đầu, sốc môi trường.",
        icon: "dangerous",
      },
      {
        title: "Ổn định hệ vi sinh",
        desc: "Thiết lập hệ vi sinh có lợi áp đảo mầm bệnh Vibrio, ổn định màu nước và chỉ số thủy hóa.",
        icon: "shield_with_heart",
      },
    ],
    dosage: [
      {
        stage: "Chuẩn bị ao nuôi",
        dose: "500g / 2.000 m³ nước",
        frequency: "Xử lý trước khi thả giống 2 ngày",
      },
      {
        stage: "Tháng nuôi đầu tiên",
        dose: "250g / 2.000 m³ nước",
        frequency: "Định kỳ 7-10 ngày/lần",
      },
      {
        stage: "Tháng thứ 2 đến thu hoạch",
        dose: "500g / 2.000 m³ nước",
        frequency: "Định kỳ 5-7 ngày/lần",
      },
      {
        stage: "Ao ô nhiễm nặng / khí độc cao",
        dose: "1kg / 2.000 m³ nước",
        frequency: "Dùng 2 liều liên tiếp cách nhau 24h",
        warning: true,
      },
    ],
    usageNote:
      "Hòa tan sản phẩm với 50 lít nước ao, sục khí mạnh trong 2-4 giờ trước khi tạt xuống ao để kích hoạt vi sinh.",
    warningNote:
      "Không sử dụng cùng lúc với thuốc sát trùng hoặc kháng sinh trong vòng 48 giờ.",
    heroImage: IMG,
    gallery: [IMG],
    faqs: [
      {
        question: "Tại sao nên sục khí NaVibac 5F trước khi dùng?",
        answer:
          "Việc sục khí giúp đánh thức các bào tử vi sinh đang ở trạng thái ngủ, để chúng bắt đầu trao đổi chất và nhân sinh khối, hoạt động ngay khi xuống ao.",
      },
      {
        question: "Sản phẩm có an toàn cho tôm giai đoạn ấu trùng không?",
        answer:
          "Hoàn toàn an toàn. Các chủng Bacillus và Nitrosomonas được chọn lọc kỹ, không gây hại ở bất kỳ giai đoạn nào, còn giúp ổn định đường ruột.",
      },
      {
        question: "Dùng bao lâu thì thấy hiệu quả giảm khí độc?",
        answer:
          "Thông thường chỉ số NH3/NO2 bắt đầu giảm rõ sau 24-48 giờ. Với ao ô nhiễm nặng, hiệu quả thấy rõ qua màu nước ổn định và tôm cá linh hoạt hơn.",
      },
    ],
  },
  {
    id: "p2",
    name: "AquaBio Pro",
    slug: "aquabio-pro",
    code: "NAV-NUT-ABP",
    categorySlug: "dinh-duong",
    featured: true,
    shortDescription:
      "Men tiêu hóa thế hệ mới giúp tăng cường hấp thu dinh dưỡng và bảo vệ gan tụy.",
    activeIngredients: [],
    benefits: [],
    dosage: [],
    heroImage: IMG,
    gallery: [IMG],
    faqs: [],
  },
  {
    id: "p3",
    name: "Nitro-Buster",
    slug: "nitro-buster",
    code: "NAV-WTR-NB",
    categorySlug: "xu-ly-nuoc",
    featured: true,
    shortDescription:
      "Chuyên gia xử lý NO2 cấp tốc cho ao nuôi mật độ siêu thâm canh.",
    activeIngredients: [],
    benefits: [],
    dosage: [],
    heroImage: IMG,
    gallery: [IMG],
    faqs: [],
  },
  {
    id: "p4",
    name: "Algae-Control",
    slug: "algae-control",
    code: "NAV-WTR-AC",
    categorySlug: "xu-ly-nuoc",
    featured: false,
    shortDescription:
      "Ổn định mật độ tảo khuê, ngăn ngừa tảo lam và tảo sợi phát triển quá mức.",
    activeIngredients: [],
    benefits: [],
    dosage: [],
    heroImage: IMG,
    gallery: [IMG],
    faqs: [],
  },
  {
    id: "p5",
    name: "Mineral Plus",
    slug: "mineral-plus",
    code: "NAV-MIN-MP",
    categorySlug: "khoang-chat",
    featured: false,
    shortDescription:
      "Cung cấp ion khoáng cần thiết giúp ổn định pH và hỗ trợ quá trình lột xác.",
    activeIngredients: [],
    benefits: [],
    dosage: [],
    heroImage: IMG,
    gallery: [IMG],
    faqs: [],
  },
  {
    id: "p6",
    name: "Immuno Beta",
    slug: "immuno-beta",
    code: "NAV-IMM-IB",
    categorySlug: "tang-cuong-mien-dich",
    featured: false,
    shortDescription:
      "Beta-glucan và thảo dược tự nhiên giúp vật nuôi chống chọi mầm bệnh hiệu quả.",
    activeIngredients: [],
    benefits: [],
    dosage: [],
    heroImage: IMG,
    gallery: [IMG],
    faqs: [],
  },
];

const NIMG = (id: string) =>
  `https://lh3.googleusercontent.com/aida-public/${id}`;

const news: News[] = [
  {
    id: "n1",
    title:
      "Tương lai của ngành nuôi tôm: Ứng dụng AI và IoT trong giám sát môi trường nước",
    slug: "ung-dung-ai-iot-giam-sat-moi-truong-nuoc",
    tag: "Công nghệ",
    author: "Navico",
    views: 2400,
    publishedAt: "2024-10-12",
    coverImage: NIMG(
      "AB6AXuBtbMb19nLs82bJJox2woOB5SntkW01IZXnkg5Ld67WbmgkFGgUQzCRMZ-fO47p_9KVk7ecr-uDEMQug3x6mIgYd03e-zCOdI5JhuPHFZkClXEgvnFOltGruins1J39N7cp4wR8x0ff6fHB6ROX8mF96qAexCw4LbIWGGEzGQUljiNH5CqTDqi4-APTxpa-M1gdT66fCRXmB2jw383-lvDWjgZNHPefQyaI-SvTLxAJ4q9JznUj7cCvrevCQswWZtd0P44B9ZXYs6M"
    ),
    excerpt:
      "Nghiên cứu mới nhất của Navico chỉ ra việc tích hợp trí tuệ nhân tạo có thể giúp tăng sản lượng tôm lên đến 30% thông qua tối ưu hóa chu kỳ dinh dưỡng và kiểm soát chính xác nồng độ vi sinh có lợi.",
    content: `<p>Ngành nuôi tôm Việt Nam đang bước vào kỷ nguyên số hóa. Việc kết hợp các cảm biến IoT với mô hình trí tuệ nhân tạo cho phép người nuôi theo dõi liên tục các chỉ số môi trường như pH, oxy hòa tan, NH3 và NO2 theo thời gian thực.</p><h2>Tối ưu hóa chu kỳ dinh dưỡng</h2><p>Thuật toán học máy phân tích dữ liệu lịch sử để dự đoán nhu cầu thức ăn, giảm thất thoát và cải thiện hệ số chuyển đổi thức ăn (FCR).</p><h2>Kiểm soát vi sinh chính xác</h2><p>Khi kết hợp với các dòng men vi sinh chuyên biệt của Navico, hệ thống có thể đề xuất liều lượng tối ưu cho từng giai đoạn nuôi.</p>`,
  },
  {
    id: "n2",
    title: "Sử dụng Probiotic thế hệ mới trong quản lý ao nuôi thâm canh",
    slug: "probiotic-the-he-moi-ao-nuoi-tham-canh",
    tag: "Vi sinh",
    author: "Navico",
    views: 1850,
    publishedAt: "2024-10-08",
    coverImage: NIMG(
      "AB6AXuA4-Fl3wx06K6YEhw1myk8sXzzLjy-Y4LxkxcpJ_4aSvwVdEehAoVjNDNje9fNFXxfPgUIIqg--y2yyOccnWRTbVsyIti_U6jkUFNCaFF_1WOZSJ7Lxc_1rBxuAzc8Fd2w1fq89E2OpZSpvr5rx8H8eTlpMS264D_Akpi9qDpkrlB2PFG-vpyDTdfI0C86w8i3jCjeipfNmnZQxdrVFdUfwvAtWeXgI-AMtxvFfPNn01eiCaG-zmhkEmdVysQBTAinLF7HQcDZgAXM"
    ),
    excerpt:
      "Các dòng vi sinh Bacillus đặc chủng giúp phân hủy mùn bã hữu cơ và ức chế sự phát triển của vi khuẩn Vibrio gây bệnh.",
    content: `<p>Trong mô hình nuôi thâm canh mật độ cao, việc duy trì hệ vi sinh có lợi là yếu tố sống còn. Các dòng Bacillus đặc chủng cạnh tranh dinh dưỡng và không gian sống với vi khuẩn Vibrio gây bệnh.</p><p>Bổ sung định kỳ giúp ổn định màu nước, giảm khí độc và cải thiện tỷ lệ sống.</p>`,
  },
  {
    id: "n3",
    title:
      "Quy trình Biofloc cải tiến cho mùa mưa tại khu vực Đồng bằng Sông Cửu Long",
    slug: "quy-trinh-biofloc-cai-tien-mua-mua",
    tag: "Kỹ thuật nuôi",
    author: "Navico",
    views: 1320,
    publishedAt: "2024-10-05",
    coverImage: NIMG(
      "AB6AXuCnHBM2y1TOQf3GacSzDB9QjB-8EZqAN86HGBsscYw7EfOnM_ZHBYUCUXVn3SFgAT0AZb764aLVS_EqWED4ic16xlIJ6CrkAXRsdnTjelPH5xmq_NwQyt4cTiJq8MCWyOVdTfW8DjDDvgpW_2XlQmyeYFOqq4ldYQLuszRugxse_sFgBq1LW96Ok8Mc8gYByFuve4aNsyFrcUEztnet8X7Ghs2MpGMu1ACgAp5ruHdKpwlKMaSjUZWPJyXKPjjwEO9DOoZysN712jM"
    ),
    excerpt:
      "Hướng dẫn chi tiết về việc duy trì ổn định độ kiềm và pH trong hệ thống Biofloc khi thời tiết thay đổi đột ngột.",
    content: `<p>Mùa mưa khiến độ kiềm và pH biến động mạnh, ảnh hưởng đến hệ Biofloc. Bài viết hướng dẫn cách bổ sung khoáng và vi sinh hợp lý để duy trì sự ổn định.</p>`,
  },
  {
    id: "n4",
    title: "Xu hướng tiêu thụ thủy sản bền vững tại thị trường EU năm 2025",
    slug: "xu-huong-tieu-thu-thuy-san-ben-vung-eu-2025",
    tag: "Tin ngành thủy sản",
    author: "Navico",
    views: 980,
    publishedAt: "2024-10-01",
    coverImage: NIMG(
      "AB6AXuBKe6ROkd2kEJoLpp3EfEl1P2uJxFmf4sPkRe3K7YHQQxTYHYe5zQwWJADjwTbhrxnRRuuwE8QgxZJRZYB94yHvuT9uBc9NY51NclXCRCBcvUKn6odPKw_4H9aGZRij4caqLEp9625xc4hcdDsbG9wGDOjlfukoTZbRUxRBuZ3dPG9mTponky9cvnUHsO0i__ihiaSN1SEftxiU9l-ovB0hrRV6PJ3s8CcPlf1MH3pTVnVOnMixVVCTH978KjT3ozceAGO9npToaJ8"
    ),
    excerpt:
      "Các quy định mới về truy xuất nguồn gốc và chứng chỉ xanh đang mở ra cơ hội lớn cho nhà sản xuất áp dụng công nghệ cao.",
    content: `<p>Thị trường EU ngày càng siết chặt yêu cầu về truy xuất nguồn gốc và chứng chỉ bền vững. Đây vừa là thách thức vừa là cơ hội cho doanh nghiệp Việt Nam.</p>`,
  },
  {
    id: "n5",
    title: "Tối ưu hóa hệ số chuyển đổi thức ăn (FCR) bằng Enzyme hữu cơ",
    slug: "toi-uu-fcr-bang-enzyme-huu-co",
    tag: "Dinh dưỡng",
    author: "Navico",
    views: 1100,
    publishedAt: "2024-09-28",
    coverImage: NIMG(
      "AB6AXuDbxWX4JLsmTzx_JiemicOLYK6oCsGqvrmPuFhXlHZfqUjYmQajfCeC9GrY4guzaCSvy0rOxVY3_30tbBWogejtctnLCGc_gGHPhP7jNXdxp_a4rI6FKK_Ua--jtl2i6pGdLj111snxRV38n4_KJizQUSorZ269cQzH1pqeJ1KkRornwxqzTXOSTLUjT42StxqitzWD3cO8BTHuyz7wX2YlzC9_JtGhRsy7UAkAbBQ2zsUiZlbIn0P7WW9h5efdfVGDonwPkmjpDgI"
    ),
    excerpt:
      "Phát hiện mới về việc bổ sung phức hệ enzyme giúp cải thiện khả năng hấp thụ đạm và giảm ô nhiễm môi trường nước ao.",
    content: `<p>Phức hệ enzyme (Protease, Amylase, Cellulase) hỗ trợ tiêu hóa, tăng khả năng hấp thụ đạm, từ đó cải thiện FCR và giảm lượng chất thải ra môi trường.</p>`,
  },
];

// ====== Accessor (sẽ thay bằng Prisma sau) ======
export function getCategories(): Category[] {
  return categories;
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getProducts(opts?: {
  categorySlug?: string;
  query?: string;
}): Product[] {
  let list = products;
  if (opts?.categorySlug) {
    list = list.filter((p) => p.categorySlug === opts.categorySlug);
  }
  if (opts?.query) {
    const q = opts.query.toLowerCase();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q)
    );
  }
  return list;
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getRelatedProducts(product: Product, limit = 3): Product[] {
  return products
    .filter((p) => p.id !== product.id && p.categorySlug === product.categorySlug)
    .concat(products.filter((p) => p.id !== product.id))
    .filter((p, i, arr) => arr.findIndex((x) => x.id === p.id) === i)
    .slice(0, limit);
}

export function getNewsList(): News[] {
  return [...news].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function getNewsBySlug(slug: string): News | undefined {
  return news.find((n) => n.slug === slug);
}

export function getTrendingNews(limit = 3): News[] {
  return [...news].sort((a, b) => b.views - a.views).slice(0, limit);
}
