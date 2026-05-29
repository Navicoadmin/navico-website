"use client";

import { useState } from "react";
import { Icon } from "@/components/Icon";

// Trường tải ảnh: upload lên /api/upload, trả về URL lưu vào form.
export function ImageUploadField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function upload(file: File) {
    setBusy(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.message || "Tải lên thất bại");
      onChange(body.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi tải lên");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-1.5">
      <label className="text-sm font-semibold text-on-surface-variant">
        {label}
      </label>
      <div className="flex items-center gap-4">
        <div className="size-24 rounded-lg border border-outline-variant bg-surface-container-low overflow-hidden flex items-center justify-center shrink-0">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="preview" className="w-full h-full object-cover" />
          ) : (
            <Icon name="image" className="text-outline text-3xl" />
          )}
        </div>
        <div className="flex-1 space-y-2">
          <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-outline-variant text-sm font-semibold text-primary cursor-pointer hover:bg-surface-container">
            <Icon name="upload" className="text-lg" />
            {busy ? "Đang tải..." : "Chọn ảnh"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={busy}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) upload(f);
              }}
            />
          </label>
          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="block text-xs text-error hover:underline"
            >
              Xóa ảnh
            </button>
          )}
          {error && <p className="text-xs text-error">{error}</p>}
        </div>
      </div>
    </div>
  );
}
