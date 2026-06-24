import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "灵感缪斯 · Inspiration Muse",
  description:
    "把一闪而过的灵感变成可以落地的第一步。发布想法泡泡，72 小时倒计时，AI 帮你拆成 5 分钟小任务。",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        {children}
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
