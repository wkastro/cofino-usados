export const fontRegistry = {
  workSans: {
    label: "Work Sans",
    font: { variable: "--font-work-sans" },
  },
  clashDisplay: {
    label: "Clash Display",
    font: { variable: "--font-clash-display" },
  },
} as const;

export type FontKey = keyof typeof fontRegistry;

export const fontVars = Object.values(fontRegistry)
  .map((item) => item.font.variable)
  .join(" ");

export const fontOptions = Object.entries(fontRegistry).map(([key, item]) => ({
  key: key as FontKey,
  label: item.label,
  variable: item.font.variable,
}));
