"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/Icon";
import { slugify } from "@/lib/slug";
import { ImageUploadField } from "@/components/admin/ImageUploadField";

type CategoryOpt = { id: string; name: string };
type Faq = { question: string; answer: string };

export type ProductFormData = {
  id?: string;
  name: string;
  slug: string;
  code: string;
  categoryId: string;
  shortDescription: string;
  activeIngredients: string;
  benefits: string;
  usageInstructions: string;
  dosage: string;
  heroImage: string;
  metaTitle: string;
  metaDescription: string;
  featured: boolean;
  published: boolean;
  faqs: Faq[];
};

const inputCls =
  "w-full px-3 py-2.5 border border-outline-variant rounded-lg text-sm focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary";

export function ProductForm({
  categories,
  initial,
}: {
  categories: CategoryOpt[];
  initial?: ProductFormData;
}) {
  const router = useRouter();
  const editing = !!initial?.id;
  const [form, setForm] = useState<ProductFormData>(
    initial ?? {
      name: "",
      slug: "",
      code: "",
      categoryId: categories[0]?.id ?? "",
      shortDescription: "",
      activeIngredients: "",
      benefits: "",
      usageInstructions: "",
      dosage: "",
      heroImage: "",
      metaTitle: "",
      metaDescription: "",
      featured: false,
      published: true,
      faqs: [],
    }
  );
  const [slugEdited, setSlugEdited] = useState(editing);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  function set<K extends keyof ProductFormData>(key: K, val: ProductFormData[K]) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch(
        editing ? `/api/products/${form.id}` : "/api/products",
        {
          method: editing ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...form,
            gallery: [],
            faqs: form.faqs.filter((f) => f.question && f.answer),
          }),
        }
      );
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.message || "Lưu thất bại");
      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Có lỗi xảy ra");
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-6 max-w-4xl">
      <div className="bg-white rounded-2xl border border-outline-variant/60 p-6 space-y-4">
        <h2 className="font-bold text-primary">Thông tin chính</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-on-surface-variant">Tên sản phẩm</label>
            <input
              className={inputCls}
              required
              value={form.name}
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
            <label className="text-sm font-semibold text-on-surface-variant">Mã SP (SKU)</label>
            <input
              className={inputCls}
              required
              value={form.code}
              onChange={(e) => set("code", e.target.value)}
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
                set("slug", e.target.value);
              }}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-on-surface-variant">Danh mục</label>
            <select
              className={inputCls}
              required
              value={form.categoryId}
              onChange={(e) => set("categoryId", e.target.value)}
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-on-surface-variant">Mô tả ngắn</label>
          <textarea
            className={inputCls}
            rows={2}
            required
            value={form.shortDescription}
            onChange={(e) => set("shortDescription", e.target.value)}
          />
        </div>
        <ImageUploadField
          label="Ảnh sản phẩm"
          value={form.heroImage}
          onChange={(url) => set("heroImage", url)}
        />
      </div>

      <div className="bg-white rounded-2xl border border-outline-variant/60 p-6 space-y-4">
        <h2 className="font-bold text-primary">Thông tin kỹ thuật</h2>
        {(
          [
            ["activeIngredients", "Thành phần hoạt chất"],
            ["benefits", "Công dụng"],
            ["usageInstructions", "Hướng dẫn sử dụng"],
            ["dosage", "Liều dùng"],
          ] as const
        ).map(([key, label]) => (
          <div key={key} className="space-y-1.5">
            <label className="text-sm font-semibold text-on-surface-variant">{label}</label>
            <textarea
              className={inputCls}
              rows={3}
              value={form[key]}
              onChange={(e) => set(key, e.target.value)}
            />
          </div>
        ))}
      </div>

      {/* FAQ */}
      <div className="bg-white rounded-2xl border border-outline-variant/60 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-primary">Câu hỏi thường gặp</h2>
          <button
            type="button"
            onClick={() => set("faqs", [...form.faqs, { question: "", answer: "" }])}
            className="text-sm text-secondary font-semibold flex items-center gap-1"
          >
            <Icon name="add" className="text-lg" /> Thêm câu hỏi
          </button>
        </div>
        {form.faqs.map((faq, i) => (
          <div key={i} className="border border-outline-variant/60 rounded-lg p-4 space-y-2 relative">
            <input
              className={inputCls}
              placeholder="Câu hỏi"
              value={faq.question}
              onChange={(e) => {
                const faqs = [...form.faqs];
                faqs[i] = { ...faqs[i], question: e.target.value };
                set("faqs", faqs);
              }}
            />
            <textarea
              className={inputCls}
              rows={2}
              placeholder="Trả lời"
              value={faq.answer}
              onChange={(e) => {
                const faqs = [...form.faqs];
                faqs[i] = { ...faqs[i], answer: e.target.value };
                set("faqs", faqs);
              }}
            />
            <button
              type="button"
              onClick={() => set("faqs", form.faqs.filter((_, j) => j !== i))}
              className="absolute top-2 right-2 text-error hover:bg-error-container/40 rounded p-1"
              aria-label="Xóa câu hỏi"
            >
              <Icon name="delete" className="text-lg" />
            </button>
          </div>
        ))}
        {form.faqs.length === 0 && (
          <p className="text-sm text-on-surface-variant">Chưa có câu hỏi nào.</p>
        )}
      </div>

      {/* SEO + trạng thái */}
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
        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => set("featured", e.target.checked)}
              className="size-4 accent-secondary"
            />
            Sản phẩm nổi bật
          </label>
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
          {busy ? "Đang lưu..." : editing ? "Cập nhật" : "Tạo sản phẩm"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/products")}
          className="px-6 py-3 rounded-lg border border-outline-variant text-on-surface-variant"
        >
          Hủy
        </button>
      </div>
    </form>
  );
}
