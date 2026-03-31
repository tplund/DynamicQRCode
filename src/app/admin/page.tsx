"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

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
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-200 border-t-gray-900" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">QR-koder</h1>
          <p className="mt-0.5 text-sm text-gray-500">{qrCodes.length} koder i alt</p>
        </div>
        <Link
          href="/admin/create"
          className="inline-flex items-center gap-1.5 rounded-lg bg-gray-900 px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Opret ny
        </Link>
      </div>

      {qrCodes.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
            <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6z" />
            </svg>
          </div>
          <p className="text-gray-500 mb-2">Ingen QR-koder endnu</p>
          <Link href="/admin/create" className="text-sm font-medium text-blue-600 hover:text-blue-700">
            Opret din første QR-kode
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Label</th>
                <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Slug</th>
                <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 hidden sm:table-cell">Destination</th>
                <th className="px-5 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Scans</th>
                <th className="px-5 py-3 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {qrCodes.map((qr) => (
                <tr key={qr.id} className="group transition-colors hover:bg-gray-50">
                  <td className="px-5 py-3.5">
                    <Link href={`/admin/${qr.id}`} className="text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors">
                      {qr.label}
                    </Link>
                  </td>
                  <td className="px-5 py-3.5 text-sm font-mono text-gray-500">/{qr.slug}</td>
                  <td className="px-5 py-3.5 text-sm text-gray-500 max-w-[200px] truncate hidden sm:table-cell">
                    {qr.destinationUrl}
                  </td>
                  <td className="px-5 py-3.5 text-sm text-right tabular-nums">
                    <span className="font-medium text-gray-900">{qr.scanCount.toLocaleString()}</span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <Link
                      href={`/admin/${qr.id}`}
                      className="inline-flex items-center gap-1 text-sm text-gray-400 group-hover:text-blue-600 transition-colors"
                    >
                      Rediger
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                      </svg>
                    </Link>
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
