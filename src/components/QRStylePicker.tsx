"use client";

import { useState, useRef } from "react";
import {
  PRESETS,
  type QRStyleConfig,
  type DotType,
  type CornerDotType,
  type CornerSquareType,
  type ColorMode,
  type GradientType,
  type QRShape,
  type ExportFormat,
} from "@/lib/types";

interface QRStylePickerProps {
  style: QRStyleConfig;
  onChange: (style: QRStyleConfig) => void;
  logoData?: string | null;
  onLogoChange?: (data: string | null) => void;
}

// SVG dot preview icons — shows what each dot style looks like
function DotPreview({ type, size = 20 }: { type: string; size?: number }) {
  const s = size;
  const d = s / 4; // dot size
  const gap = 1;

  const dotProps = (x: number, y: number) => ({ x, y, width: d - gap, height: d - gap });
  const circleProps = (x: number, y: number) => ({ cx: x + d / 2 - gap / 2, cy: y + d / 2 - gap / 2, r: (d - gap) / 2 });
  const roundedRect = (x: number, y: number, r: number) => (
    <rect {...dotProps(x, y)} rx={r} fill="currentColor" />
  );

  const positions = [
    [0, 0], [d, 0], [2 * d, 0], [3 * d, 0],
    [0, d], [3 * d, d],
    [0, 2 * d], [d, 2 * d], [3 * d, 2 * d],
    [0, 3 * d], [2 * d, 3 * d], [3 * d, 3 * d],
  ];

  return (
    <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} className="shrink-0">
      {positions.map(([x, y], i) => {
        switch (type) {
          case "square":
            return <rect key={i} {...dotProps(x, y)} fill="currentColor" />;
          case "dots":
            return <circle key={i} {...circleProps(x, y)} fill="currentColor" />;
          case "rounded":
            return roundedRect(x, y, (d - gap) * 0.3);
          case "classy":
            return <rect key={i} {...dotProps(x, y)} rx={(d - gap) * 0.15} fill="currentColor" />;
          case "classy-rounded":
            return roundedRect(x, y, (d - gap) * 0.4);
          case "extra-rounded":
            return <circle key={i} {...circleProps(x, y)} fill="currentColor" />;
          default:
            return <rect key={i} {...dotProps(x, y)} fill="currentColor" />;
        }
      })}
    </svg>
  );
}

const DOT_TYPES: { value: DotType; label: string }[] = [
  { value: "square", label: "Firkantet" },
  { value: "rounded", label: "Rund" },
  { value: "dots", label: "Dots" },
  { value: "classy", label: "Classy" },
  { value: "classy-rounded", label: "Classy Rund" },
  { value: "extra-rounded", label: "Ekstra Rund" },
];

const CORNER_DOT_TYPES: { value: CornerDotType; label: string }[] = [
  { value: "dot", label: "Rund" },
  { value: "square", label: "Firkantet" },
  { value: "rounded", label: "Afrundet" },
  { value: "classy", label: "Classy" },
  { value: "classy-rounded", label: "Classy Rund" },
  { value: "extra-rounded", label: "Ekstra Rund" },
];

const CORNER_SQUARE_TYPES: { value: CornerSquareType; label: string }[] = [
  { value: "square", label: "Firkantet" },
  { value: "dot", label: "Rund" },
  { value: "extra-rounded", label: "Ekstra Rund" },
  { value: "rounded", label: "Afrundet" },
  { value: "classy", label: "Classy" },
  { value: "classy-rounded", label: "Classy Rund" },
];

function VisualButtonGroup<T extends string>({
  label,
  options,
  value,
  onSelect,
  showPreview = false,
}: {
  label: string;
  options: { value: T; label: string }[];
  value: T | undefined;
  onSelect: (v: T) => void;
  showPreview?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="flex gap-1.5 flex-wrap">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onSelect(opt.value)}
            title={opt.label}
            className={`rounded-lg border px-2.5 py-1.5 text-xs transition-colors cursor-pointer flex items-center gap-1.5 ${
              value === opt.value
                ? "border-gray-900 bg-gray-900 text-white"
                : "border-gray-300 hover:border-gray-500"
            }`}
          >
            {showPreview && <DotPreview type={opt.value} size={16} />}
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function ButtonGroup<T extends string>({
  label,
  options,
  value,
  onSelect,
}: {
  label: string;
  options: { value: T; label: string }[];
  value: T | undefined;
  onSelect: (v: T) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="flex gap-1.5 flex-wrap">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onSelect(opt.value)}
            className={`rounded-lg border px-2.5 py-1 text-xs transition-colors cursor-pointer ${
              value === opt.value
                ? "border-gray-900 bg-gray-900 text-white"
                : "border-gray-300 hover:border-gray-500"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function Section({
  title,
  defaultOpen = true,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-4 py-3 text-sm font-semibold text-gray-800 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
      >
        {title}
        <span className="text-gray-400 text-xs">{open ? "▲" : "▼"}</span>
      </button>
      {open && <div className="p-4 space-y-4">{children}</div>}
    </div>
  );
}

export default function QRStylePicker({ style, onChange, logoData, onLogoChange }: QRStylePickerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const update = (partial: Partial<QRStyleConfig>) => {
    onChange({ ...style, ...partial });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onLogoChange) return;

    if (file.size > 200 * 1024) {
      const img = new Image();
      const reader = new FileReader();
      reader.onload = () => {
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const maxDim = 200;
          const scale = Math.min(maxDim / img.width, maxDim / img.height, 1);
          canvas.width = img.width * scale;
          canvas.height = img.height * scale;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            onLogoChange(canvas.toDataURL("image/png", 0.8));
          }
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    } else {
      const reader = new FileReader();
      reader.onload = () => {
        onLogoChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    }

    e.target.value = "";
  };

  return (
    <div className="space-y-3">
      {/* Presets — always open, lowest friction path */}
      <Section title="Forudindstillinger" defaultOpen={true}>
        <div className="flex gap-2 flex-wrap">
          {Object.entries(PRESETS).map(([key, preset]) => (
            <button
              key={key}
              onClick={() => update(preset.style)}
              className="rounded-lg border px-3 py-1.5 text-sm hover:opacity-80 transition-all cursor-pointer"
              style={{
                backgroundColor: preset.style.bg_color,
                color: preset.style.fg_color,
                borderColor: preset.style.fg_color,
              }}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </Section>

      {/* Farver — open by default, quick to scan */}
      <Section title="Farver" defaultOpen={true}>
        <ButtonGroup
          label="Farvetilstand"
          options={[
            { value: "solid" as ColorMode, label: "Ensfarvet" },
            { value: "gradient" as ColorMode, label: "Gradient" },
          ]}
          value={style.color_mode || "solid"}
          onSelect={(v) => update({
            color_mode: v as ColorMode,
            ...(v === "gradient" && !style.gradient_color1 && {
              gradient_color1: style.fg_color,
              gradient_color2: "#0077B6",
              gradient_type: "linear" as GradientType,
              gradient_rotation: 135,
            }),
          })}
        />

        {style.color_mode === "gradient" ? (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Farve 1</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={style.gradient_color1 || style.fg_color}
                    onChange={(e) => update({ gradient_color1: e.target.value })}
                    className="h-10 w-10 cursor-pointer rounded border border-gray-300"
                  />
                  <input
                    type="text"
                    value={style.gradient_color1 || style.fg_color}
                    onChange={(e) => update({ gradient_color1: e.target.value })}
                    className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Farve 2</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={style.gradient_color2 || "#0077B6"}
                    onChange={(e) => update({ gradient_color2: e.target.value })}
                    className="h-10 w-10 cursor-pointer rounded border border-gray-300"
                  />
                  <input
                    type="text"
                    value={style.gradient_color2 || "#0077B6"}
                    onChange={(e) => update({ gradient_color2: e.target.value })}
                    className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm font-mono"
                  />
                </div>
              </div>
            </div>

            <ButtonGroup
              label="Gradient-type"
              options={[
                { value: "linear" as GradientType, label: "Lineær" },
                { value: "radial" as GradientType, label: "Radial" },
              ]}
              value={style.gradient_type || "linear"}
              onSelect={(v) => update({ gradient_type: v as GradientType })}
            />

            {(style.gradient_type || "linear") === "linear" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rotation: {style.gradient_rotation || 0}°
                </label>
                <input
                  type="range"
                  min={0}
                  max={360}
                  step={15}
                  value={style.gradient_rotation || 0}
                  onChange={(e) => update({ gradient_rotation: Number(e.target.value) })}
                  className="w-full"
                />
              </div>
            )}
          </>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Forgrund</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={style.fg_color}
                  onChange={(e) => update({ fg_color: e.target.value })}
                  className="h-10 w-10 cursor-pointer rounded border border-gray-300"
                />
                <input
                  type="text"
                  value={style.fg_color}
                  onChange={(e) => update({ fg_color: e.target.value })}
                  className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm font-mono"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Baggrund</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={style.bg_color}
                  onChange={(e) => update({ bg_color: e.target.value })}
                  className="h-10 w-10 cursor-pointer rounded border border-gray-300"
                />
                <input
                  type="text"
                  value={style.bg_color}
                  onChange={(e) => update({ bg_color: e.target.value })}
                  className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm font-mono"
                />
              </div>
            </div>
          </div>
        )}

        {style.color_mode === "gradient" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Baggrund</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={style.bg_color}
                onChange={(e) => update({ bg_color: e.target.value })}
                className="h-10 w-10 cursor-pointer rounded border border-gray-300"
              />
              <input
                type="text"
                value={style.bg_color}
                onChange={(e) => update({ bg_color: e.target.value })}
                className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm font-mono"
              />
            </div>
          </div>
        )}
      </Section>

      {/* Advanced toggle */}
      <button
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
      >
        {showAdvanced ? "Skjul avancerede indstillinger" : "Vis avancerede indstillinger"}
        <span className="text-xs text-gray-400">{showAdvanced ? "▲" : "▼"}</span>
      </button>

      {showAdvanced && (
        <>
          {/* Form & Stil */}
          <Section title="Form & Stil" defaultOpen={false}>
            <ButtonGroup
              label="QR-form"
              options={[
                { value: "square" as QRShape, label: "Firkantet" },
                { value: "circle" as QRShape, label: "Cirkel" },
              ]}
              value={style.shape || "square"}
              onSelect={(v) => update({ shape: v as QRShape })}
            />

            <VisualButtonGroup
              label="Dot-form"
              options={DOT_TYPES}
              value={style.dot_type}
              onSelect={(v) => update({ dot_type: v })}
              showPreview={true}
            />

            <VisualButtonGroup
              label="Hjørne-dot"
              options={CORNER_DOT_TYPES}
              value={style.corner_dot_type || "dot"}
              onSelect={(v) => update({ corner_dot_type: v })}
              showPreview={true}
            />

            <VisualButtonGroup
              label="Hjørne-ramme"
              options={CORNER_SQUARE_TYPES}
              value={style.corner_square_type || "extra-rounded"}
              onSelect={(v) => update({ corner_square_type: v })}
              showPreview={true}
            />
          </Section>

          {/* Logo */}
          <Section title="Logo" defaultOpen={false}>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="hidden"
            />

            {logoData ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={logoData}
                    alt="Logo"
                    className="h-16 w-16 rounded-lg border border-gray-200 object-contain bg-white p-1"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm hover:border-gray-500 transition-colors cursor-pointer"
                    >
                      Skift logo
                    </button>
                    <button
                      onClick={() => onLogoChange?.(null)}
                      className="rounded-lg border border-red-300 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                    >
                      Fjern
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Logostørrelse: {Math.round((style.logo_size || 0.4) * 100)}%
                  </label>
                  <input
                    type="range"
                    min={0.2}
                    max={0.5}
                    step={0.05}
                    value={style.logo_size || 0.4}
                    onChange={(e) => update({ logo_size: Number(e.target.value) })}
                    className="w-full"
                  />
                </div>
              </div>
            ) : (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full rounded-lg border-2 border-dashed border-gray-300 px-4 py-6 text-sm text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                Klik for at uploade logo (maks 200KB)
              </button>
            )}
          </Section>

          {/* Eksport */}
          <Section title="Eksport" defaultOpen={false}>
            <ButtonGroup
              label="Format"
              options={[
                { value: "png" as ExportFormat, label: "PNG" },
                { value: "svg" as ExportFormat, label: "SVG" },
                { value: "jpeg" as ExportFormat, label: "JPEG" },
                { value: "webp" as ExportFormat, label: "WebP" },
              ]}
              value={style.export_format || "png"}
              onSelect={(v) => update({ export_format: v as ExportFormat })}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Størrelse: {style.size}px
              </label>
              <input
                type="range"
                min={200}
                max={600}
                step={50}
                value={style.size}
                onChange={(e) => update({ size: Number(e.target.value) })}
                className="w-full"
              />
            </div>
          </Section>
        </>
      )}
    </div>
  );
}
