import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GeoFlow",
  description: "Genealogy built around sources, evidence, investigations and family stories.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
