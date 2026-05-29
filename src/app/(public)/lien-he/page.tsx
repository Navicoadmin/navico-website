import type { Metadata } from "next";
import { Breadcrumb } from "@/components/Breadcrumb";
import { ContactForm } from "@/components/ContactForm";
import { Icon } from "@/components/Icon";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Liên hệ",
  description:
    "Liên hệ Navico để được tư vấn kỹ thuật 24/7. Hotline, email và địa chỉ nhà máy.",
};

const infoCards = [
  {
    icon: "call",
    label: "Hotline",
    value: siteConfig.hotline,
    href: `tel:${siteConfig.hotline.replace(/\s/g, "")}`,
  },
  {
    icon: "mail",
    label: "Email",
    value: siteConfig.email,
    href: `mailto:${siteConfig.email}`,
  },
  {
    icon: "location_on",
    label: "Địa chỉ",
    value: siteConfig.address,
  },
];

export default function ContactPage() {
  return (
    <div className="max-w-container-max mx-auto px-margin-mobile lg:px-margin-desktop py-10">
      <Breadcrumb
        items={[{ label: "Trang chủ", href: "/" }, { label: "Liên hệ" }]}
      />

      <div className="mt-8 mb-12 max-w-2xl">
        <span className="text-secondary font-bold uppercase tracking-widest text-sm">
          Liên hệ
        </span>
        <h1 className="text-3xl lg:text-4xl font-bold text-primary mt-3 mb-4">
          Kết nối với chuyên gia Navico
        </h1>
        <p className="text-on-surface-variant text-lg">
          Đội ngũ kỹ sư của chúng tôi sẵn sàng hỗ trợ bạn 24/7. Gửi thông tin
          hoặc gọi trực tiếp để được tư vấn nhanh nhất.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-12">
        {infoCards.map((c) => {
          const inner = (
            <>
              <div className="size-12 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary mb-4">
                <Icon name={c.icon} className="text-2xl" />
              </div>
              <p className="text-xs text-on-surface-variant uppercase tracking-wider mb-1">
                {c.label}
              </p>
              <p className="font-bold text-primary">{c.value}</p>
            </>
          );
          return c.href ? (
            <a
              key={c.label}
              href={c.href}
              className="block p-6 bg-white rounded-2xl border border-outline-variant/60 hover:border-secondary hover:shadow-md transition-all"
            >
              {inner}
            </a>
          ) : (
            <div
              key={c.label}
              className="p-6 bg-white rounded-2xl border border-outline-variant/60"
            >
              {inner}
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-0 bg-primary rounded-[2rem] overflow-hidden">
        <div className="p-8 lg:p-12 space-y-8">
          <div className="space-y-3 text-white">
            <h2 className="text-2xl lg:text-3xl font-bold">Gửi yêu cầu tư vấn</h2>
            <p className="text-on-primary-container">
              Điền thông tin, chúng tôi sẽ phản hồi trong thời gian sớm nhất.
            </p>
          </div>
          <ContactForm variant="dark" />
        </div>
        <div className="relative min-h-[360px] bg-primary-container">
          {/* Bản đồ Google Maps khu vực nhà máy */}
          <iframe
            title="Bản đồ Navico"
            src="https://www.google.com/maps?q=KCN+Xuyen+A+Tay+Ninh&output=embed"
            className="absolute inset-0 w-full h-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </div>
  );
}
