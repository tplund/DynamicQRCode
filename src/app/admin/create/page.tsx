"use client";

import { useState, useEffect, useRef } from "react";
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
  const [logoData, setLogoData] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Slug availability check
  const [slugStatus, setSlugStatus] = useState<"idle" | "checking" | "available" | "taken">("idle");
  const slugTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Label uniqueness warning
  const [existingLabels, setExistingLabels] = useState<string[]>([]);
  const labelDuplicate = label.trim() !== "" && existingLabels.includes(label.trim());

  useEffect(() => {
    fetch("/api/qr")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setExistingLabels(data.map((qr: { label: string }) => qr.label));
        }
      });
  }, []);

  function handleSlugChange(value: string) {
    const sanitized = value.toLowerCase().replace(/[^a-z0-9-]/g, "");
    setSlug(sanitized);

    if (slugTimerRef.current) clearTimeout(slugTimerRef.current);

    if (!sanitized) {
      setSlugStatus("idle");
      return;
    }

    setSlugStatus("checking");
    slugTimerRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/qr/check-slug?slug=${encodeURIComponent(sanitized)}`);
        const data = await res.json();
        setSlugStatus(data.available ? "available" : "taken");
      } catch {
        setSlugStatus("idle");
      }
    }, 300);
  }

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const previewUrl = `${baseUrl}/go/${slug || "preview"}`;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (slugStatus === "taken") return;

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
        logoData,
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
      <h1 className="mb-6 text-xl font-semibold text-gray-900">Opret QR-kode</h1>

      <div className="grid gap-8 lg:grid-cols-2">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">Label</label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Fx: Aarsleff Rail - Adgang"
              className="w-full rounded-lg border border-gray-300 bg-gray-100 px-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
            {labelDuplicate && (
              <p className="mt-1 text-xs text-amber-600">
                Du har allerede en QR-kode med dette navn
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">Slug</label>
            <div className="flex items-center gap-1">
              <span className="text-sm text-gray-500">/go/</span>
              <input
                type="text"
                value={slug}
                onChange={(e) => handleSlugChange(e.target.value)}
                placeholder="aarsleff"
                className={`flex-1 rounded-lg border bg-gray-100 px-3 py-2 text-sm font-mono text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-1 ${
                  slugStatus === "taken"
                    ? "border-red-400 focus:ring-red-500"
                    : slugStatus === "available"
                    ? "border-emerald-400 focus:ring-emerald-500"
                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                }`}
                required
              />
            </div>
            <div className="mt-1">
              {slugStatus === "checking" && (
                <p className="text-xs text-gray-500">Tjekker...</p>
              )}
              {slugStatus === "available" && (
                <p className="text-xs text-emerald-600">&#10003; Slug er ledig</p>
              )}
              {slugStatus === "taken" && (
                <p className="text-xs text-red-600">&#10007; Slug er optaget</p>
              )}
              {slugStatus === "idle" && slug === "" && (
                <p className="text-xs text-amber-600">Slug kan ikke aendres efter oprettelse</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">Destination URL</label>
            <input
              type="url"
              value={destinationUrl}
              onChange={(e) => setDestinationUrl(e.target.value)}
              placeholder="https://example.com/signup"
              className="w-full rounded-lg border border-gray-300 bg-gray-100 px-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          <hr className="border-gray-200" />

          <QRStylePicker
            style={style}
            onChange={setStyle}
            logoData={logoData}
            onLogoChange={setLogoData}
          />

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={saving || slugStatus === "taken"}
            className="w-full rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:opacity-50 cursor-pointer"
          >
            {saving ? "Gemmer..." : "Opret QR-kode"}
          </button>
        </form>

        <div className="lg:sticky lg:top-8 self-start">
          <label className="block text-sm font-medium text-gray-600 mb-3">Preview</label>
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6">
            <QRCodePreview url={previewUrl} style={style} logoData={logoData} />
          </div>
        </div>
      </div>
    </div>
  );
}
