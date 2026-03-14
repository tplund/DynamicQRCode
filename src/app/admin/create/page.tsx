"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DEFAULT_STYLE, type QRStyleConfig } from "@/lib/types";
import QRCodePreview from "@/components/QRCodePreview";
import QRStylePicker from "@/components/QRStylePicker";

export default function CreateQR() {
  const router = useRouter();
  const [slug, setSlug] = useState("");
  const [destinationUrl, setDestinationUrl] = useState("");
  const [label, setLabel] = useState("");
  const [style, setStyle] = useState<QRStyleConfig>({ ...DEFAULT_STYLE });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const previewUrl = `${baseUrl}/${slug || "preview"}`;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const res = await fetch("/api/qr", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slug: slug.toLowerCase().replace(/[^a-z0-9-]/g, ""),
        destinationUrl,
        label,
        styleConfig: style,
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Noget gik galt");
      setSaving(false);
      return;
    }

    router.push("/admin");
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Opret QR-kode</h1>

      <div className="grid gap-8 lg:grid-cols-2">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Fx: Aarsleff Rail - Adgang"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
            <div className="flex items-center gap-1">
              <span className="text-sm text-gray-400">{baseUrl}/</span>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                placeholder="aarsleff"
                className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm font-mono"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Destination URL</label>
            <input
              type="url"
              value={destinationUrl}
              onChange={(e) => setDestinationUrl(e.target.value)}
              placeholder="https://example.com/signup"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              required
            />
          </div>

          <hr className="border-gray-200" />

          <QRStylePicker style={style} onChange={setStyle} />

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800 transition-colors disabled:opacity-50 cursor-pointer"
          >
            {saving ? "Gemmer..." : "Opret QR-kode"}
          </button>
        </form>

        <div className="lg:sticky lg:top-8">
          <label className="block text-sm font-medium text-gray-700 mb-3">Preview</label>
          <QRCodePreview url={previewUrl} style={style} />
        </div>
      </div>
    </div>
  );
}
