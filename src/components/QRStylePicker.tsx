"use client";

import { PRESETS, type QRStyleConfig } from "@/lib/types";

interface QRStylePickerProps {
  style: QRStyleConfig;
  onChange: (style: QRStyleConfig) => void;
}

const DOT_TYPES = [
  { value: "square", label: "Firkantet" },
  { value: "rounded", label: "Rund" },
  { value: "dots", label: "Dots" },
  { value: "classy", label: "Classy" },
  { value: "classy-rounded", label: "Classy Rund" },
] as const;

export default function QRStylePicker({ style, onChange }: QRStylePickerProps) {
  const update = (partial: Partial<QRStyleConfig>) => {
    onChange({ ...style, ...partial });
  };

  return (
    <div className="space-y-5">
      {/* Presets */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Forudindstillinger</label>
        <div className="flex gap-2 flex-wrap">
          {Object.entries(PRESETS).map(([key, preset]) => (
            <button
              key={key}
              onClick={() => update(preset.style)}
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm hover:border-gray-500 transition-colors cursor-pointer"
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
      </div>

      {/* Dot type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Dot-form</label>
        <div className="flex gap-2 flex-wrap">
          {DOT_TYPES.map((dt) => (
            <button
              key={dt.value}
              onClick={() => update({ dot_type: dt.value })}
              className={`rounded-lg border px-3 py-1.5 text-sm transition-colors cursor-pointer ${
                style.dot_type === dt.value
                  ? "border-gray-900 bg-gray-900 text-white"
                  : "border-gray-300 hover:border-gray-500"
              }`}
            >
              {dt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Colors */}
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

      {/* Size */}
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
    </div>
  );
}
