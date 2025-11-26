import type { Metadata } from "next";
import { Inter } from "next/font/google";
// ✨ 1. 引入 ClerkProvider
import { ClerkProvider } from '@clerk/nextjs';
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Orbit - 追星紀錄",
  description: "我的追星紀錄與電子票夾",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // ✨ 2. 用 ClerkProvider 包住 html
    <ClerkProvider>
      <html lang="zh-TW">
        <body className={inter.className}>{children}</body>
      </html>
    </ClerkProvider>
  );
}