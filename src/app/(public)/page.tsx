import Link from "next/link";
import { HeroSlider } from "@/components/home/HeroSlider";
import { ContactForm } from "@/components/ContactForm";
import { Icon } from "@/components/Icon";
import { siteConfig } from "@/lib/site";
import { prisma } from "@/lib/prisma";

// Slide hero đọc từ DB (admin tùy chỉnh) nên render động
export const dynamic = "force-dynamic";

// Các danh mục nhỏ hiển thị ở lưới bento trang chủ
const smallCategories = [
  {
    icon: "set_meal",
    title: "Dinh dưỡng (Nutrition)",
    desc: "Hỗn hợp vitamin và acid amin thiết yếu cho sự tăng trưởng vượt trội.",
    href: "/san-pham?category=dinh-duong",
  },
  {
    icon: "water_drop",
    title: "Khoáng (Minerals)",
    desc: "Cân bằng khoáng vi lượng đa lượng, đặc biệt hiệu quả trong mùa mưa.",
    href: "/san-pham?category=khoang-chat",
  },
  {
    icon: "vaccines",
    title: "Hỗ trợ miễn dịch",
    desc: "Tăng cường đề kháng tự nhiên, giúp tôm cá chống lại dịch bệnh.",
    href: "/san-pham?category=tang-cuong-mien-dich",
  },
];

// Ảnh sản phẩm nổi bật ở ô lớn
const FEATURED_IMG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuD0rspAJiPQDVHq6SJPFCy1BhDzqZ82f69LP1nAYGTuDE2cU4IAYDN8IzgY0VRrCBN5SKr3O0ALMMQLRXlvj_qyVrusuRLvOo60a4Pra6d1LYKXfZtGSQxoSam7GAMRnbfeJiFWjDPBH6APN8iEIaEvydVHXrGpNXDCTIv_hj6C_tyKd5DfmUueYF4_pwZhlDLBb9NIhQVHw48YqH6EogzmW6SRrHDa2dKZo3b3FN1e3zqX_IUB4Ru9vgWzcYaEtzebvya6voDJ5u6WJ18";

// Bài viết kỹ thuật nổi bật
const articles = [
  {
    tag: "Hướng dẫn kỹ thuật",
    title: "Quy trình quản lý khí độc NH3/NO2 hiệu quả trong ao bạt",
    desc: "Những bước cơ bản để duy trì chất lượng nước và ngăn chặn rủi ro cho vật nuôi...",
    date: "12/10/2025",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDGoMZcoyZi3iBw8naawe8Gy_ZBKqePjZFThg7sAyOl_0WRnogiXCPE1J5JtXGB6DKPLxEWGSWmgG94p0WavHW5hFEntSZZeD9uab-y9tpDRZWgI5BF4udqLauZeJ_yI70wQo2YtfFUE_2sbgURS2iW7v-wQuTnqNh7yenReT1y5iWqCNIiQ67F6YF77fbsjhpb4unj-tox4izfm0kMs1Eh5bwcMojkXhZIcmhujzHbueO6rAhj6APmHQBhX2Yo_iqoymUIi7AYZ-Q",
  },
  {
    tag: "Nghiên cứu thực tế",
    title: "Tối ưu hóa FCR với chế độ dinh dưỡng NAVI-MAX",
    desc: "Báo cáo thực tế từ các farm nuôi cá tra tại khu vực Đồng bằng sông Cửu Long...",
    date: "08/10/2025",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuASkjObAgdcdxQVMpmDE5Jl-PpNNBxGr80fjZsJ62NnMnEHI30EDr6jKkFh4-ro1eD7O88d7Nr7UDaUWbV5Mvxg3anKxsrMnScpE4DF5HN44pB0Ft7ppr0DSi-OA0_z5JYa7y8N9BLwnj9E1CEhS4Q1Kd0vXWRCQMPMbwvQiLeI5p_WK935pK2jnso_WfyJbUQpdEivFVFpbzZj39YriIWm87VD-g5EAYIJSOmG30ASTEG6uJRfTFFFYUHcSTAuEe2fJci46jyQwtw",
  },
  {
    tag: "Tài liệu chuyên môn",
    title: "Kỷ nguyên vi sinh trong phòng ngừa bệnh EMS trên tôm",
    desc: "Phân tích chuyên sâu về cơ chế tác động của Bacillus spp trong ao nuôi...",
    date: "05/10/2025",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCp36zWh2frjdbvVVCuZ_X8N95VPJkw1XBc-BS8izj96H0WoLrXMV2ePi4_-N_KSpy3uQH8EkxV0rdacpCmuFOniTQXCwfWiT39lC4msTfVPTPAgA2Q63JqKl8PfFh3UkuD042j9Olk1jX1-jlMx_ObB5fx8YaRLCNVmYVZTR7QzoTV-VBKGcqqoPB22-5iNS0qknm45dm8oeP15PNdejw5eWHpPD7dt5bqf9DrkJaFOPBRGGp7gpZWT1-_4nmRGtMWDL98Qfvz2ss",
  },
];

const steps = [
  {
    n: "01",
    title: "Tư Vấn Miễn Phí",
    desc: "Gọi điện hoặc liên hệ online – kỹ thuật viên NAVICO phân tích tình trạng ao và nhu cầu cụ thể.",
  },
  {
    n: "02",
    title: "Đề Xuất Giải Pháp",
    desc: "Nhận phác đồ sử dụng sản phẩm phù hợp với từng giai đoạn nuôi và loại tôm cá.",
  },
  {
    n: "03",
    title: "Giao Hàng & Hướng Dẫn",
    desc: "Nhận hàng nhanh, kỹ thuật viên hướng dẫn sử dụng và theo dõi hiệu quả.",
  },
  {
    n: "04",
    title: "Đồng Hành Toàn Vụ",
    desc: "Hỗ trợ kỹ thuật 24/7 trong suốt vụ nuôi.",
  },
];

export default async function HomePage() {
  const slides = await prisma.heroSlide.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
  });

  return (
    <>
      <HeroSlider slides={slides} />

      {/* Giới thiệu */}
      <section className="py-24 bg-white">
        <div className="max-w-container-max mx-auto px-margin-mobile lg:px-margin-desktop grid lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <span className="text-secondary font-bold uppercase tracking-widest text-sm">
                Sứ mệnh &amp; Tầm nhìn
              </span>
              <h2 className="text-3xl lg:text-4xl font-bold text-primary leading-tight">
                Sứ mệnh nâng tầm chất lượng thủy sản Việt
              </h2>
            </div>
            <p className="text-on-surface-variant text-lg leading-relaxed">
              Navico được thành lập với tầm nhìn trở thành đối tác chiến lược
              hàng đầu của các doanh nghiệp nuôi trồng thủy sản và chăn nuôi Việt
              Nam. Chúng tôi kết hợp nghiên cứu khoa học chuyên sâu với thực tiễn
              sản xuất để tạo ra những giải pháp dinh dưỡng, vi sinh và công nghệ
              bền vững.
            </p>
            <div className="grid grid-cols-2 gap-6">
              <div className="p-6 bg-surface-container rounded-xl border-l-4 border-secondary">
                <h3 className="font-bold text-primary mb-2">Tầm nhìn</h3>
                <p className="text-sm text-on-surface-variant">
                  Kiến tạo hệ sinh thái chăn nuôi thông minh, hiệu quả và bền
                  vững.
                </p>
              </div>
              <div className="p-6 bg-surface-container rounded-xl border-l-4 border-primary">
                <h3 className="font-bold text-primary mb-2">Giá trị cốt lõi</h3>
                <p className="text-sm text-on-surface-variant">
                  Sáng tạo – Bền vững – Đồng hành cùng người nuôi.
                </p>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl bg-surface-container">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAXa1aLj5c1YYXzxg3933qO3miPO7Zx2KUSXRMo0MUV2klFHkvwuoXIkHL_V0G2G_3vvFRS8H-xeL1PUPOcXNXftYx2f0HmhnrA5bpBzwD6duGNlkkJbQdIOoq8jG4Gdvd_qzJ6wY45ucFqaNKOZGZzs2ROZuqSla9D0vrzTE-S-pKX9478XC9uhkxGY1w3H_VVQqMguWGq8KFf9-3xVKwF_q-QbQ8BvznhTWbTDhV9bnDP0sBBUlkSu5GBocon2lbs0ipTwUth7xk"
                alt="Phòng thí nghiệm Navico"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-8 -left-6 lg:-left-10 bg-primary p-6 lg:p-8 rounded-2xl text-white">
              <div className="text-3xl lg:text-4xl font-black mb-1">10+</div>
              <div className="text-sm opacity-80">Năm kinh nghiệm</div>
            </div>
          </div>
        </div>
      </section>

      {/* Danh mục sản phẩm */}
      <section className="py-24 bg-surface-container-low">
        <div className="max-w-container-max mx-auto px-margin-mobile lg:px-margin-desktop">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="space-y-4">
              <span className="text-secondary font-bold uppercase tracking-widest text-sm">
                Product Range
              </span>
              <h2 className="text-3xl lg:text-4xl font-bold text-primary">
                Danh mục sản phẩm
              </h2>
            </div>
            <Link
              href="/san-pham"
              className="text-primary font-bold flex items-center gap-2 hover:gap-4 transition-all"
            >
              Tất cả sản phẩm <Icon name="trending_flat" />
            </Link>
          </div>
          {/* Lưới bento: 1 ô danh mục + ô nổi bật lớn + 3 ô danh mục */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Men vi sinh */}
            <Link
              href="/san-pham?category=men-vi-sinh"
              className="group bg-white p-8 rounded-xl border border-outline-variant hover:border-secondary hover:shadow-card-hover transition-all"
            >
              <div className="size-16 bg-secondary-container/30 rounded-lg flex items-center justify-center text-secondary mb-6 group-hover:scale-110 transition-transform">
                <Icon name="biotech" fill className="text-4xl" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-3">
                Men vi sinh (Probiotics)
              </h3>
              <p className="text-on-surface-variant text-sm mb-6">
                Ứng dụng công nghệ lợi khuẩn đa dòng, tối ưu hóa hệ tiêu hóa và
                môi trường ao nuôi.
              </p>
              <ul className="space-y-2 text-sm text-on-surface">
                <li className="flex items-center gap-2">
                  <Icon name="check_circle" className="text-secondary text-lg" />
                  Phân hủy chất hữu cơ
                </li>
                <li className="flex items-center gap-2">
                  <Icon name="check_circle" className="text-secondary text-lg" />
                  Ức chế vi khuẩn Vibrio
                </li>
              </ul>
            </Link>

            {/* Ô sản phẩm nổi bật (lớn) */}
            <Link
              href="/san-pham/navibac-5f"
              className="lg:col-span-2 relative rounded-xl overflow-hidden group min-h-[320px]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={FEATURED_IMG}
                alt="NaVibac 5F"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/30 to-transparent p-8 lg:p-10 flex flex-col justify-end text-white">
                <span className="bg-secondary text-xs font-bold px-3 py-1 rounded-full w-fit mb-4">
                  Sản phẩm nổi bật
                </span>
                <h3 className="text-2xl lg:text-3xl font-black mb-3">
                  NaVibac 5F: Đột phá xử lý nước
                </h3>
                <p className="max-w-md text-white/80 mb-6">
                  Công thức vi sinh 5 thành phần mật độ cao, kiểm soát khí độc và
                  ổn định môi trường ao nuôi.
                </p>
                <span className="bg-white text-primary px-6 py-3 rounded-lg font-bold w-fit group-hover:bg-secondary group-hover:text-white transition-colors">
                  Tìm hiểu thêm
                </span>
              </div>
            </Link>

            {/* 3 danh mục còn lại */}
            {smallCategories.map((c) => (
              <Link
                href={c.href}
                key={c.title}
                className="group bg-white p-8 rounded-xl border border-outline-variant hover:border-secondary hover:shadow-card-hover transition-all"
              >
                <div className="size-16 bg-primary-container/10 rounded-lg flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                  <Icon name={c.icon} className="text-4xl" />
                </div>
                <h3 className="text-xl font-bold text-primary mb-3">
                  {c.title}
                </h3>
                <p className="text-on-surface-variant text-sm">{c.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Kỹ thuật & Nghiên cứu */}
      <section className="py-24 bg-white">
        <div className="max-w-container-max mx-auto px-margin-mobile lg:px-margin-desktop">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <span className="text-secondary font-bold uppercase tracking-widest text-sm">
              Kiến thức chuyên môn
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-primary">
              Kỹ thuật &amp; Nghiên cứu
            </h2>
            <p className="text-on-surface-variant">
              Cập nhật những xu hướng nuôi trồng mới nhất và các bài viết từ đội
              ngũ chuyên gia Navico.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {articles.map((a) => (
              <Link href="/tin-tuc" key={a.title} className="group">
                <div className="aspect-video rounded-xl overflow-hidden mb-6 bg-surface-container">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={a.image}
                    alt={a.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <span className="text-secondary text-xs font-bold uppercase">
                  {a.tag}
                </span>
                <h3 className="text-lg font-bold text-primary mt-2 group-hover:text-secondary transition-colors leading-tight">
                  {a.title}
                </h3>
                <p className="text-sm text-on-surface-variant mt-3 line-clamp-2">
                  {a.desc}
                </p>
                <div className="mt-4 flex items-center gap-2 text-xs text-outline">
                  <Icon name="calendar_today" className="text-sm" /> {a.date}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Quy trình */}
      <section className="py-24 bg-surface-container-lowest">
        <div className="max-w-container-max mx-auto px-margin-mobile lg:px-margin-desktop text-center">
          <div className="mb-16 space-y-4">
            <span className="text-secondary font-bold uppercase tracking-widest text-sm">
              Quy trình
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-primary">
              Từ tư vấn đến ao nuôi
            </h2>
            <p className="text-on-surface-variant text-lg max-w-2xl mx-auto">
              Quy trình đơn giản, chuyên nghiệp – bạn chỉ cần tập trung vào vụ
              nuôi.
            </p>
          </div>
          <div className="relative">
            <div className="absolute top-10 left-0 right-0 h-1 bg-secondary/20 hidden md:block" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
              {steps.map((s) => (
                <div key={s.n} className="flex flex-col items-center group">
                  <div className="size-20 rounded-full bg-secondary text-white flex items-center justify-center text-2xl font-bold mb-6 border-8 border-surface-container-lowest shadow-lg transition-transform group-hover:scale-110">
                    {s.n}
                  </div>
                  <h3 className="text-lg font-bold text-primary mb-3">
                    {s.title}
                  </h3>
                  <p className="text-sm text-on-surface-variant leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Liên hệ */}
      <section className="py-24 bg-white">
        <div className="max-w-container-max mx-auto px-margin-mobile lg:px-margin-desktop">
          <div className="grid lg:grid-cols-2 gap-0 bg-primary rounded-[2rem] overflow-hidden">
            <div className="p-10 lg:p-16 space-y-10">
              <div className="space-y-4 text-white">
                <h2 className="text-3xl lg:text-4xl font-bold">
                  Liên hệ với chúng tôi
                </h2>
                <p className="text-on-primary-container text-lg">
                  Đội ngũ kỹ sư Navico sẵn sàng hỗ trợ bạn 24/7.
                </p>
              </div>
              <ContactForm variant="dark" />
              <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row gap-8">
                <div className="flex items-start gap-3 text-white">
                  <Icon name="call" className="text-secondary" />
                  <div>
                    <p className="text-xs opacity-60">Hotline</p>
                    <p className="font-bold">{siteConfig.hotline}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-white">
                  <Icon name="mail" className="text-secondary" />
                  <div>
                    <p className="text-xs opacity-60">Email</p>
                    <p className="font-bold">{siteConfig.email}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative min-h-[400px] bg-primary-container">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBJVi2p27AzGSWkVpCZCaFI9Ga7Tqrixa2CcZ8jcDMVv0MM4ukA-zhYVZAwCWcrmN2skaYPUxSrI6ceiR7CqtzeUOIXXPdoP136IqR7Dg4iSmo8K6WE7lR-Nw3InzATVRxDGDyWt8TYjdSjwdVDBgHKnKvK-NaTPduPvsg0VBV1R2jyRnjCnlMmc9e5-jOT5RETFzvVYCpTSen25S2-1mPFlKXwh7KzXXXrGXeP_C--mxWZi2x5g-KdTYRaEXGZ76fELcX-z2YB2Yk"
                alt="Mạng lưới Navico tại Việt Nam"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
