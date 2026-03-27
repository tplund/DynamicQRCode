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
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-neutral-700 border-t-white" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">QR-koder</h1>
          <p className="mt-0.5 text-sm text-neutral-500">{qrCodes.length} koder i alt</p>
        </div>
        <Link
          href="/admin/create"
          className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3.5 py-2 text-sm font-medium text-neutral-900 transition-colors hover:bg-neutral-200"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Opret ny
        </Link>
      </div>

      {qrCodes.length === 0 ? (
        <div className="rounded-xl border border-dashed border-neutral-700 p-12 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-neutral-800">
            <svg className="h-6 w-6 text-neutral-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6z" />
            </svg>
          </div>
          <p className="text-neutral-400 mb-2">Ingen QR-koder endnu</p>
          <Link href="/admin/create" className="text-sm font-medium text-blue-400 hover:text-blue-300">
            Opret din første QR-kode
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-800">
                <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">Label</th>
                <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">Slug</th>
                <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500 hidden sm:table-cell">Destination</th>
                <th className="px-5 py-3 text-right text-xs font-medium uppercase tracking-wider text-neutral-500">Scans</th>
                <th className="px-5 py-3 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/50">
              {qrCodes.map((qr) => (
                <tr key={qr.id} className="group transition-colors hover:bg-white/[0.02]">
                  <td className="px-5 py-3.5 text-sm font-medium text-neutral-200">{qr.label}</td>
                  <td className="px-5 py-3.5 text-sm font-mono text-neutral-500">/{qr.slug}</td>
                  <td className="px-5 py-3.5 text-sm text-neutral-500 max-w-[200px] truncate hidden sm:table-cell">
                    {qr.destinationUrl}
                  </td>
                  <td className="px-5 py-3.5 text-sm text-right tabular-nums">
                    <span className="font-medium text-neutral-200">{qr.scanCount.toLocaleString()}</span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <Link
                      href={`/admin/${qr.id}`}
                      className="text-sm text-neutral-500 opacity-0 group-hover:opacity-100 transition-opacity hover:text-white"
                    >
                      &rarr;
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
