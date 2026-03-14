"use client";

import { useEffect, useRef, useState } from "react";
import type { QRStyleConfig } from "@/lib/types";

interface QRCodePreviewProps {
  url: string;
  style: QRStyleConfig;
  className?: string;
}

export default function QRCodePreview({ url, style, className }: QRCodePreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const qrRef = useRef<InstanceType<typeof import("qr-code-styling").default> | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      const QRCodeStyling = (await import("qr-code-styling")).default;
      if (cancelled) return;

      const qr = new QRCodeStyling({
        width: style.size,
        height: style.size,
        data: url || "https://example.com",
        dotsOptions: {
          type: style.dot_type,
          color: style.fg_color,
        },
        backgroundOptions: {
          color: style.bg_color,
        },
        cornersSquareOptions: {
          type: style.corner_square_type || "extra-rounded",
          color: style.fg_color,
        },
        cornersDotOptions: {
          type: style.corner_dot_type || "dot",
          color: style.fg_color,
        },
        qrOptions: {
          errorCorrectionLevel: "M",
        },
      });

      qrRef.current = qr;

      if (containerRef.current) {
        containerRef.current.innerHTML = "";
        qr.append(containerRef.current);
      }

      setReady(true);
    }

    init();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!qrRef.current || !ready) return;

    qrRef.current.update({
      data: url || "https://example.com",
      width: style.size,
      height: style.size,
      dotsOptions: {
        type: style.dot_type,
        color: style.fg_color,
      },
      backgroundOptions: {
        color: style.bg_color,
      },
      cornersSquareOptions: {
        type: style.corner_square_type || "extra-rounded",
        color: style.fg_color,
      },
      cornersDotOptions: {
        type: style.corner_dot_type || "dot",
        color: style.fg_color,
      },
    });
  }, [url, style, ready]);

  const handleDownload = () => {
    qrRef.current?.download({
      name: "qr-code",
      extension: "png",
    });
  };

  return (
    <div className={className}>
      <div
        ref={containerRef}
        className="flex items-center justify-center rounded-lg border border-gray-200 bg-white p-4"
        style={{ minHeight: style.size + 32, minWidth: style.size + 32 }}
      />
      <button
        onClick={handleDownload}
        className="mt-3 w-full rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors cursor-pointer"
      >
        Download PNG
      </button>
    </div>
  );
}
