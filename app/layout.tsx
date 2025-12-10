import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import SessionWrapper from "@/components/session-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MemoryWrap - Collect Memories, Unlock Emotions",
  description: "A digital memory vault where friends answer emotional prompts and upload photos for an AI-generated year wrap.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen pb-20`}
      >
        <SessionWrapper>
          <Navbar />
          <main className="pt-24 min-h-screen">
            {children}
          </main>
        </SessionWrapper>
      </body>
    </html>
  );
}
