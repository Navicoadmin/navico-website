import type { Metadata } from "next";
import { Icon } from "@/components/Icon";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Hoạt động & Sự kiện",
  description:
    "Hành trình của Navico qua các triển lãm, hội thảo kỹ thuật và hoạt động cộng đồng trong ngành nuôi trồng thủy sản.",
};

// Hoạt động đọc từ DB (admin đăng) nên render động
export const dynamic = "force-dynamic";

const HERO =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBqGQSkHmRzNNssPuXdP7PWGAXmQazyu_SSw7VLpFMHbAPt7tMCji5APufE8lrTnZSIEUNIGkKLgt8DOhHEYpEQAdeFqvkjvjhCq1rhGDyBDQFOsaKLvqP3LZ97KxLMv85xySkFoLC_m7oixaSWJMstgJ8UKds9KU3g8Xfra9jQpdu024Qaz-WLMJvKZop2pG8DIRXamjNXaVKH8V9BdFn0PhfC-A5yf-s81jEw0lat_o2Vs5v5YVfaaoBrG1RuX3xN9Puz9PLqNyA";

function formatDate(d: Date) {
  return new Date(d).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default async function ActivitiesPage() {
  const activities = await prisma.activity.findMany({
    where: { published: true },
    orderBy: { date: "desc" },
  });

  return (
    <>
      {/* Hero */}
      <section className="relative h-[42vh] min-h-[300px] flex items-center justify-center overflow-hidden bg-primary text-white">
        <div className="absolute inset-0 opacity-40">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={HERO} alt="Hoạt động Navico" className="w-full h-full object-cover" />
        </div>
        <div className="relative z-10 text-center px-margin-mobile">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            Hoạt động &amp; Sự kiện
          </h1>
          <p className="text-lg max-w-2xl mx-auto opacity-90">
            Hành trình kiến tạo tương lai bền vững cho ngành thủy sản thông qua
            nghiên cứu khoa học và kết nối cộng đồng.
          </p>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 px-margin-mobile lg:px-margin-desktop max-w-container-max mx-auto">
        {activities.length === 0 && (
          <p className="text-center text-on-surface-variant py-10">
            Chưa có hoạt động nào được đăng.
          </p>
        )}
        <div className="relative">
          {/* Đường dọc timeline */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-outline-variant/40 md:-translate-x-1/2" />

          <div className="space-y-16">
            {activities.map((act, i) => {
              const leftContent = i % 2 === 0; // xen kẽ trái/phải trên desktop
              const content = (
                <div className={leftContent ? "md:text-right md:pr-16" : "md:pl-16"}>
                  <span className="inline-block px-4 py-1 rounded-full bg-secondary/10 text-secondary font-semibold text-sm mb-4">
                    {act.tag}
                  </span>
                  <h2 className="text-2xl lg:text-3xl font-bold text-primary mb-3">
                    {act.title}
                  </h2>
                  <p
                    className={`text-on-surface-variant leading-relaxed mb-4 ${
                      leftContent ? "md:ml-auto" : ""
                    } max-w-lg`}
                  >
                    {act.description}
                  </p>
                  <div
                    className={`flex items-center gap-2 text-on-surface-variant text-sm ${
                      leftContent ? "md:justify-end" : ""
                    }`}
                  >
                    <Icon name="calendar_today" className="text-base" /> {formatDate(act.date)}
                  </div>
                </div>
              );
              const gallery = (
                <div
                  className={`grid gap-4 ${
                    act.images.length > 1 ? "grid-cols-2" : "grid-cols-1"
                  }`}
                >
                  {act.images.map((src, j) => (
                    <div
                      key={j}
                      className="relative aspect-[4/3] rounded-xl overflow-hidden bg-surface-container group"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={src}
                        alt={`${act.title} ${j + 1}`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                  ))}
                </div>
              );

              return (
                <div key={act.id} className="relative md:grid md:grid-cols-2 md:gap-12 items-center pl-12 md:pl-0">
                  {/* Chấm timeline */}
                  <div className="absolute left-4 md:left-1/2 top-2 w-4 h-4 bg-secondary border-4 border-background rounded-full -translate-x-1/2 z-10" />
                  {leftContent ? (
                    <>
                      {content}
                      {gallery}
                    </>
                  ) : (
                    <>
                      <div className="md:order-2">{content}</div>
                      <div className="md:order-1 mb-6 md:mb-0">{gallery}</div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA đăng ký */}
        <div className="mt-20 max-w-3xl mx-auto bg-surface-container-low border border-primary/5 p-10 rounded-3xl text-center shadow-sm">
          <h3 className="text-2xl lg:text-3xl font-bold text-primary mb-4">
            Bạn muốn đồng hành cùng chúng tôi?
          </h3>
          <p className="text-on-surface-variant mb-6">
            Đăng ký nhận bản tin để không bỏ lỡ các buổi hội thảo kỹ thuật và sự
            kiện triển lãm mới nhất từ Navico.
          </p>
          <form className="flex flex-col sm:flex-row gap-3 justify-center">
            <input
              type="email"
              placeholder="Email của bạn"
              className="px-5 py-3.5 rounded-xl border border-outline-variant focus:ring-2 focus:ring-secondary focus:border-secondary outline-none bg-white sm:min-w-[300px]"
              aria-label="Email"
            />
            <button
              type="submit"
              className="px-8 py-3.5 bg-secondary text-white font-semibold rounded-xl hover:brightness-110 transition-all"
            >
              Đăng ký ngay
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
