import Link from "next/link";
import Image from "next/image";
import { Icon } from "@/components/Icon";
import { footerLinks, siteConfig } from "@/lib/site";

export function Footer() {
  return (
    <footer className="bg-primary text-white pt-20 pb-10">
      <div className="max-w-container-max mx-auto px-margin-mobile lg:px-margin-desktop">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Cột thương hiệu */}
          <div className="space-y-6">
            <div className="inline-block bg-white rounded-lg px-3 py-2">
              <Image
                src="/logo.png"
                alt="NAVICO"
                width={150}
                height={56}
                className="h-10 w-auto object-contain"
              />
            </div>
            <p className="text-white/70 leading-relaxed">
              Cung cấp giải pháp dinh dưỡng, phụ gia và công nghệ sinh học cho
              ngành nuôi trồng thủy sản, hướng đến hiệu quả và phát triển bền
              vững.
            </p>
            <div className="flex gap-4">
              <a
                href={siteConfig.social.website}
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-secondary transition-all"
                aria-label="Website"
              >
                <Icon name="language" />
              </a>
              <a
                href={`mailto:${siteConfig.email}`}
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-secondary transition-all"
                aria-label="Email"
              >
                <Icon name="mail" />
              </a>
              <a
                href={`tel:${siteConfig.hotline.replace(/\s/g, "")}`}
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-secondary transition-all"
                aria-label="Gọi điện"
              >
                <Icon name="call" />
              </a>
            </div>
          </div>

          {/* Cột sản phẩm */}
          <div>
            <h4 className="font-bold mb-6 uppercase tracking-wider text-sm">
              Sản phẩm
            </h4>
            <ul className="space-y-4">
              {footerLinks.products.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Cột hỗ trợ */}
          <div>
            <h4 className="font-bold mb-6 uppercase tracking-wider text-sm">
              Hỗ trợ
            </h4>
            <ul className="space-y-4">
              {footerLinks.support.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Cột bản tin */}
          <div>
            <h4 className="font-bold mb-6 uppercase tracking-wider text-sm">
              Đăng ký bản tin
            </h4>
            <p className="text-sm text-white/70 mb-4">
              Nhận cập nhật kỹ thuật mới nhất từ chuyên gia.
            </p>
            <form className="flex gap-2">
              <input
                type="email"
                className="bg-white/10 border border-white/10 rounded p-2 flex-1 text-sm outline-none focus:border-secondary"
                placeholder="Email của bạn"
                aria-label="Email đăng ký bản tin"
              />
              <button
                type="submit"
                className="bg-secondary p-2 rounded hover:brightness-110 transition"
                aria-label="Đăng ký"
              >
                <Icon name="send" />
              </button>
            </form>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/50">
          <p>© 2026 Navico. All Rights Reserved.</p>
          <div className="flex gap-6">
            {footerLinks.legal.map((l) => (
              <Link key={l.label} href={l.href} className="hover:text-white">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
