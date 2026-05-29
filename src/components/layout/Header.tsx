"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Icon } from "@/components/Icon";
import { mainNav } from "@/lib/site";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");
  const pathname = usePathname();
  const router = useRouter();

  // Đổ bóng header khi cuộn xuống
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Đóng menu mobile khi đổi trang
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (q) router.push(`/san-pham?q=${encodeURIComponent(q)}`);
  };

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 nav-glass border-b border-outline-variant transition-shadow ${
        scrolled ? "shadow-md" : ""
      }`}
    >
      <div className="max-w-container-max mx-auto px-margin-mobile lg:px-margin-desktop h-20 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center" aria-label="NAVICO - Trang chủ">
            <Image
              src="/logo.png"
              alt="NAVICO"
              width={150}
              height={56}
              priority
              className="h-11 w-auto object-contain"
            />
          </Link>
          <div className="hidden lg:flex items-center gap-6">
            {mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-secondary ${
                  isActive(item.href)
                    ? "text-secondary"
                    : "text-on-surface-variant"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <form
            onSubmit={onSearch}
            className="hidden xl:flex items-center bg-surface-container rounded-lg px-3 py-1.5 border border-outline-variant focus-within:border-secondary"
          >
            <Icon name="search" className="text-on-surface-variant text-xl" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-sm w-40 px-2"
              placeholder="Tìm kiếm giải pháp..."
              aria-label="Tìm kiếm sản phẩm"
            />
          </form>
          <Link
            href="/lien-he"
            className="hidden sm:inline-block bg-primary-container text-white px-6 py-2.5 rounded-lg text-sm font-bold hover:opacity-90 transition-all"
          >
            Tư vấn
          </Link>
          {/* Nút mở menu trên mobile */}
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="lg:hidden size-10 flex items-center justify-center text-primary"
            aria-label="Mở menu"
            aria-expanded={mobileOpen}
          >
            <Icon name={mobileOpen ? "close" : "menu"} className="text-3xl" />
          </button>
        </div>
      </div>

      {/* Menu mobile */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-outline-variant bg-white px-margin-mobile py-4 space-y-1">
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block py-2.5 text-base font-medium ${
                isActive(item.href) ? "text-secondary" : "text-on-surface"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/lien-he"
            className="block mt-3 text-center bg-primary-container text-white px-6 py-3 rounded-lg text-sm font-bold"
          >
            Tư vấn miễn phí
          </Link>
        </div>
      )}
    </nav>
  );
}
