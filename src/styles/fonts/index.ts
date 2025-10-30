import localFont from "next/font/local";
/**
 * Barlow Font-Familie mit lokalen Font-Dateien
 * Optimiert durch next/font für beste Performance
 */
export const barlow = localFont({
  src: [
    {
      path: "./Barlow/Barlow-300.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "./Barlow/Barlow-400.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./Barlow/Barlow-500.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "./Barlow/Barlow-600.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "./Barlow/Barlow-700.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  display: "swap",
  variable: "--font-barlow",
});

/**
 * Exportiere alle Schriften als FontsType
 * für einfachen Import im Layout
 */
export type TFontsType = {
  barlow: typeof barlow;
};

export const fonts: TFontsType = {
  barlow,
};
