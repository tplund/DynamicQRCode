"use client";

import { PRESETS, type QRStyleConfig, type DotType, type CornerDotType, type CornerSquareType } from "@/lib/types";

interface QRStylePickerProps {
  style: QRStyleConfig;
  onChange: (style: QRStyleConfig) => void;
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
      <ButtonGroup
        label="Dot-form"
        options={DOT_TYPES}
        value={style.dot_type}
        onSelect={(v) => update({ dot_type: v })}
      />

      {/* Corner dot type */}
      <ButtonGroup
        label="Hjørne-dot"
        options={CORNER_DOT_TYPES}
        value={style.corner_dot_type || "dot"}
        onSelect={(v) => update({ corner_dot_type: v })}
      />

      {/* Corner square type */}
      <ButtonGroup
        label="Hjørne-ramme"
        options={CORNER_SQUARE_TYPES}
        value={style.corner_square_type || "extra-rounded"}
        onSelect={(v) => update({ corner_square_type: v })}
      />

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
