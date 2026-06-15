import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Anybody } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
});

const anybody = Anybody({
  variable: "--font-anybody",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Rumah Video",
  description: "Aplikasi manajemen video",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${plusJakartaSans.variable} ${anybody.variable} h-full antialiased`}
    >
      <body suppressHydrationWarning className="min-h-full flex flex-col font-sans bg-surface text-on-surface">
        {children}
      </body>
    </html>
  );
}
