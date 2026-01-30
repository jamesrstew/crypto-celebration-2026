import type { Metadata } from "next";
import { Press_Start_2P } from "next/font/google";
import "./globals.css";
import { AppAudioWrapper } from "@/components/AppAudioWrapper";

const pixel = Press_Start_2P({ weight: "400", subsets: ["latin"], variable: "--font-pixel" });

export const metadata: Metadata = {
  title: "Launch Roulette",
  description: "A facilitated, shared-screen celebration of the crypto platform launch.",
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
