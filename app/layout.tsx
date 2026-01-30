import type { Metadata, Viewport } from "next";
import { Press_Start_2P } from "next/font/google";
import "./globals.css";
import { AppAudioWrapper } from "@/components/AppAudioWrapper";

const pixel = Press_Start_2P({ weight: "400", subsets: ["latin"], variable: "--font-pixel" });

export const metadata: Metadata = {
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
  },
  twitter: {
    card: "summary",
    title: "Launch Roulette",
    description: "A facilitated, shared-screen celebration of the crypto platform launch.",
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
