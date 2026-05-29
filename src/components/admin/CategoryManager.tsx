"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/Icon";
import { slugify } from "@/lib/slug";

type Cat = {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  description: string | null;
  order: number;
  productCount: number;
};

const empty = { id: "", name: "", slug: "", icon: "", description: "", order: 0 };

export function CategoryManager({ initial }: { initial: Cat[] }) {
  const router = useRouter();
  const [form, setForm] = useState<typeof empty>(empty);
  const [slugEdited, setSlugEdited] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const editing = !!form.id;

  function startEdit(c: Cat) {
    setForm({
      id: c.id,
      name: c.name,
      slug: c.slug,
      icon: c.icon ?? "",
      description: c.description ?? "",
      order: c.order,
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
        editing ? `/api/categories/${form.id}` : "/api/categories",
        {
          method: editing ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: form.name,
            slug: form.slug,
            icon: form.icon,
            description: form.description,
            order: Number(form.order) || 0,
          }),
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

  async function remove(c: Cat) {
    if (!confirm(`Xóa danh mục "${c.name}"?`)) return;
    const res = await fetch(`/api/categories/${c.id}`, { method: "DELETE" });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
      alert(body.message || "Xóa thất bại");
      return;
    }
    router.refresh();
  }

  const inputCls =
    "w-full px-3 py-2.5 border border-outline-variant rounded-lg text-sm focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary";

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Form */}
      <form
        onSubmit={save}
        className="lg:col-span-1 bg-white rounded-2xl border border-outline-variant/60 p-6 space-y-4 h-fit"
      >
        <h2 className="font-bold text-primary">
          {editing ? "Sửa danh mục" : "Thêm danh mục"}
        </h2>
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-on-surface-variant">Tên</label>
          <input
            className={inputCls}
            value={form.name}
            required
            onChange={(e) => {
              const name = e.target.value;
              setForm((f) => ({
                ...f,
                name,
                slug: slugEdited ? f.slug : slugify(name),
              }));
            }}
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-on-surface-variant">Slug</label>
          <input
            className={inputCls}
            value={form.slug}
            required
            onChange={(e) => {
              setSlugEdited(true);
              setForm((f) => ({ ...f, slug: e.target.value }));
            }}
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-on-surface-variant">
            Icon (Material Symbols)
          </label>
          <input
            className={inputCls}
            value={form.icon}
            placeholder="vd: biotech"
            onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))}
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-on-surface-variant">Mô tả</label>
          <textarea
            className={inputCls}
            rows={3}
            value={form.description}
            onChange={(e) =>
              setForm((f) => ({ ...f, description: e.target.value }))
            }
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-on-surface-variant">
            Thứ tự
          </label>
          <input
            type="number"
            className={inputCls}
            value={form.order}
            onChange={(e) =>
              setForm((f) => ({ ...f, order: Number(e.target.value) }))
            }
          />
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
            {busy ? "Đang lưu..." : editing ? "Cập nhật" : "Thêm mới"}
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

      {/* Bảng */}
      <div className="lg:col-span-2 bg-white rounded-2xl border border-outline-variant/60 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-surface-container-low text-on-surface-variant">
            <tr>
              <th className="text-left px-4 py-3 font-semibold">Tên</th>
              <th className="text-left px-4 py-3 font-semibold hidden sm:table-cell">Slug</th>
              <th className="text-center px-4 py-3 font-semibold">SP</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/40">
            {initial.map((c) => (
              <tr key={c.id}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {c.icon && (
                      <Icon name={c.icon} className="text-secondary text-lg" />
                    )}
                    <span className="font-medium text-primary">{c.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-on-surface-variant hidden sm:table-cell">
                  {c.slug}
                </td>
                <td className="px-4 py-3 text-center text-on-surface-variant">
                  {c.productCount}
                </td>
                <td className="px-4 py-3 text-right whitespace-nowrap">
                  <button
                    onClick={() => startEdit(c)}
                    className="text-secondary hover:bg-secondary/10 rounded p-1.5"
                    aria-label="Sửa"
                  >
                    <Icon name="edit" className="text-lg" />
                  </button>
                  <button
                    onClick={() => remove(c)}
                    className="text-error hover:bg-error-container/40 rounded p-1.5 ml-1"
                    aria-label="Xóa"
                  >
                    <Icon name="delete" className="text-lg" />
                  </button>
                </td>
              </tr>
            ))}
            {initial.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-on-surface-variant">
                  Chưa có danh mục nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
