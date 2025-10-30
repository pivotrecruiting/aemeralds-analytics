import Script from "next/script";
import { fonts } from "../styles/fonts";
import { Toaster } from "@/components/ui/sonner";

import "../styles/globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "",
  description: "",
  generator: "Next.js",
  icons: {
    icon: [
      {
        url: "/favicon.png",
        href: "/favicon.png",
      },
    ],
  },
  applicationName: "",
  keywords: [],
  authors: [{ name: "" }],
  creator: "",
  publisher: "",
  formatDetection: {
    email: false,
    telephone: false,
    address: false,
  },
  metadataBase: new URL("https://www.your-domain.de"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "de_DE",
    url: "https://www.your-domain.de",
    title: "",
    description: "",
    siteName: "",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" suppressHydrationWarning className={fonts.barlow.variable}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body
        className="font-barlow min-h-screen antialiased"
        suppressHydrationWarning
      >
        <>{children}</>

        <Toaster />
        {/* Strukturierte Daten für das Unternehmen (JSON-LD) */}
        <Script
          id="schema-organization"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "AutoDealer", //TODO: Add correct type
              name: "",
              url: "https://www.your-domain.de",
              logo: "https://www.your-domain.de/logo.svg",
              description: "",
              address: {
                "@type": "PostalAddress",
                streetAddress: "",
                addressLocality: "",
                postalCode: "",
                addressCountry: "DE",
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: 49.8454,
                longitude: 8.6472,
              },
              telephone: "",
              openingHoursSpecification: [
                {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: [
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                  ],
                  opens: "08:00",
                  closes: "18:00",
                },
                {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: "Saturday",
                  opens: "09:00",
                  closes: "13:00",
                },
              ],
              makesOffer: {
                "@type": "Offer",
                itemOffered: [
                  {
                    "@type": "Service",
                    name: "Neuwagen",
                  },
                ],
              },
              sameAs: ["https://www.facebook.com", "https://www.instagram.com"], //TODO: Add correct links
            }),
          }}
        />
      </body>
    </html>
  );
}
