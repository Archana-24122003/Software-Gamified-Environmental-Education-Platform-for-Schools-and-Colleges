import "./globals.css";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "LearnBee",
  description: "A soft, playful learning platform where games, progress, and curiosity grow together.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="soft-shell min-h-screen text-[#2f241d]">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
