"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/Icon";
import { ImageUploadField } from "@/components/admin/ImageUploadField";

type Partner = {
  id: string;
  name: string;
  logo: string;
  url: string | null;
  order: number;
};

const empty = { id: "", name: "", logo: "", url: "", order: 0 };

export function PartnerManager({ initial }: { initial: Partner[] }) {
  const router = useRouter();
  const [form, setForm] = useState<typeof empty>(empty);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const editing = !!form.id;

  function startEdit(p: Partner) {
    setForm({ id: p.id, name: p.name, logo: p.logo, url: p.url ?? "", order: p.order });
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function reset() {
    setForm(empty);
    setError("");
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!form.logo) {
      setError("Vui lòng tải logo");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const res = await fetch(
        editing ? `/api/partners/${form.id}` : "/api/partners",
        {
          method: editing ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: form.name,
            logo: form.logo,
            url: form.url,
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

  async function remove(p: Partner) {
    if (!confirm(`Xóa đối tác "${p.name}"?`)) return;
    const res = await fetch(`/api/partners/${p.id}`, { method: "DELETE" });
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
          {editing ? "Sửa đối tác" : "Thêm đối tác"}
        </h2>
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-on-surface-variant">Tên</label>
          <input
            className={inputCls}
            required
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          />
        </div>
        <ImageUploadField
          label="Logo"
          value={form.logo}
          onChange={(url) => setForm((f) => ({ ...f, logo: url }))}
        />
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-on-surface-variant">
            Website (tùy chọn)
          </label>
          <input
            className={inputCls}
            value={form.url}
            placeholder="https://..."
            onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-on-surface-variant">Thứ tự</label>
          <input
            type="number"
            className={inputCls}
            value={form.order}
            onChange={(e) => setForm((f) => ({ ...f, order: Number(e.target.value) }))}
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

      <div className="lg:col-span-2">
        {initial.length === 0 ? (
          <div className="bg-white rounded-2xl border border-outline-variant/60 py-16 text-center text-on-surface-variant">
            Chưa có đối tác nào.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {initial.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-2xl border border-outline-variant/60 p-4 flex flex-col items-center text-center"
              >
                <div className="h-16 flex items-center justify-center mb-3 w-full">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.logo} alt={p.name} className="max-h-16 max-w-full object-contain" />
                </div>
                <p className="text-sm font-medium text-primary truncate w-full">
                  {p.name}
                </p>
                <div className="mt-2 flex gap-1">
                  <button
                    onClick={() => startEdit(p)}
                    className="text-secondary hover:bg-secondary/10 rounded p-1.5"
                    aria-label="Sửa"
                  >
                    <Icon name="edit" className="text-base" />
                  </button>
                  <button
                    onClick={() => remove(p)}
                    className="text-error hover:bg-error-container/40 rounded p-1.5"
                    aria-label="Xóa"
                  >
                    <Icon name="delete" className="text-base" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
