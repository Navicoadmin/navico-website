import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Giới thiệu",
  description:
    "Navico - giải pháp dinh dưỡng, phụ gia và công nghệ sinh học cho ngành nuôi trồng thủy sản, đồng hành cùng người nuôi hướng đến phát triển bền vững.",
};

// Đọc đối tác từ DB nên render động (admin cập nhật là hiển thị ngay)
export const dynamic = "force-dynamic";

const HERO =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuA58hDDWoyoG1si5tSbtxYK6pnroFnD2QAZ1RIEr6QvrowaPxuvhdWeGYdEPmrVvwSve3ZQwUHkIXAu-DkVkZ2ei72ig0r-nzZsTfPZ49GEwEl8QSmqdm9HSn2ySsujhJNVJJgH_Lc4x1K-310CdDkNZbM2MkLVPuHLTBtyRkTa86eOZZN5M45tLK-2jfAM0O9ayhJPphsOjaFa3c7YKP1E_4gJG2S97BIp-5gGjRV7iqtjlA6u-qJMvvZ2_AnHwhFvl0BxgHg4jEc";
const IMG_LAB =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuByu9MTuXdgmY0z-BHouFwia0WJ-BdVGA3rDS9u43ahYm6mQwFSoBbg3cu3wbW1QTwMUuCrR97TsLLM-azEhNX0z7Lc77gbH6R8c2-93rptfHBHkgSM_qeF6kmox4kMUpC7kGpP4DTkqC80PShDpqRXtJdjCudDiQspOeSH5nNK6-7PelCKQzjouThobCeEwzOMMiOj-0EnMGKxYPFVBr1SZjPenc89LaIQ-wKNs7FBefS877bbMbvZOzCoRUOSu_PGoaRK6eifYAA";
const IMG_TEAM =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCbyJjM-wubNEpCS6mGK9NIYKvOFYLaPUBXcZ5H0zcmAm2dIKpXuZ8O-WnKcIfwyr67BEtc33rgv0AieY9CvR1I10o_1kE-cdF5Z9RyS3VEjvHBg0QWr3mUisA2eRvdoxV7m4C-rC2rxGSATDOYrivtjsXUsaTh05zFUDd1I8dWv2RewCiyWNnMh0vmnY1Mof8o2oF2Qp1myvbJZLQzzw0yE-1ylxiBe-eLJ_7ANdsd8kHUGlylIgg_fAdaiWpi-7B9wKLQCxvVrJJBNQ";

const impactStats = [
  { value: "500+", label: "Khách hàng" },
  { value: "30%", label: "Giảm phát thải CO₂" },
  { value: "92%", label: "Độ hài lòng đối tác" },
  { value: "24/7", label: "Hỗ trợ kỹ thuật" },
];

// Chiều cao các cột biểu đồ tăng trưởng (2020-2025)
const growthBars = [30, 45, 60, 85, 55, 70];

export default async function AboutPage() {
  const partners = await prisma.partner.findMany({ orderBy: { order: "asc" } });

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[60vh] lg:min-h-[70vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={HERO}
            alt="Navico - cơ sở nuôi trồng thủy sản công nghệ cao"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/60 to-transparent" />
        </div>
        <div className="relative z-10 max-w-container-max mx-auto px-margin-mobile lg:px-margin-desktop w-full py-20">
          <div className="max-w-2xl">
            <span className="inline-block px-4 py-1 rounded-full bg-secondary/20 text-secondary-fixed-dim font-semibold text-sm mb-6">
              GIỚI THIỆU VỀ NAVICO
            </span>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              Giải pháp dinh dưỡng và công nghệ sinh học cho chăn nuôi
            </h1>
            <p className="text-lg text-white/85 mb-8 max-w-xl">
              Cung cấp phụ gia thức ăn, giải pháp dinh dưỡng, xử lý môi trường và
              công nghệ sinh học giúp tối ưu tăng trưởng, cải thiện sức khỏe vật
              nuôi và nâng cao hiệu quả nuôi trồng.
            </p>
            <Link
              href="/san-pham"
              className="inline-flex items-center gap-2 bg-secondary text-white px-8 py-4 rounded-xl font-semibold hover:brightness-110 transition-all"
            >
              Khám phá sản phẩm <Icon name="arrow_forward" />
            </Link>
          </div>
        </div>
      </section>

      {/* Khoa học đồng hành */}
      <section className="py-24 bg-white">
        <div className="max-w-container-max mx-auto px-margin-mobile lg:px-margin-desktop grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-secondary font-semibold tracking-widest uppercase mb-4 block text-sm">
              Chuyên môn &amp; Giải pháp thủy sản
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-8">
              Khoa học đồng hành cùng hiệu quả nuôi trồng
            </h2>
            <div className="space-y-5 text-on-surface-variant text-lg leading-relaxed">
              <p>
                Với định hướng ứng dụng khoa học vào nuôi trồng thủy sản, Navico
                tập trung phát triển các giải pháp dinh dưỡng, phụ gia thức ăn và
                công nghệ sinh học nhằm nâng cao sức khỏe vật nuôi, tối ưu tăng
                trưởng và cải thiện hiệu quả sản xuất.
              </p>
              <p>
                Chúng tôi kết hợp nghiên cứu chuyên sâu, nguồn nguyên liệu chất
                lượng và kinh nghiệm thực tiễn để mang đến giải pháp bền vững cho
                ngành thủy sản hiện đại.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4 pt-12">
              <div className="rounded-2xl overflow-hidden h-60 shadow-sm bg-surface-container">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={IMG_LAB} alt="Nghiên cứu trong phòng lab" className="w-full h-full object-cover" />
              </div>
              <div className="bg-primary p-8 rounded-2xl text-white">
                <div className="text-4xl font-bold mb-2">10+</div>
                <div className="text-sm opacity-70">Năm kinh nghiệm</div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-secondary p-8 rounded-2xl text-white">
                <div className="text-4xl font-bold mb-2">100+</div>
                <div className="text-sm opacity-80">Sản phẩm</div>
              </div>
              <div className="rounded-2xl overflow-hidden h-60 shadow-sm bg-surface-container">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={IMG_TEAM} alt="Đội ngũ Navico" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sứ mệnh & Tầm nhìn */}
      <section className="py-24 bg-surface">
        <div className="max-w-container-max mx-auto px-margin-mobile lg:px-margin-desktop">
          <div className="text-center mb-14">
            <span className="text-secondary font-semibold tracking-widest uppercase mb-4 block text-sm">
              Mission &amp; Vision
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-primary">
              Sứ mệnh của chúng tôi
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-10 rounded-3xl shadow-glass border border-outline-variant/30 hover:shadow-xl transition-all">
              <div className="w-16 h-16 bg-primary-container rounded-2xl flex items-center justify-center mb-8 text-white">
                <Icon name="rocket_launch" className="text-3xl" />
              </div>
              <h3 className="text-2xl font-bold text-primary mb-4">
                Sứ mệnh
              </h3>
              <p className="text-on-surface-variant leading-relaxed">
                Navico cung cấp các giải pháp dinh dưỡng, phụ gia và công nghệ
                sinh học tiên tiến cho ngành nuôi trồng thủy sản, giúp nâng cao
                hiệu quả sản xuất, cải thiện sức khỏe vật nuôi và hướng đến phát
                triển bền vững.
              </p>
            </div>
            <div className="bg-white p-10 rounded-3xl shadow-glass border border-outline-variant/30 hover:shadow-xl transition-all">
              <div className="w-16 h-16 bg-secondary-container rounded-2xl flex items-center justify-center mb-8 text-on-secondary-container">
                <Icon name="visibility" className="text-3xl" />
              </div>
              <h3 className="text-2xl font-bold text-primary mb-4">
                Tầm nhìn
              </h3>
              <p className="text-on-surface-variant leading-relaxed">
                Trở thành đối tác đáng tin cậy trong lĩnh vực dinh dưỡng và giải
                pháp thủy sản, góp phần xây dựng ngành nuôi trồng hiện đại, hiệu
                quả và thân thiện với môi trường.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mạng lưới & Giá trị */}
      <section className="py-24 bg-primary text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-10">
          <div className="w-full h-full rounded-full border-2 border-dashed border-white/30 scale-150" />
        </div>
        <div className="max-w-container-max mx-auto px-margin-mobile lg:px-margin-desktop relative z-10">
          <div className="grid lg:grid-cols-3 gap-16 items-center">
            <div className="lg:col-span-1">
              <span className="text-secondary-fixed-dim font-semibold tracking-widest uppercase mb-4 block text-sm">
                Global Network
              </span>
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                Mạng lưới &amp; giá trị chúng tôi mang lại
              </h2>
              <p className="text-white/70 mb-8">
                Navico hợp tác với các đối tác trong và ngoài nước nhằm mang đến
                giải pháp dinh dưỡng, công nghệ sinh học và phụ gia thủy sản phù
                hợp với từng điều kiện nuôi thực tế.
              </p>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full border border-secondary/40 flex items-center justify-center">
                    <Icon name="public" className="text-secondary-fixed-dim" />
                  </div>
                  <div>
                    <div className="text-xl font-bold">60+ tỉnh thành</div>
                    <div className="text-sm opacity-60">Thị trường hiện diện</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full border border-secondary/40 flex items-center justify-center">
                    <Icon name="biotech" className="text-secondary-fixed-dim" />
                  </div>
                  <div>
                    <div className="text-xl font-bold">40+ đối tác</div>
                    <div className="text-sm opacity-60">Trong và ngoài nước</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:col-span-2">
              <div className="bg-primary-container rounded-3xl p-8 shadow-2xl">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                  {impactStats.map((s) => (
                    <div
                      key={s.label}
                      className="p-4 bg-white/5 rounded-2xl border border-white/10 text-center"
                    >
                      <div className="text-3xl font-bold text-secondary-fixed-dim">
                        {s.value}
                      </div>
                      <div className="text-xs uppercase mt-2 text-white/60">
                        {s.label}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="h-44 relative">
                  <div className="text-center text-sm text-white/40 mb-3">
                    Tăng trưởng chỉ số tác động bền vững (2020-2025)
                  </div>
                  <div className="flex items-end justify-between gap-3 h-32 px-2">
                    {growthBars.map((h, i) => (
                      <div
                        key={i}
                        className={`flex-1 rounded-t-lg ${
                          i === 3 ? "bg-secondary-fixed-dim" : "bg-secondary/70"
                        }`}
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Thương hiệu đồng hành */}
      {partners.length > 0 && (
        <section className="py-20 bg-white overflow-hidden">
          <div className="max-w-container-max mx-auto px-margin-mobile lg:px-margin-desktop text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-primary">
              Thương hiệu đồng hành
            </h2>
          </div>
          <div className="relative marquee-mask">
            <div className="flex w-max animate-marquee">
              {/* Lặp 2 lần để cuộn liền mạch */}
              {[...partners, ...partners].map((p, i) => (
                <div
                  key={`${p.id}-${i}`}
                  className="px-8 shrink-0 flex items-center justify-center"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.logo}
                    alt={p.name}
                    className="h-14 w-auto object-contain opacity-70 hover:opacity-100 transition-opacity"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-margin-mobile text-center">
          <h2 className="text-3xl font-bold text-primary mb-4">
            Sẵn sàng đồng hành cùng Navico?
          </h2>
          <p className="text-on-surface-variant mb-8 text-lg">
            Liên hệ với đội ngũ chuyên gia của chúng tôi để được tư vấn giải pháp
            phù hợp nhất cho mô hình nuôi của bạn.
          </p>
          <Link
            href="/lien-he"
            className="inline-flex items-center gap-2 bg-secondary text-white px-8 py-4 rounded-xl font-semibold hover:brightness-110 transition-all"
          >
            Liên hệ tư vấn <Icon name="arrow_forward" />
          </Link>
        </div>
      </section>
    </>
  );
}
