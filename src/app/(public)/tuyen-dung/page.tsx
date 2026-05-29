import type { Metadata } from "next";
import { Icon } from "@/components/Icon";
import { siteConfig } from "@/lib/site";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Tuyển dụng",
  description:
    "Cơ hội nghề nghiệp tại Navico - gia nhập đội ngũ kiến tạo tương lai thủy sản bền vững bằng khoa học và công nghệ sinh học.",
};

// Vị trí tuyển dụng đọc từ DB (admin đăng tin) nên render động
export const dynamic = "force-dynamic";

const HERO =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuA58hDDWoyoG1si5tSbtxYK6pnroFnD2QAZ1RIEr6QvrowaPxuvhdWeGYdEPmrVvwSve3ZQwUHkIXAu-DkVkZ2ei72ig0r-nzZsTfPZ49GEwEl8QSmqdm9HSn2ySsujhJNVJJgH_Lc4x1K-310CdDkNZbM2MkLVPuHLTBtyRkTa86eOZZN5M45tLK-2jfAM0O9ayhJPphsOjaFa3c7YKP1E_4gJG2S97BIp-5gGjRV7iqtjlA6u-qJMvvZ2_AnHwhFvl0BxgHg4jEc";

const benefits = [
  {
    icon: "science",
    title: "Môi trường nghiên cứu hiện đại",
    desc: "Phòng lab và thiết bị công nghệ cao, không gian sáng tạo cho R&D.",
  },
  {
    icon: "health_and_safety",
    title: "Bảo hiểm cao cấp",
    desc: "Gói bảo hiểm sức khỏe toàn diện cho nhân viên và gia đình.",
  },
  {
    icon: "school",
    title: "Đào tạo quốc tế",
    desc: "Cơ hội học tập, hội thảo và chuyển giao công nghệ với đối tác toàn cầu.",
  },
  {
    icon: "payments",
    title: "Lương thưởng cạnh tranh",
    desc: "Chính sách đãi ngộ hấp dẫn cùng thưởng theo hiệu quả công việc.",
  },
];

export default async function CareersPage() {
  const jobs = await prisma.job.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
  });

  const mail = (position: string) =>
    `mailto:${siteConfig.email}?subject=${encodeURIComponent(
      "Ứng tuyển: " + position
    )}`;

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[55vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={HERO} alt="Tuyển dụng Navico" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/60 to-transparent" />
        </div>
        <div className="relative z-10 max-w-container-max mx-auto px-margin-mobile lg:px-margin-desktop w-full py-20">
          <div className="max-w-2xl">
            <span className="inline-block px-4 py-1 rounded-full bg-secondary/20 text-secondary-fixed-dim font-semibold text-sm mb-6">
              CƠ HỘI NGHỀ NGHIỆP
            </span>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              Kiến tạo tương lai thủy sản bền vững
            </h1>
            <p className="text-lg text-white/85 mb-8 max-w-xl">
              Gia nhập đội ngũ Navico - nơi khoa học, công nghệ sinh học và tinh
              thần đổi mới cùng nhau tạo nên giá trị cho ngành nuôi trồng thủy
              sản Việt Nam.
            </p>
            <a
              href="#vi-tri"
              className="inline-flex items-center gap-2 bg-secondary text-white px-8 py-4 rounded-xl font-semibold hover:brightness-110 transition-all"
            >
              Xem vị trí ứng tuyển <Icon name="arrow_downward" />
            </a>
          </div>
        </div>
      </section>

      {/* Văn hóa & Giá trị */}
      <section className="py-24 bg-white">
        <div className="max-w-container-max mx-auto px-margin-mobile lg:px-margin-desktop">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-secondary font-semibold tracking-widest uppercase text-sm">
              Vì sao chọn Navico
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-primary mt-3">
              Văn hóa &amp; Giá trị tại Navico
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((b) => (
              <div
                key={b.title}
                className="bg-surface-container-low rounded-2xl p-8 border border-outline-variant/40 hover:border-secondary hover:shadow-md transition-all"
              >
                <div className="size-14 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center mb-5">
                  <Icon name={b.icon} className="text-3xl" />
                </div>
                <h3 className="text-lg font-bold text-primary mb-2">{b.title}</h3>
                <p className="text-sm text-on-surface-variant">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vị trí đang mở */}
      <section id="vi-tri" className="py-24 bg-surface">
        <div className="max-w-container-max mx-auto px-margin-mobile lg:px-margin-desktop">
          <div className="mb-12">
            <span className="text-secondary font-semibold tracking-widest uppercase text-sm">
              Tuyển dụng
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-primary mt-3">
              Vị trí đang mở
            </h2>
          </div>
          {jobs.length === 0 ? (
            <div className="bg-white rounded-2xl border border-outline-variant/40 py-14 text-center text-on-surface-variant">
              Hiện chưa có vị trí tuyển dụng. Vui lòng quay lại sau.
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white rounded-2xl border border-outline-variant/40 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-md hover:border-secondary/40 transition-all"
                >
                  <div>
                    <h3 className="text-xl font-bold text-primary mb-2">
                      {job.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-on-surface-variant">
                      {job.department && (
                        <span className="flex items-center gap-1.5">
                          <Icon name="apartment" className="text-base" /> {job.department}
                        </span>
                      )}
                      {job.type && (
                        <span className="flex items-center gap-1.5">
                          <Icon name="schedule" className="text-base" /> {job.type}
                        </span>
                      )}
                      {job.location && (
                        <span className="flex items-center gap-1.5">
                          <Icon name="location_on" className="text-base" /> {job.location}
                        </span>
                      )}
                    </div>
                  </div>
                  <a
                    href={mail(job.title)}
                    className="shrink-0 inline-flex items-center justify-center gap-2 bg-primary-container text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary transition-all"
                  >
                    Ứng tuyển ngay <Icon name="arrow_forward" className="text-lg" />
                  </a>
                </div>
              ))}
            </div>
          )}

          <p className="mt-10 text-center text-on-surface-variant">
            Không tìm thấy vị trí phù hợp? Gửi CV của bạn tới{" "}
            <a href={`mailto:${siteConfig.email}`} className="text-secondary font-semibold hover:underline">
              {siteConfig.email}
            </a>
          </p>
        </div>
      </section>
    </>
  );
}
