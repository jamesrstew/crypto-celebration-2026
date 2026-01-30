import type { Metadata, Viewport } from "next";
import { Press_Start_2P } from "next/font/google";
import "./globals.css";
import { AppAudioWrapper } from "@/components/AppAudioWrapper";

const pixel = Press_Start_2P({ weight: "400", subsets: ["latin"], variable: "--font-pixel" });

export const metadata: Metadata = {
  metadataBase: new URL("https://jamesrstew.github.io/crypto-celebration-2026"),
  title: "Launch Roulette",
  description: "A facilitated, shared-screen celebration of the crypto platform launch. Spin the wheel, face scenarios, survive the chaos.",
  applicationName: "Launch Roulette",
  keywords: ["Launch Roulette", "crypto", "game", "team celebration", "facilitated", "arcade", "scenarios"],
  authors: [{ name: "Launch Roulette" }],
  creator: "Launch Roulette",
  openGraph: {
    title: "Launch Roulette",
    description: "A facilitated, shared-screen celebration of the crypto platform launch. Spin the wheel, face scenarios, survive the chaos.",
    type: "website",
    siteName: "Launch Roulette",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Launch Roulette — Spin the wheel, face scenarios, survive the chaos",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Launch Roulette",
    description: "A facilitated, shared-screen celebration of the crypto platform launch.",
    images: ["/og-image.png"],
  },
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1a0a2e",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={pixel.variable}>
      <body className={`${pixel.className} arcade-bg`}>
        <AppAudioWrapper>{children}</AppAudioWrapper>
      </body>
    </html>
  );
}
