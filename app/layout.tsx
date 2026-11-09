import type { Metadata, Viewport } from "next";
import { Providers } from "@/components/providers";
import { AppShell } from "@/components/app-shell";
import "./globals.css";
export const metadata: Metadata = {
  title: {
    default: "LaunchPad AI · AI 发射台 — 从想法到上线",
    template: "%s · LaunchPad AI",
  },
  description:
    "专为非程序员准备的 AI 开发实用指南。生成需求说明、运行项目、选择云平台与免费额度、改造开源项目，从想法走到上线。",
  applicationName: "LaunchPad-AI",
  robots: { index: true, follow: true },
  icons: { icon: "/icon.svg" },
};
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fcfaf8" },
    { media: "(prefers-color-scheme: dark)", color: "#181a18" },
  ],
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body>
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
