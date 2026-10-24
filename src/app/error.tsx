"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-lg py-16 text-center">
      <h1 className="font-heading text-4xl">这一页没有打开</h1>
      <p className="mt-3 leading-7 text-muted-foreground">
        先重试一次。如果是流水线刚换完容器，等健康检查通过再刷新。
      </p>
      <Button type="button" className="mt-6" onClick={() => retry()}>
        重试
      </Button>
    </div>
  );
}
