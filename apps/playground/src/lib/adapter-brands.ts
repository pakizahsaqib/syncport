import type { AdapterId } from "./presets";

export interface AdapterBrand {
  primary: string;
  secondary: string;
  light: string;
  ring: string;
}

/**
 * Brand logos from public CDNs (Wikimedia Commons + Iconify / Simple Icons fallbacks).
 * @see https://commons.wikimedia.org
 */
export const ADAPTER_LOGOS: Record<
  AdapterId,
  { src: string; fallback: string; alt: string }
> = {
  hubspot: {
    src: "https://upload.wikimedia.org/wikipedia/commons/3/3f/HubSpot_Logo.svg",
    fallback: "https://api.iconify.design/logos/hubspot.svg",
    alt: "HubSpot",
  },
  airtable: {
    src: "https://upload.wikimedia.org/wikipedia/commons/4/4b/Airtable_Logo.svg",
    fallback: "https://api.iconify.design/logos/airtable.svg",
    alt: "Airtable",
  },
  csv: {
    src: "https://api.iconify.design/mdi/file-delimited.svg?color=%235B6B7C",
    fallback: "https://api.iconify.design/catppuccin/csv.svg",
    alt: "CSV",
  },
  sheets: {
    src: "https://upload.wikimedia.org/wikipedia/commons/a/ae/Google_Sheets_2020_Logo.svg",
    fallback: "https://api.iconify.design/simple-icons/googlesheets.svg",
    alt: "Google Sheets",
  },
  xlsx: {
    src: "https://upload.wikimedia.org/wikipedia/commons/7/73/Microsoft_Excel_2013-2019_logo.svg",
    fallback: "https://api.iconify.design/vscode-icons/file-type-excel.svg",
    alt: "Microsoft Excel",
  },
};

export const ADAPTER_BRANDS: Record<AdapterId, AdapterBrand> = {
  hubspot: {
    primary: "#FF7A59",
    secondary: "#FF5C35",
    light: "#FFF0EB",
    ring: "#FF7A59",
  },
  airtable: {
    primary: "#18BFFF",
    secondary: "#FFB400",
    light: "#E8F7FF",
    ring: "#18BFFF",
  },
  csv: {
    primary: "#5B6B7C",
    secondary: "#3D4F5F",
    light: "#F1F3F5",
    ring: "#5B6B7C",
  },
  sheets: {
    primary: "#0F9D58",
    secondary: "#34A853",
    light: "#E6F4EA",
    ring: "#0F9D58",
  },
  xlsx: {
    primary: "#217346",
    secondary: "#185C37",
    light: "#E8F5EE",
    ring: "#217346",
  },
};
