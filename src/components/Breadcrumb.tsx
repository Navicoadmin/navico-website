import Link from "next/link";
import { Icon } from "@/components/Icon";

type Crumb = { label: string; href?: string };

export function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav
      aria-label="breadcrumb"
      className="flex items-center gap-2 text-on-surface-variant text-sm font-medium flex-wrap"
    >
      {items.map((item, i) => {
        const last = i === items.length - 1;
        return (
          <span key={i} className="flex items-center gap-2">
            {item.href && !last ? (
              <Link href={item.href} className="hover:text-secondary">
                {item.label}
              </Link>
            ) : (
              <span className="text-primary font-bold">{item.label}</span>
            )}
            {!last && (
              <Icon name="chevron_right" className="text-sm text-outline" />
            )}
          </span>
        );
      })}
    </nav>
  );
}
