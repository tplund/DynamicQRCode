export interface QRCode {
  id: string;
  slug: string;
  destination_url: string;
  label: string;
  style_config: QRStyleConfig;
  created_at: string;
  updated_at: string;
  scan_count?: number;
}

// qr-code-styling supported types
export type DotType = "square" | "rounded" | "dots" | "classy" | "classy-rounded" | "extra-rounded";
export type CornerDotType = "square" | "dot" | DotType;
export type CornerSquareType = "square" | "dot" | "extra-rounded" | DotType;

export interface QRStyleConfig {
  dot_type: DotType;
  fg_color: string;
  bg_color: string;
  corner_dot_type?: CornerDotType;
  corner_square_type?: CornerSquareType;
  size: number;
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
    },
  },
};
