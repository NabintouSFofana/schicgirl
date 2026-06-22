import type { Metadata } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});
const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-jost",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Schicgirl — Type 4 Natural Hair",
  description: "Bilingual natural-hair guides, diagnostics and a coaching studio for Type 4 (4A 4B 4C) hair.",
  icons: { icon: "/assets/logo2.png" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html className={`${cormorant.variable} ${jost.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
