"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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

  if (loading) return <div className="text-gray-400">Indlæser...</div>;
  if (!qrCode) return <div className="text-red-600">QR-kode ikke fundet</div>;

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const qrUrl = `${baseUrl}/go/${qrCode.slug}`;

  const scans = qrCode.scans || [];
  const totalScans = scans.length;
  const countryCounts: Record<string, number> = {};
  scans.forEach((s) => {
    const c = s.country || "Ukendt";
    countryCounts[c] = (countryCounts[c] || 0) + 1;
  });
  const topCountries = Object.entries(countryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <a href="/admin" className="text-sm text-gray-500 hover:text-gray-700">← Tilbage</a>
          <h1 className="text-2xl font-bold text-gray-900 mt-1">{qrCode.label}</h1>
          <button
            onClick={() => {
              navigator.clipboard.writeText(qrUrl);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className="flex items-center gap-1.5 text-sm text-gray-500 font-mono mt-1 hover:text-gray-700 transition-colors cursor-pointer"
            title="Kopiér URL"
          >
            {qrUrl}
            <span className="text-xs">{copied ? "✓ Kopieret!" : "📋"}</span>
          </button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Destination URL</label>
            <input
              type="url"
              value={destinationUrl}
              onChange={(e) => setDestinationUrl(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </div>

          <hr className="border-gray-200" />

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
              className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-medium text-white transition-colors disabled:opacity-50 cursor-pointer ${
                saved ? "bg-green-600 hover:bg-green-600" : "bg-gray-900 hover:bg-gray-800"
              }`}
            >
              {saving ? "Gemmer..." : saved ? "Gemt!" : "Gem ændringer"}
            </button>
            <button
              onClick={handleDelete}
              className="rounded-lg border border-red-200 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
            >
              Slet
            </button>
          </div>

          {/* Analytics */}
          <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Analytics</h2>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-2xl font-bold text-gray-900">{totalScans}</p>
                <p className="text-sm text-gray-500">Totale scans</p>
              </div>
              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-2xl font-bold text-gray-900">
                  {scans.filter(
                    (s) =>
                      new Date(s.scannedAt) >
                      new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                  ).length}
                </p>
                <p className="text-sm text-gray-500">Sidste 7 dage</p>
              </div>
            </div>

            {topCountries.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Top lande</h3>
                <div className="space-y-2">
                  {topCountries.map(([country, count]) => (
                    <div key={country} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{country}</span>
                      <span className="text-sm font-medium text-gray-900">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {scans.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Seneste scans</h3>
                <div className="space-y-1 max-h-48 overflow-y-auto">
                  {scans.slice(0, 20).map((scan) => (
                    <div key={scan.id} className="flex items-center justify-between text-xs text-gray-500">
                      <span>{new Date(scan.scannedAt).toLocaleString("da-DK")}</span>
                      <span>{scan.country || "?"}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="lg:sticky lg:top-8 self-start">
          <label className="block text-sm font-medium text-gray-700 mb-3">QR-kode</label>
          <QRCodePreview url={qrUrl} style={style} logoData={logoData} />
        </div>
      </div>
    </div>
  );
}
