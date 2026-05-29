"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/Icon";
import { ImageUploadField } from "@/components/admin/ImageUploadField";

type Slide = {
  id: string;
  image: string;
  title: string;
  subtitle: string | null;
  ctaLabel: string | null;
  ctaHref: string | null;
  order: number;
  active: boolean;
};

const empty = {
  id: "",
  image: "",
  title: "",
  subtitle: "",
  ctaLabel: "Khám phá sản phẩm",
  ctaHref: "/san-pham",
  order: 0,
  active: true,
};

export function HeroManager({ initial }: { initial: Slide[] }) {
  const router = useRouter();
  const [form, setForm] = useState<typeof empty>(empty);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const editing = !!form.id;

  function startEdit(s: Slide) {
    setForm({
      id: s.id,
      image: s.image,
      title: s.title,
      subtitle: s.subtitle ?? "",
      ctaLabel: s.ctaLabel ?? "",
      ctaHref: s.ctaHref ?? "",
      order: s.order,
      active: s.active,
    });
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function reset() {
    setForm(empty);
    setError("");
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!form.image) {
      setError("Vui lòng tải ảnh slide");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const res = await fetch(
        editing ? `/api/hero-slides/${form.id}` : "/api/hero-slides",
        {
          method: editing ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...form, order: Number(form.order) || 0 }),
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

  async function remove(s: Slide) {
    if (!confirm(`Xóa slide "${s.title}"?`)) return;
    const res = await fetch(`/api/hero-slides/${s.id}`, { method: "DELETE" });
    if (res.ok) router.refresh();
  }

  const inputCls =
    "w-full px-3 py-2.5 border border-outline-variant rounded-lg text-sm focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary";

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <form
        onSubmit={save}
        className="lg:col-span-1 bg-white rounded-2xl border border-outline-variant/60 p-6 space-y-4 h-fit"
      >
        <h2 className="font-bold text-primary">
          {editing ? "Sửa slide" : "Thêm slide"}
        </h2>
        <ImageUploadField
          label="Ảnh slide (khuyến nghị 1920×1080)"
          value={form.image}
          onChange={(url) => setForm((f) => ({ ...f, image: url }))}
        />
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-on-surface-variant">Tiêu đề</label>
          <input
            className={inputCls}
            required
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-on-surface-variant">Mô tả</label>
          <textarea
            className={inputCls}
            rows={2}
            value={form.subtitle}
            onChange={(e) => setForm((f) => ({ ...f, subtitle: e.target.value }))}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-on-surface-variant">Nút (chữ)</label>
            <input
              className={inputCls}
              value={form.ctaLabel}
              onChange={(e) => setForm((f) => ({ ...f, ctaLabel: e.target.value }))}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-on-surface-variant">Nút (link)</label>
            <input
              className={inputCls}
              value={form.ctaHref}
              onChange={(e) => setForm((f) => ({ ...f, ctaHref: e.target.value }))}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 items-center">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-on-surface-variant">Thứ tự</label>
            <input
              type="number"
              className={inputCls}
              value={form.order}
              onChange={(e) => setForm((f) => ({ ...f, order: Number(e.target.value) }))}
            />
          </div>
          <label className="flex items-center gap-2 text-sm cursor-pointer mt-6">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))}
              className="size-4 accent-secondary"
            />
            Hiển thị
          </label>
        </div>
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
            {busy ? "Đang lưu..." : editing ? "Cập nhật" : "Thêm slide"}
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

      <div className="lg:col-span-2 space-y-4">
        {initial.length === 0 ? (
          <div className="bg-white rounded-2xl border border-outline-variant/60 py-16 text-center text-on-surface-variant">
            Chưa có slide nào.
          </div>
        ) : (
          initial.map((s) => (
            <div
              key={s.id}
              className="bg-white rounded-2xl border border-outline-variant/60 overflow-hidden flex flex-col sm:flex-row"
            >
              <div className="sm:w-56 h-32 bg-surface-container shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s.image} alt={s.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-primary">{s.title}</h3>
                  {!s.active && (
                    <span className="text-xs bg-surface-container text-on-surface-variant rounded-full px-2 py-0.5">
                      Ẩn
                    </span>
                  )}
                </div>
                <p className="text-sm text-on-surface-variant line-clamp-2 flex-1">
                  {s.subtitle}
                </p>
                <div className="flex gap-1 mt-2">
                  <button
                    onClick={() => startEdit(s)}
                    className="text-secondary hover:bg-secondary/10 rounded p-1.5"
                    aria-label="Sửa"
                  >
                    <Icon name="edit" className="text-lg" />
                  </button>
                  <button
                    onClick={() => remove(s)}
                    className="text-error hover:bg-error-container/40 rounded p-1.5"
                    aria-label="Xóa"
                  >
                    <Icon name="delete" className="text-lg" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
