"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/Icon";

// Nút xóa dùng chung: gọi DELETE tới endpoint, xác nhận trước khi xóa.
export function DeleteButton({
  endpoint,
  label,
}: {
  endpoint: string;
  label: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function onDelete() {
    if (!confirm(`Xóa "${label}"? Hành động này không thể hoàn tác.`)) return;
    setBusy(true);
    const res = await fetch(endpoint, { method: "DELETE" });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
      alert(body.message || "Xóa thất bại");
      setBusy(false);
      return;
    }
    router.refresh();
  }

  return (
    <button
      onClick={onDelete}
      disabled={busy}
      className="text-error hover:bg-error-container/40 rounded p-1.5 disabled:opacity-50"
      aria-label="Xóa"
    >
      <Icon name="delete" className="text-lg" />
    </button>
  );
}
