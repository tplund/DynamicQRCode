"use client";

import { useEffect, useState } from "react";

interface QRCodeItem {
  id: string;
  slug: string;
  destinationUrl: string;
  label: string;
  scanCount: number;
}

export default function AdminDashboard() {
  const [qrCodes, setQrCodes] = useState<QRCodeItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/qr")
      .then((r) => r.json())
      .then((data) => {
        setQrCodes(data);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="text-gray-400">Indlæser QR-koder...</div>;
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">QR-koder</h1>
        <a
          href="/admin/create"
          className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
        >
          + Opret ny QR-kode
        </a>
      </div>

      {qrCodes.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 p-12 text-center">
          <p className="text-gray-500 mb-4">Ingen QR-koder endnu</p>
          <a
            href="/admin/create"
            className="text-sm font-medium text-gray-900 underline"
          >
            Opret din første QR-kode
          </a>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Label</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Slug</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Destination</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Scans</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {qrCodes.map((qr) => (
                <tr key={qr.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{qr.label}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 font-mono">/{qr.slug}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                    {qr.destinationUrl}
                  </td>
                  <td className="px-6 py-4 text-sm text-right text-gray-900 font-medium">
                    {qr.scanCount}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <a
                      href={`/admin/${qr.id}`}
                      className="text-sm text-gray-600 hover:text-gray-900"
                    >
                      Rediger →
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
