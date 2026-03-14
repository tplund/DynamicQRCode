"use client";

import { useEffect, useRef, useState } from "react";
import type { QRStyleConfig } from "@/lib/types";

interface QRCodePreviewProps {
  url: string;
  style: QRStyleConfig;
  logoData?: string | null;
  className?: string;
}

function buildDotsOptions(style: QRStyleConfig) {
  const base = { type: style.dot_type };

  if (style.color_mode === "gradient" && style.gradient_color1 && style.gradient_color2) {
    return {
      ...base,
      gradient: {
        type: (style.gradient_type || "linear") as "linear" | "radial",
        rotation: ((style.gradient_rotation || 0) * Math.PI) / 180,
        colorStops: [
          { offset: 0, color: style.gradient_color1 },
          { offset: 1, color: style.gradient_color2 },
        ],
      },
    };
  }

  return { ...base, color: style.fg_color };
}

function buildQROptions(style: QRStyleConfig, logoData?: string | null) {
  return {
    width: style.size,
    height: style.size,
    data: undefined as unknown as string, // set separately
    shape: (style.shape || "square") as "square" | "circle",
    dotsOptions: buildDotsOptions(style),
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
      errorCorrectionLevel: (logoData ? "H" : "M") as "L" | "M" | "Q" | "H",
    },
    ...(logoData && {
      image: logoData,
      imageOptions: {
        hideBackgroundDots: true,
        imageSize: style.logo_size || 0.4,
        margin: style.logo_margin || 5,
      },
    }),
  };
}

export default function QRCodePreview({ url, style, logoData, className }: QRCodePreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const qrRef = useRef<any>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      const QRCodeStyling = (await import("qr-code-styling")).default;
      if (cancelled) return;

      const options = buildQROptions(style, logoData);
      options.data = url || "https://example.com";

      const qr = new QRCodeStyling(options);
      qrRef.current = qr;

      if (containerRef.current) {
        containerRef.current.innerHTML = "";
        qr.append(containerRef.current);
      }

      setReady(true);
    }

    init();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!qrRef.current || !ready) return;

    const options = buildQROptions(style, logoData);
    options.data = url || "https://example.com";

    qrRef.current.update(options);
  }, [url, style, logoData, ready]);

  const handleDownload = () => {
    const format = style.export_format || "png";
    qrRef.current?.download({
      name: "qr-code",
      extension: format,
    });
  };

  const format = (style.export_format || "png").toUpperCase();

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
        Download {format}
      </button>
    </div>
  );
}
