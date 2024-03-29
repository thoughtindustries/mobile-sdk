interface ThemeProps {
  text: {
    "text-primary": string;
    "text-100": string;
    "text-inverse": string;
    "text-secondary": string;
  };
  brand: {
    "brand-primary": string;
  };
  surface: {
    "surface-primary": string;
    "surface-100": string;
    "surface-200": string;
    "surface-300": string;
    "surface-400": string;
    "surface-500": string;
    "surface-yellow": string;
    "surface-green": string;
    "surface-disabled": string;
    "surface-blurred": string;
    "surface-error": string;
    "surface-success": string;
  };
  border: {
    "border-primary": string;
    "border-100": string;
    "border-200": string;
    "border-error": string;
    "border-success": string;
  };
  interface: {
    "ui-quaternary": string;
  };
}

export const theme: ThemeProps = {
  text: {
    "text-primary": "#1F2937",
    "text-100": "#FAFAFA",
    "text-inverse": "#FFFFFF",
    "text-secondary": "#6B7280",
  },
  brand: {
    "brand-primary": "#3B1FA3",
  },
  surface: {
    "surface-primary": "#F3F4F6",
    "surface-100": "#FFFFFF",
    "surface-200": "#FAFAFA",
    "surface-300": "#CCCCCC55",
    "surface-400": "#CCCCCC33",
    "surface-500": "#1F2937",
    "surface-yellow": "#FDE68A",
    "surface-green": "#A7F3D0",
    "surface-disabled": "#E5E7EB",
    "surface-blurred": "#6B7280BB",
    "surface-error": "#F7DADD",
    "surface-success": "#DCE5DF",
  },
  border: {
    "border-primary": "#1F2937",
    "border-100": "#E5E7EB",
    "border-200": "#D1D5DB",
    "border-error": "#DC2626",
    "border-success": "#326D3C",
  },
  interface: {
    "ui-quaternary": "#F9FAFB",
  },
};
