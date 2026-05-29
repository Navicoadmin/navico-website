"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/Icon";
import { slugify } from "@/lib/slug";
import { ImageUploadField } from "@/components/admin/ImageUploadField";

type Activity = {
  id: string;
  title: string;
  slug: string;
  tag: string | null;
  description: string;
  date: string; // yyyy-mm-dd
  images: string[];
  published: boolean;
};

const today = new Date().toISOString().slice(0, 10);
const empty = {
  id: "",
  title: "",
  slug: "",
  tag: "",
  description: "",
  date: today,
  images: [] as string[],
  published: true,
};

export function ActivityManager({ initial }: { initial: Activity[] }) {
  const router = useRouter();
  const [form, setForm] = useState<typeof empty>(empty);
  const [slugEdited, setSlugEdited] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const editing = !!form.id;

  function startEdit(a: Activity) {
    setForm({
      id: a.id,
      title: a.title,
      slug: a.slug,
      tag: a.tag ?? "",
      description: a.description,
      date: a.date,
      images: a.images,
      published: a.published,
    });
    setSlugEdited(true);
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function reset() {
    setForm(empty);
    setSlugEdited(false);
    setError("");
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch(
        editing ? `/api/activities/${form.id}` : "/api/activities",
        {
          method: editing ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.message || "Lưu thất bại");
      reset();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Có lỗi xảy ra");
    } finally {
      setBusy(false);
    }
  }

  async function remove(a: Activity) {
    if (!confirm(`Xóa hoạt động "${a.title}"?`)) return;
    const res = await fetch(`/api/activities/${a.id}`, { method: "DELETE" });
    if (res.ok) router.refresh();
  }

  function setImage(idx: number, url: string) {
    setForm((f) => {
      const images = [...f.images];
      if (url) images[idx] = url;
      else images.splice(idx, 1);
      return { ...f, images };
    });
  }

  const inputCls =
    "w-full px-3 py-2.5 border border-outline-variant rounded-lg text-sm focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary";

  return (
    <div className="grid lg:grid-cols-5 gap-6">
      <form
        onSubmit={save}
        className="lg:col-span-2 bg-white rounded-2xl border border-outline-variant/60 p-6 space-y-4 h-fit"
      >
        <h2 className="font-bold text-primary">
          {editing ? "Sửa hoạt động" : "Đăng hoạt động"}
        </h2>
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-on-surface-variant">Tiêu đề</label>
          <input
            className={inputCls}
            required
            value={form.title}
            onChange={(e) => {
              const title = e.target.value;
              setForm((f) => ({ ...f, title, slug: slugEdited ? f.slug : slugify(title) }));
            }}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-on-surface-variant">Slug</label>
            <input
              className={inputCls}
              required
              value={form.slug}
              onChange={(e) => {
                setSlugEdited(true);
                setForm((f) => ({ ...f, slug: e.target.value }));
              }}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-on-surface-variant">Loại</label>
            <input
              className={inputCls}
              value={form.tag}
              placeholder="Triển lãm / Hội thảo..."
              onChange={(e) => setForm((f) => ({ ...f, tag: e.target.value }))}
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-on-surface-variant">Ngày diễn ra</label>
          <input
            type="date"
            className={inputCls}
            required
            value={form.date}
            onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-on-surface-variant">Mô tả</label>
          <textarea
            className={inputCls}
            rows={4}
            required
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          />
        </div>

        {/* Hình ảnh (nhiều) */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-on-surface-variant">
            Hình ảnh ({form.images.length})
          </label>
          {form.images.map((img, i) => (
            <ImageUploadField
              key={i}
              label={`Ảnh ${i + 1}`}
              value={img}
              onChange={(url) => setImage(i, url)}
            />
          ))}
          {form.images.length < 6 && (
            <ImageUploadField
              key={`new-${form.images.length}`}
              label="Thêm ảnh"
              value=""
              onChange={(url) =>
                url && setForm((f) => ({ ...f, images: [...f.images, url] }))
              }
            />
          )}
        </div>

        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={form.published}
            onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))}
            className="size-4 accent-secondary"
          />
          Hiển thị công khai
        </label>
        {error && (
          <p className="text-sm text-error bg-error-container/40 rounded px-3 py-2">
            {error}
          </p>
        )}
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={busy}
            className="flex-1 bg-secondary text-white py-2.5 rounded-lg font-semibold hover:brightness-110 disabled:opacity-60"
          >
            {busy ? "Đang lưu..." : editing ? "Cập nhật" : "Đăng"}
          </button>
          {editing && (
            <button
              type="button"
              onClick={reset}
              className="px-4 py-2.5 rounded-lg border border-outline-variant text-on-surface-variant"
            >
              Hủy
            </button>
          )}
        </div>
      </form>

      <div className="lg:col-span-3 space-y-3">
        {initial.length === 0 ? (
          <div className="bg-white rounded-2xl border border-outline-variant/60 py-16 text-center text-on-surface-variant">
            Chưa có hoạt động nào.
          </div>
        ) : (
          initial.map((a) => (
            <div
              key={a.id}
              className="bg-white rounded-2xl border border-outline-variant/60 p-4 flex items-start gap-4"
            >
              <div className="w-24 h-20 rounded-lg bg-surface-container overflow-hidden shrink-0">
                {a.images[0] && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={a.images[0]} alt={a.title} className="w-full h-full object-cover" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-primary line-clamp-1">{a.title}</h3>
                  {!a.published && (
                    <span className="text-xs bg-surface-container text-on-surface-variant rounded-full px-2 py-0.5 shrink-0">
                      Ẩn
                    </span>
                  )}
                </div>
                <p className="text-sm text-on-surface-variant">
                  {a.tag} · {new Date(a.date).toLocaleDateString("vi-VN")}
                </p>
              </div>
              <div className="flex gap-1 shrink-0">
                <button
                  onClick={() => startEdit(a)}
                  className="text-secondary hover:bg-secondary/10 rounded p-1.5"
                  aria-label="Sửa"
                >
                  <Icon name="edit" className="text-lg" />
                </button>
                <button
                  onClick={() => remove(a)}
                  className="text-error hover:bg-error-container/40 rounded p-1.5"
                  aria-label="Xóa"
                >
                  <Icon name="delete" className="text-lg" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
