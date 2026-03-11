import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ReviewHub | Local Business Discovery",
  description: "Browse, rate, and review local businesses in your community.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-50 min-h-screen antialiased`}>
        <Navbar />
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
