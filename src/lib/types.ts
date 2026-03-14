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

export interface QRStyleConfig {
  dot_type: "square" | "rounded" | "dots" | "classy" | "classy-rounded";
  fg_color: string;
  bg_color: string;
  corner_dot_type?: "square" | "dot";
  corner_square_type?: "square" | "extra-rounded" | "dot";
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
    },
  },
  dark: {
    label: "Mørk",
    style: {
      fg_color: "#F5C800",
      bg_color: "#1A2332",
      dot_type: "classy-rounded",
      corner_dot_type: "dot",
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
};
