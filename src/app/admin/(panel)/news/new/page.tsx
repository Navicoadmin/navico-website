import Link from "next/link";
import { Icon } from "@/components/Icon";
import { NewsForm } from "@/components/admin/NewsForm";

export default function NewNewsPage() {
  return (
    <div className="space-y-6">
      <Link
        href="/admin/news"
        className="inline-flex items-center gap-1 text-sm text-on-surface-variant hover:text-secondary"
      >
        <Icon name="arrow_back" className="text-lg" /> Quay lại danh sách
      </Link>
      <h1 className="text-2xl font-bold text-primary">Viết bài mới</h1>
      <NewsForm />
    </div>
  );
}
