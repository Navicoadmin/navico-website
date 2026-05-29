import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Dữ liệu seed ban đầu cho website NAVICO.
async function main() {
  // ====== Tài khoản admin ======
  const adminEmail = process.env.ADMIN_EMAIL || "admin@navico.vn";
  const adminPassword = process.env.ADMIN_PASSWORD || "Navico@123";
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      passwordHash,
      name: "Quản trị viên",
      role: "ADMIN",
    },
  });
  console.log(`✔ Admin: ${adminEmail} / ${adminPassword}`);

  // ====== Danh mục ======
  const categories = [
    { name: "Men vi sinh", slug: "men-vi-sinh", icon: "biotech", order: 1, description: "Lợi khuẩn đa dòng, tối ưu hệ tiêu hóa và môi trường ao nuôi." },
    { name: "Dinh dưỡng", slug: "dinh-duong", icon: "set_meal", order: 2, description: "Vitamin và acid amin thiết yếu cho tăng trưởng." },
    { name: "Khoáng chất", slug: "khoang-chat", icon: "water_drop", order: 3, description: "Cân bằng khoáng vi lượng đa lượng." },
    { name: "Xử lý nước", slug: "xu-ly-nuoc", icon: "filter_alt", order: 4, description: "Khử phèn, kim loại nặng và kiểm soát khí độc." },
    { name: "Tăng cường miễn dịch", slug: "tang-cuong-mien-dich", icon: "vaccines", order: 5, description: "Beta-glucan và thảo dược tăng đề kháng." },
    { name: "Phụ gia", slug: "phu-gia", icon: "science", order: 6, description: "Hoạt chất tối ưu hấp thụ và chuyển hóa thức ăn." },
  ];

  const catBySlug: Record<string, string> = {};
  for (const c of categories) {
    const cat = await prisma.category.upsert({
      where: { slug: c.slug },
      update: { name: c.name, icon: c.icon, order: c.order, description: c.description },
      create: c,
    });
    catBySlug[c.slug] = cat.id;
  }
  console.log(`✔ ${categories.length} danh mục`);

  // ====== Sản phẩm ======
  const products = [
    {
      name: "NaVibac 5F",
      slug: "navibac-5f",
      code: "NAV-BIO-5F",
      categorySlug: "men-vi-sinh",
      featured: true,
      shortDescription:
        "Công thức 5 thành phần kết hợp lợi khuẩn mật độ cao và enzyme sinh học, tối ưu môi trường nước, bảo vệ vật nuôi từ giống đến thu hoạch.",
      activeIngredients:
        "Bacillus subtilis, Bacillus licheniformis, Nitrosomonas spp, Nitrobacter spp, hệ Enzyme (Protease, Amylase, Cellulase). Mật độ > 5x10⁹ CFU/g.",
      benefits:
        "Xử lý mùn bã đáy ao; Kiểm soát khí độc NH3/NO2/H2S; Ổn định hệ vi sinh, ức chế Vibrio; Ổn định màu nước.",
      usageInstructions:
        "Hòa tan với 50 lít nước ao, sục khí mạnh 2-4 giờ trước khi tạt xuống ao để kích hoạt vi sinh. Dùng lúc 8-10 giờ sáng.",
      dosage:
        "Chuẩn bị ao: 500g/2.000m³ (trước thả 2 ngày). Tháng 1: 250g/2.000m³ (7-10 ngày/lần). Tháng 2+: 500g/2.000m³ (5-7 ngày/lần). Ao ô nhiễm nặng: 1kg/2.000m³.",
      faqs: [
        { question: "Tại sao nên sục khí NaVibac 5F trước khi dùng?", answer: "Sục khí giúp đánh thức bào tử vi sinh đang ngủ, để chúng hoạt động ngay khi xuống ao." },
        { question: "Có an toàn cho tôm giai đoạn ấu trùng không?", answer: "Hoàn toàn an toàn, còn giúp ổn định đường ruột." },
        { question: "Bao lâu thấy hiệu quả giảm khí độc?", answer: "Chỉ số NH3/NO2 giảm rõ sau 24-48 giờ." },
      ],
    },
    { name: "AquaBio Pro", slug: "aquabio-pro", code: "NAV-NUT-ABP", categorySlug: "dinh-duong", featured: true, shortDescription: "Men tiêu hóa thế hệ mới tăng cường hấp thu dinh dưỡng và bảo vệ gan tụy." },
    { name: "Nitro-Buster", slug: "nitro-buster", code: "NAV-WTR-NB", categorySlug: "xu-ly-nuoc", featured: true, shortDescription: "Xử lý NO2 cấp tốc cho ao nuôi mật độ siêu thâm canh." },
    { name: "Algae-Control", slug: "algae-control", code: "NAV-WTR-AC", categorySlug: "xu-ly-nuoc", featured: false, shortDescription: "Ổn định mật độ tảo khuê, ngăn tảo lam và tảo sợi." },
    { name: "Mineral Plus", slug: "mineral-plus", code: "NAV-MIN-MP", categorySlug: "khoang-chat", featured: false, shortDescription: "Cung cấp ion khoáng ổn định pH và hỗ trợ lột xác." },
    { name: "Immuno Beta", slug: "immuno-beta", code: "NAV-IMM-IB", categorySlug: "tang-cuong-mien-dich", featured: false, shortDescription: "Beta-glucan và thảo dược giúp chống chọi mầm bệnh." },
  ];

  for (const p of products) {
    const { categorySlug, faqs, ...rest } = p;
    const existing = await prisma.product.findUnique({ where: { slug: p.slug } });
    if (existing) {
      await prisma.product.update({
        where: { slug: p.slug },
        data: { ...rest, categoryId: catBySlug[categorySlug] },
      });
    } else {
      await prisma.product.create({
        data: {
          ...rest,
          categoryId: catBySlug[categorySlug],
          gallery: [],
          faqs: faqs?.length
            ? { create: faqs.map((f, i) => ({ ...f, order: i })) }
            : undefined,
        },
      });
    }
  }
  console.log(`✔ ${products.length} sản phẩm`);

  // ====== Tin tức ======
  const news = [
    {
      title: "Tương lai của ngành nuôi tôm: Ứng dụng AI và IoT trong giám sát môi trường nước",
      slug: "ung-dung-ai-iot-giam-sat-moi-truong-nuoc",
      tag: "Công nghệ",
      excerpt: "AI và IoT có thể giúp tăng sản lượng tôm đến 30% nhờ tối ưu chu kỳ dinh dưỡng và kiểm soát vi sinh chính xác.",
      content: "<p>Ngành nuôi tôm Việt Nam đang bước vào kỷ nguyên số hóa.</p><h2>Tối ưu hóa chu kỳ dinh dưỡng</h2><p>Thuật toán học máy phân tích dữ liệu để dự đoán nhu cầu thức ăn, cải thiện FCR.</p>",
    },
    {
      title: "Sử dụng Probiotic thế hệ mới trong quản lý ao nuôi thâm canh",
      slug: "probiotic-the-he-moi-ao-nuoi-tham-canh",
      tag: "Vi sinh",
      excerpt: "Các dòng Bacillus đặc chủng phân hủy mùn bã và ức chế Vibrio gây bệnh.",
      content: "<p>Trong mô hình thâm canh mật độ cao, duy trì hệ vi sinh có lợi là yếu tố sống còn.</p>",
    },
    {
      title: "Quy trình Biofloc cải tiến cho mùa mưa tại Đồng bằng Sông Cửu Long",
      slug: "quy-trinh-biofloc-cai-tien-mua-mua",
      tag: "Kỹ thuật nuôi",
      excerpt: "Duy trì ổn định độ kiềm và pH trong hệ Biofloc khi thời tiết thay đổi đột ngột.",
      content: "<p>Mùa mưa khiến độ kiềm và pH biến động mạnh, ảnh hưởng hệ Biofloc.</p>",
    },
  ];

  for (const n of news) {
    await prisma.news.upsert({
      where: { slug: n.slug },
      update: { title: n.title, excerpt: n.excerpt, content: n.content, tag: n.tag },
      create: n,
    });
  }
  console.log(`✔ ${news.length} bài viết`);

  // ====== Slide hero trang chủ ======
  const slides = [
    {
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBPYilt6KxQrjxBbPA9lh21G_zosyE8ObXCCEGrmIqROZZg44v5GDC5em3VoEgsV-7QydIsTtgBpHlij36JUqDA6eZMjpxhFM1roQemYXNcmbnddXYoXusg34eNC1GcN43hBZG2zGmLS46C9e3i5UrwG4gvhzDQemmOyGw13BpeF-_fAvbd9ewDyTNZ8hukY1GEMF76KZw8ggPG7XEdUr4aCj2ZdCXuTQbrGKqoGGyFb8NwtIw4UyI7zsgUCGGx9-8jmxG8147qW0ciaJ0",
      title: "Giải pháp nuôi tôm tiên tiến",
      subtitle:
        "Giải pháp dinh dưỡng và công nghệ sinh học cho tôm khỏe mạnh, năng suất cao.",
      ctaLabel: "Khám phá sản phẩm",
      ctaHref: "/san-pham",
      order: 1,
    },
    {
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuB1DxJrfrhAtT3mY_NLifRkFiAaP0RbU9xm0gtUOTsscx6JQoyAHHztOyvFkjOonyUWhj1RWJH7ODlnBgpn8bBuTyEqTwiISQjEVBEaZIYkBkuIzWhRFiM04bRJEI8Z4dWr2DZFMwOlW9JsVjInf75i7XVsV1RrexVDn5aMTcYLZSfjyrBzm19aHOVkNgm50hX86bCcI_TpgD1FD0Rcfn_nz_vIM8ocCzlEkaenzp0jNE5yfdqG462aL-ULnMBC5fL3BOOsmYAPbO1ZjA8",
      title: "Công nghệ nuôi cá thông minh",
      subtitle:
        "Hỗ trợ sản xuất cá bền vững với dinh dưỡng tiên tiến và quản lý môi trường nước.",
      ctaLabel: "Tìm hiểu giải pháp",
      ctaHref: "/san-pham",
      order: 2,
    },
    {
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAtxy030GCXahyFpB8gikMFpFV2BpPUBLb46ZfG2hHtHqdqJFVcwyUim9Z5U2sInjmSa6wB6v-510l2bXn6CblgRypsTI4Uf1sTaIKNQabJwNwWkyeIML2bns7r92MkJl_cuqVJriQfp2EjEXavxVVhpjFlYEjy7IER0H3CVLWarVPiSJIXlp-1H3Dp-2jR00f20PeCwc-sJ4wnWIttRm0gnTwj8PmPJnBelPRDm9oz1puVfHUPyKnJvJuUBW8CCksEjvtN8EKe7D-rLzc",
      title: "Đổi mới công nghệ vi sinh",
      subtitle:
        "Giải pháp men vi sinh và lợi khuẩn thế hệ mới cho nông nghiệp bền vững.",
      ctaLabel: "Giải pháp kỹ thuật",
      ctaHref: "/san-pham",
      order: 3,
    },
  ];
  if ((await prisma.heroSlide.count()) === 0) {
    await prisma.heroSlide.createMany({ data: slides });
  }
  console.log(`✔ ${slides.length} slide hero`);

  // ====== Thương hiệu đồng hành (đối tác) ======
  // Dùng logo Navico làm placeholder; admin sẽ thay bằng logo đối tác thật.
  if ((await prisma.partner.count()) === 0) {
    await prisma.partner.createMany({
      data: Array.from({ length: 6 }, (_, i) => ({
        name: `Đối tác ${i + 1}`,
        logo: "/logo.png",
        order: i + 1,
      })),
    });
  }
  console.log("✔ 6 đối tác (placeholder)");

  // ====== Vị trí tuyển dụng ======
  const jobs = [
    { title: "Chuyên gia Nghiên cứu Vi sinh", slug: "chuyen-gia-nghien-cuu-vi-sinh", department: "R&D", type: "Toàn thời gian", location: "Tây Ninh", order: 1 },
    { title: "Quản lý Vận hành Trại giống", slug: "quan-ly-van-hanh-trai-giong", department: "Vận hành", type: "Toàn thời gian", location: "TP. Hồ Chí Minh", order: 2 },
    { title: "Kỹ sư Dữ liệu (Aquaculture)", slug: "ky-su-du-lieu-aquaculture", department: "Công nghệ", type: "Toàn thời gian", location: "TP. Hồ Chí Minh", order: 3 },
  ];
  for (const j of jobs) {
    await prisma.job.upsert({ where: { slug: j.slug }, update: j, create: j });
  }
  console.log(`✔ ${jobs.length} vị trí tuyển dụng`);

  // ====== Hoạt động / sự kiện ======
  const activities = [
    {
      title: "AquaTech Global Expo 2024",
      slug: "aquatech-global-expo-2024",
      tag: "Triển lãm Quốc tế",
      description:
        "Giới thiệu giải pháp vi sinh thế hệ mới tối ưu hóa môi trường nuôi trồng thủy sản. Thu hút hơn 500 lượt đối tác tham quan và ký kết ghi nhớ hợp tác.",
      date: new Date("2024-10-15"),
      images: [
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDVQV7WB3KJxAU-vI5D_u0mcJaEk323MpTyXURxARsdqxozPerey2jMW__fqEEcbNs-3PGHjhYuQO_MP83TQdIDiVtqxiwF4kW2tb9KwduxZiaNB-ik-sBrpr89AHyWnZY-ReyChdpebkcUGu9KjpwDzruM-HWLeLlk24qr6F6M_YVAZcI4-l_8J8vJws2Ga_UFzid4ubyxLKZQ87iVTTZ601qVuFKyFtwqV5XydVuzwhFAwHnLQAO07J7_ERD1fLZDIT--JYlQZMk",
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCZaZaCMs2axa5spIDRMZXlXP_Ux0r0C7TVHCJZlFvp3aLh6V7Nv4nCZkSvupUn4QgVVldnrmlbK0Y2ZjjQ-5ubmr4OgeY3b-3UHNk28op3MbG6r-B0ohbQJGPdYfY-TCusPf5KGWGAOsfEQpK7EZV78qrDWD89ThZFzs-Fqq9HVw8M6giNsj35vKeTutz3X7Mz5_4296USGGOBd0faYOSj5crxuAQHgCYt5_7fMe-ymcL6b3c_bez_6gzr1dnOpqW5quZztCKirF4",
      ],
    },
    {
      title: "Navico Innovation Day 2024",
      slug: "navico-innovation-day-2024",
      tag: "Hoạt động Nội bộ",
      description:
        "Sân chơi sáng tạo thường niên dành cho đội ngũ R&D, nơi những ý tưởng đột phá về công nghệ nano và xử lý nước được trình bày và vinh danh.",
      date: new Date("2024-09-20"),
      images: [
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDg5PUA25toheIf0aia_WS3BMmTKrnZYHMWkz69aLFkzeBhucbgNtQD7CipX1pdnkrHDwAD56faDeaut1-Nr5lvYgd9XrWYMcdp3BQPDsNsTbrkV-mh4OiOG5N5NTxPxJolnP9ytU4AtIY7OxX2xAIZI8eL0P1KWyc-S8i15q-E9_HKA39yy2vT3kQmlKEK8UoLQD7MmmKVzsrOVIQs50fm5TqQuiBDLJE4ZY-dgJaSqh4OYudvfxZfyHdTJG1o-nmqTvrlAp-1XKw",
      ],
    },
    {
      title: "Giải pháp Sinh học cho Tôm Giống",
      slug: "giai-phap-sinh-hoc-cho-tom-giong",
      tag: "Hội thảo Kỹ thuật",
      description:
        "Buổi chia sẻ kiến thức chuyên sâu giữa các chuyên gia Navico và hơn 100 chủ trang trại tại ĐBSCL về nâng cao tỷ lệ sống của tôm bằng vi khuẩn có lợi.",
      date: new Date("2024-08-05"),
      images: [
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBpk1rc1Lqdc7tIS1QTOCuadK6iwY2d28zLHi9tLzsW4gNOST2_-SO3PL-bRVCEADnumoalcnMWQ725-HQbQmETiqLePR2Ndfnb-X-Qe0xFNGj9Sf3N1aLwOfX8cRQvtMkmIQvEavCYL1A7rcmrD3Sr3glwDB-OT7wTtmwRQelW-kKG6lStKGC95Mr8c4qeARwHud-p-kPTAjCb2a0ZJW0jnfT6NahWgqWVRJKuxHa8SlCWVg9hN_znKvJ0dBPKcBWyHryu9HhvVn4",
      ],
    },
  ];
  for (const a of activities) {
    await prisma.activity.upsert({ where: { slug: a.slug }, update: a, create: a });
  }
  console.log(`✔ ${activities.length} hoạt động`);

  console.log("Seed hoàn tất!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
