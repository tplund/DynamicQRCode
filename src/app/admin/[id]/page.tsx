"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { DEFAULT_STYLE, type QRStyleConfig } from "@/lib/types";
import QRCodePreview from "@/components/QRCodePreview";
import QRStylePicker from "@/components/QRStylePicker";

interface ScanItem {
  id: string;
  scannedAt: string;
  country: string | null;
}

interface QRCodeData {
  id: string;
  slug: string;
  destinationUrl: string;
  label: string;
  styleConfig: QRStyleConfig;
  logoData?: string | null;
  scans: ScanItem[];
}

export default function EditQR() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [qrCode, setQrCode] = useState<QRCodeData | null>(null);
  const [destinationUrl, setDestinationUrl] = useState("");
  const [label, setLabel] = useState("");
  const [style, setStyle] = useState<QRStyleConfig>({ ...DEFAULT_STYLE });
  const [logoData, setLogoData] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/qr/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setQrCode(data);
        setDestinationUrl(data.destinationUrl);
        setLabel(data.label);
        setStyle({ ...DEFAULT_STYLE, ...data.styleConfig });
        setLogoData(data.logoData || null);
        setLoading(false);
      });
  }, [id]);

  async function handleSave() {
    setSaving(true);
    setSaved(false);

    await fetch(`/api/qr/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ destinationUrl, label, styleConfig: style, logoData }),
    });

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 4000);
  }

  async function handleDelete() {
    if (!confirm("Er du sikker på at du vil slette denne QR-kode?")) return;

    await fetch(`/api/qr/${id}`, { method: "DELETE" });
    router.push("/admin");
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-neutral-700 border-t-white" />
      </div>
    );
  }
  if (!qrCode) return <div className="text-red-400">QR-kode ikke fundet</div>;

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const qrUrl = `${baseUrl}/go/${qrCode.slug}`;

  const scansData = qrCode.scans || [];
  const totalScans = scansData.length;
  const countryCounts: Record<string, number> = {};
  scansData.forEach((s) => {
    const c = s.country || "Ukendt";
    countryCounts[c] = (countryCounts[c] || 0) + 1;
  });
  const topCountries = Object.entries(countryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div>
      <div className="mb-6">
        <Link href="/admin" className="text-sm text-neutral-500 hover:text-neutral-300 transition-colors">
          &larr; Tilbage
        </Link>
        <h1 className="text-xl font-semibold text-white mt-1">{qrCode.label}</h1>
        <button
          onClick={() => {
            navigator.clipboard.writeText(qrUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          }}
          className="flex items-center gap-1.5 text-sm text-neutral-500 font-mono mt-1 hover:text-neutral-300 transition-colors cursor-pointer"
          title="Kopiér URL"
        >
          {qrUrl}
          <span className="text-xs">{copied ? "✓" : "📋"}</span>
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-6">
          {/* Analytics */}
          <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-500 mb-4">Analytics</h2>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="rounded-lg bg-neutral-800 p-3">
                <p className="text-xl font-bold text-white tabular-nums">{totalScans}</p>
                <p className="text-xs text-neutral-500">Totale scans</p>
              </div>
              <div className="rounded-lg bg-neutral-800 p-3">
                <p className="text-xl font-bold text-white tabular-nums">
                  {scansData.filter(
                    (s) => new Date(s.scannedAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                  ).length}
                </p>
                <p className="text-xs text-neutral-500">Sidste 7 dage</p>
              </div>
            </div>

            {topCountries.length > 0 && (
              <div>
                <h3 className="text-xs font-medium text-neutral-500 mb-2">Top lande</h3>
                <div className="space-y-1.5">
                  {topCountries.map(([country, countVal]) => (
                    <div key={country} className="flex items-center justify-between">
                      <span className="text-sm text-neutral-400">{country}</span>
                      <span className="text-sm font-medium text-neutral-200 tabular-nums">{countVal}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {scansData.length > 0 && (
              <div className="mt-4 pt-4 border-t border-neutral-800">
                <h3 className="text-xs font-medium text-neutral-500 mb-2">Seneste scans</h3>
                <div className="space-y-1 max-h-36 overflow-y-auto">
                  {scansData.slice(0, 20).map((scan) => (
                    <div key={scan.id} className="flex items-center justify-between text-xs text-neutral-500">
                      <span>{new Date(scan.scannedAt).toLocaleString("da-DK")}</span>
                      <span>{scan.country || "?"}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Edit form */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-1.5">Label</label>
              <input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-white placeholder-neutral-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-1.5">Destination URL</label>
              <input
                type="url"
                value={destinationUrl}
                onChange={(e) => setDestinationUrl(e.target.value)}
                className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-white placeholder-neutral-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <hr className="border-neutral-800" />

            <QRStylePicker
              style={style}
              onChange={setStyle}
              logoData={logoData}
              onLogoChange={setLogoData}
            />

            <div className="flex gap-3">
              <button
                onClick={handleSave}
                disabled={saving}
                className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors disabled:opacity-50 cursor-pointer ${
                  saved
                    ? "bg-emerald-600 text-white"
                    : "bg-white text-neutral-900 hover:bg-neutral-200"
                }`}
              >
                {saving ? "Gemmer..." : saved ? "Gemt!" : "Gem ændringer"}
              </button>
              <button
                onClick={handleDelete}
                className="rounded-lg border border-red-900/50 px-4 py-2.5 text-sm font-medium text-red-400 hover:bg-red-950/30 transition-colors cursor-pointer"
              >
                Slet
              </button>
            </div>
          </div>
        </div>

        <div className="lg:sticky lg:top-8 self-start">
          <label className="block text-sm font-medium text-neutral-300 mb-3">QR-kode</label>
          <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-6">
            <QRCodePreview url={qrUrl} style={style} logoData={logoData} />
          </div>
        </div>
      </div>
    </div>
  );
}
