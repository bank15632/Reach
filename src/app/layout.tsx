import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/ui/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "REACH | Antigravity Badminton",
  description: "Experience the future of badminton with our Zero-G technology. Premium rackets engineered for speed, precision, and power.",
  keywords: ["badminton", "racket", "antigravity", "zero-g", "sports", "reach"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-space-black`}
      >
        <Navbar />
        {children}
      </body>
    </html>
  );
}
