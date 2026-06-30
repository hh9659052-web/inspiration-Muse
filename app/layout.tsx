import type { Metadata } from "next";
import { Cormorant_Garamond, Noto_Serif_SC, Noto_Sans_SC } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

// 优雅衬线（拉丁）——用于品牌字与大标题，呼应「Love of water」手写气质
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

// 优雅衬线（中文）——大标题与品牌中文
const notoSerifSC = Noto_Serif_SC({
  weight: ["400", "600", "900"],
  variable: "--font-serif-cjk",
  display: "swap",
  preload: false,
});

// 正文无衬线（中文）
const notoSansSC = Noto_Sans_SC({
  weight: ["300", "400", "500", "700"],
  variable: "--font-sans-cjk",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: "灵感缪斯 · Inspiration Muse",
  description:
    "把一闪而过的灵感变成可以落地的第一步。发布想法泡泡，72 小时倒计时，AI 帮你拆成 5 分钟小任务。",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="zh-CN"
      suppressHydrationWarning
      className={`${cormorant.variable} ${notoSerifSC.variable} ${notoSansSC.variable}`}
    >
      <body className="min-h-screen antialiased">
        {children}
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
