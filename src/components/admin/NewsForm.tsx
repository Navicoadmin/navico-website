"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { slugify } from "@/lib/slug";
import { ImageUploadField } from "@/components/admin/ImageUploadField";

export type NewsFormData = {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  tag: string;
  author: string;
  published: boolean;
  metaTitle: string;
  metaDescription: string;
};

const inputCls =
  "w-full px-3 py-2.5 border border-outline-variant rounded-lg text-sm focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary";

export function NewsForm({ initial }: { initial?: NewsFormData }) {
  const router = useRouter();
  const editing = !!initial?.id;
  const [form, setForm] = useState<NewsFormData>(
    initial ?? {
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      coverImage: "",
      tag: "",
      author: "Navico",
      published: true,
      metaTitle: "",
      metaDescription: "",
    }
  );
  const [slugEdited, setSlugEdited] = useState(editing);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  function set<K extends keyof NewsFormData>(k: K, v: NewsFormData[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch(editing ? `/api/news/${form.id}` : "/api/news", {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.message || "Lưu thất bại");
      router.push("/admin/news");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Có lỗi xảy ra");
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-6 max-w-4xl">
      <div className="bg-white rounded-2xl border border-outline-variant/60 p-6 space-y-4">
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-on-surface-variant">Tiêu đề</label>
          <input
            className={inputCls}
            required
            value={form.title}
            onChange={(e) => {
              const title = e.target.value;
              setForm((f) => ({
                ...f,
                title,
                slug: slugEdited ? f.slug : slugify(title),
              }));
            }}
          />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-on-surface-variant">Slug</label>
            <input
              className={inputCls}
              required
              value={form.slug}
              onChange={(e) => {
                setSlugEdited(true);
                set("slug", e.target.value);
              }}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-on-surface-variant">Chủ đề (tag)</label>
            <input
              className={inputCls}
              value={form.tag}
              placeholder="vd: Vi sinh"
              onChange={(e) => set("tag", e.target.value)}
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-on-surface-variant">Tóm tắt</label>
          <textarea
            className={inputCls}
            rows={2}
            required
            value={form.excerpt}
            onChange={(e) => set("excerpt", e.target.value)}
          />
        </div>
        <ImageUploadField
          label="Ảnh bìa"
          value={form.coverImage}
          onChange={(url) => set("coverImage", url)}
        />
      </div>

      <div className="bg-white rounded-2xl border border-outline-variant/60 p-6 space-y-2">
        <label className="text-sm font-semibold text-on-surface-variant">
          Nội dung (HTML)
        </label>
        <textarea
          className={`${inputCls} font-mono text-xs`}
          rows={14}
          required
          value={form.content}
          onChange={(e) => set("content", e.target.value)}
          placeholder="<p>Nội dung bài viết...</p>"
        />
        <p className="text-xs text-on-surface-variant">
          Hỗ trợ thẻ HTML cơ bản: &lt;p&gt;, &lt;h2&gt;, &lt;ul&gt;, &lt;a&gt;...
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-outline-variant/60 p-6 space-y-4">
        <h2 className="font-bold text-primary">SEO &amp; Trạng thái</h2>
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-on-surface-variant">Meta Title</label>
          <input
            className={inputCls}
            value={form.metaTitle}
            onChange={(e) => set("metaTitle", e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-on-surface-variant">Meta Description</label>
          <textarea
            className={inputCls}
            rows={2}
            value={form.metaDescription}
            onChange={(e) => set("metaDescription", e.target.value)}
          />
        </div>
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={form.published}
            onChange={(e) => set("published", e.target.checked)}
            className="size-4 accent-secondary"
          />
          Hiển thị công khai
        </label>
      </div>

      {error && (
        <p className="text-sm text-error bg-error-container/40 rounded-lg px-4 py-3">
          {error}
        </p>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={busy}
          className="bg-secondary text-white px-8 py-3 rounded-lg font-semibold hover:brightness-110 disabled:opacity-60"
        >
          {busy ? "Đang lưu..." : editing ? "Cập nhật" : "Đăng bài"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/news")}
          className="px-6 py-3 rounded-lg border border-outline-variant text-on-surface-variant"
        >
          Hủy
        </button>
      </div>
    </form>
  );
}
