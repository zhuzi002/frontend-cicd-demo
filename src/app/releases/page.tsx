import type { Metadata } from "next";
import { ReleaseBoard } from "@/components/release-board";
import { releases } from "@/lib/releases";

export const metadata: Metadata = {
  title: "发布记录",
  description: "按环境和关键字查看栈桥的发布记录。",
};

export default function ReleasesPage() {
  return (
    <div className="space-y-6">
      <header className="max-w-2xl">
        <h1 className="font-heading text-4xl">发布记录</h1>
        <p className="mt-3 leading-7 text-muted-foreground">
          这几条是练习用的发布说明，方便你看筛选和空状态。真正打镜像时，版本号来自
          package.json，提交号来自当前 git。
        </p>
      </header>
      <ReleaseBoard items={releases} />
    </div>
  );
}
