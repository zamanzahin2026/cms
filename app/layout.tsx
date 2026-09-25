import type { Metadata } from "next";
import { Instrument_Serif, Inter } from "next/font/google";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-instrument-serif",
  display: "swap",
});

const inter = Inter({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ostra — Effortless operations for exceptional stays",
  description:
    "Bookings, property operations, guest experiences and performance insights in one beautifully simple platform.",
  openGraph: {
    title: "Ostra — Effortless operations for exceptional stays",
    description:
      "Bookings, property operations, guest experiences and performance insights in one beautifully simple platform.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${instrumentSerif.variable} ${inter.variable}`}>
      <body className="bg-background text-text_primary antialiased selection:bg-sage_200 selection:text-text_primary">
        {children}
      </body>
    </html>
  );
}
