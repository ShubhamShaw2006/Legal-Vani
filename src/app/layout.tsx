/**
 * Legal-Vani: AI Legal Assistant
 * Developed by Shubham
 * GitHub: https://github.com/yourusername/legal-vani
 * 
 * Root Layout Component
 * Defines global fonts, styles, and the main application shell.
 */
import type { Metadata } from "next";
import { Noto_Sans } from "next/font/google";
import "./globals.css";

const notoSans = Noto_Sans({
  variable: "--font-noto-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Legal-Vani - AI Legal Assistant",
  description: "AI-powered, voice-first legal assistance platform for Indian citizens.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${notoSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
