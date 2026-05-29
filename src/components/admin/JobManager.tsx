"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/Icon";
import { slugify } from "@/lib/slug";

type Job = {
  id: string;
  title: string;
  slug: string;
  department: string | null;
  type: string | null;
  location: string | null;
  description: string | null;
  published: boolean;
  order: number;
};

const empty = {
  id: "",
  title: "",
  slug: "",
  department: "",
  type: "Toàn thời gian",
  location: "",
  description: "",
  published: true,
  order: 0,
};

export function JobManager({ initial }: { initial: Job[] }) {
  const router = useRouter();
  const [form, setForm] = useState<typeof empty>(empty);
  const [slugEdited, setSlugEdited] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const editing = !!form.id;

  function startEdit(j: Job) {
    setForm({
      id: j.id,
      title: j.title,
      slug: j.slug,
      department: j.department ?? "",
      type: j.type ?? "",
      location: j.location ?? "",
      description: j.description ?? "",
      published: j.published,
      order: j.order,
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
      const res = await fetch(editing ? `/api/jobs/${form.id}` : "/api/jobs", {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, order: Number(form.order) || 0 }),
      });
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

  async function remove(j: Job) {
    if (!confirm(`Xóa vị trí "${j.title}"?`)) return;
    const res = await fetch(`/api/jobs/${j.id}`, { method: "DELETE" });
    if (res.ok) router.refresh();
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
          {editing ? "Sửa vị trí" : "Đăng vị trí mới"}
        </h2>
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-on-surface-variant">Tên vị trí</label>
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
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-on-surface-variant">Phòng ban</label>
            <input
              className={inputCls}
              value={form.department}
              onChange={(e) => setForm((f) => ({ ...f, department: e.target.value }))}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-on-surface-variant">Hình thức</label>
            <input
              className={inputCls}
              value={form.type}
              onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-on-surface-variant">Địa điểm</label>
          <input
            className={inputCls}
            value={form.location}
            onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-on-surface-variant">Mô tả (tùy chọn)</label>
          <textarea
            className={inputCls}
            rows={4}
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          />
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
              checked={form.published}
              onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))}
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
            {busy ? "Đang lưu..." : editing ? "Cập nhật" : "Đăng tin"}
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
            Chưa có vị trí nào.
          </div>
        ) : (
          initial.map((j) => (
            <div
              key={j.id}
              className="bg-white rounded-2xl border border-outline-variant/60 p-5 flex items-start justify-between gap-4"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-primary">{j.title}</h3>
                  {!j.published && (
                    <span className="text-xs bg-surface-container text-on-surface-variant rounded-full px-2 py-0.5">
                      Ẩn
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-3 text-sm text-on-surface-variant mt-1">
                  {j.department && <span>{j.department}</span>}
                  {j.type && <span>· {j.type}</span>}
                  {j.location && <span>· {j.location}</span>}
                </div>
              </div>
              <div className="flex gap-1 shrink-0">
                <button
                  onClick={() => startEdit(j)}
                  className="text-secondary hover:bg-secondary/10 rounded p-1.5"
                  aria-label="Sửa"
                >
                  <Icon name="edit" className="text-lg" />
                </button>
                <button
                  onClick={() => remove(j)}
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
