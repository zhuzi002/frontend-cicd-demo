import type { Metadata } from "next";
import { ChecklistBoard } from "@/components/checklist-board";

export const metadata: Metadata = {
  title: "上线检查单",
  description: "发布前在这台浏览器里勾完栈桥的上线检查。",
};

export default function ChecklistPage() {
  return (
    <div className="space-y-6">
      <header className="max-w-2xl">
        <h1 className="font-heading text-4xl">上线检查单</h1>
        <p className="mt-3 leading-7 text-muted-foreground">
          按代码、镜像、上线后三组勾。进度记在这台浏览器里，清空站点数据会一起丢掉。
        </p>
      </header>
      <ChecklistBoard />
    </div>
  );
}
