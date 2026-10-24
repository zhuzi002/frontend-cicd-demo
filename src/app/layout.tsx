import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "栈桥",
    template: "%s · 栈桥",
  },
  description: "在本地用 Docker 走完前端的检查、测试、镜像和冒烟发布。",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className="min-h-full">
        <div className="flex min-h-full flex-col">
          <SiteHeader />
          <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6 sm:py-12">
            {children}
          </main>
          <footer className="border-t border-border px-4 py-6 text-center text-sm text-muted-foreground">
            镜像名 zhanqiao:local，本机端口 41821。开发服务器用 43123。
          </footer>
        </div>
      </body>
    </html>
  );
}
