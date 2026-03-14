export interface QRCode {
  id: string;
  slug: string;
  destination_url: string;
  label: string;
  style_config: QRStyleConfig;
  logo_data?: string | null;
  created_at: string;
  updated_at: string;
  scan_count?: number;
}

// qr-code-styling supported types
export type DotType = "square" | "rounded" | "dots" | "classy" | "classy-rounded" | "extra-rounded";
export type CornerDotType = "square" | "dot" | DotType;
export type CornerSquareType = "square" | "dot" | "extra-rounded" | DotType;
export type ColorMode = "solid" | "gradient";
export type GradientType = "linear" | "radial";
export type QRShape = "square" | "circle";
export type ExportFormat = "png" | "svg" | "jpeg" | "webp";

export interface QRStyleConfig {
  dot_type: DotType;
  fg_color: string;
  bg_color: string;
  corner_dot_type?: CornerDotType;
  corner_square_type?: CornerSquareType;
  size: number;
  // Gradient
  color_mode?: ColorMode;
  gradient_type?: GradientType;
  gradient_color1?: string;
  gradient_color2?: string;
  gradient_rotation?: number;
  // Shape
  shape?: QRShape;
  // Logo
  logo_size?: number;
  logo_margin?: number;
  // Export
  export_format?: ExportFormat;
}

export interface Scan {
  id: string;
  qr_code_id: string;
  scanned_at: string;
  user_agent: string | null;
  country: string | null;
  referer: string | null;
}

export const DEFAULT_STYLE: QRStyleConfig = {
  dot_type: "classy-rounded",
  fg_color: "#1A2332",
  bg_color: "#FFFFFF",
  corner_dot_type: "dot",
  corner_square_type: "extra-rounded",
  size: 300,
  color_mode: "solid",
  shape: "square",
  export_format: "png",
};

export const PRESETS: Record<string, { label: string; style: Partial<QRStyleConfig> }> = {
  aarsleff: {
    label: "Aarsleff Rail",
    style: {
      fg_color: "#1A2332",
      bg_color: "#F5C800",
      dot_type: "classy-rounded",
      corner_dot_type: "dot",
      corner_square_type: "extra-rounded",
      color_mode: "solid",
    },
  },
  dark: {
    label: "Mørk",
    style: {
      fg_color: "#F5C800",
      bg_color: "#1A2332",
      dot_type: "classy-rounded",
      corner_dot_type: "dot",
      corner_square_type: "extra-rounded",
      color_mode: "solid",
    },
  },
  classic: {
    label: "Klassisk",
    style: {
      fg_color: "#000000",
      bg_color: "#FFFFFF",
      dot_type: "square",
      corner_dot_type: "square",
      corner_square_type: "square",
      color_mode: "solid",
    },
  },
  ocean: {
    label: "Ocean",
    style: {
      fg_color: "#0077B6",
      bg_color: "#FFFFFF",
      dot_type: "rounded",
      corner_dot_type: "dot",
      corner_square_type: "extra-rounded",
      color_mode: "gradient",
      gradient_type: "linear",
      gradient_color1: "#0077B6",
      gradient_color2: "#00B4D8",
      gradient_rotation: 135,
    },
  },
  sunset: {
    label: "Solnedgang",
    style: {
      fg_color: "#E63946",
      bg_color: "#FFFFFF",
      dot_type: "dots",
      corner_dot_type: "dot",
      corner_square_type: "dot",
      color_mode: "gradient",
      gradient_type: "linear",
      gradient_color1: "#E63946",
      gradient_color2: "#F4A261",
      gradient_rotation: 45,
    },
  },
  elegant: {
    label: "Elegant",
    style: {
      fg_color: "#2D3748",
      bg_color: "#FFFFFF",
      dot_type: "dots",
      corner_dot_type: "dot",
      corner_square_type: "dot",
      color_mode: "solid",
    },
  },
  modern: {
    label: "Moderne",
    style: {
      fg_color: "#1A2332",
      bg_color: "#FFFFFF",
      dot_type: "extra-rounded",
      corner_dot_type: "extra-rounded",
      corner_square_type: "extra-rounded",
      color_mode: "solid",
    },
  },
  soft: {
    label: "Blød",
    style: {
      fg_color: "#4A5568",
      bg_color: "#F7FAFC",
      dot_type: "rounded",
      corner_dot_type: "rounded",
      corner_square_type: "rounded",
      color_mode: "solid",
    },
  },
};
