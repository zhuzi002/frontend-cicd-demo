"use client";

import { useSyncExternalStore } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  checkItems,
  getServerChecklistSnapshot,
  readChecklistSnapshot,
  subscribeChecklist,
  summarize,
  toggleDone,
  writeChecklist,
} from "@/lib/checklist";

export function ChecklistBoard() {
  const snapshot = useSyncExternalStore(
    subscribeChecklist,
    readChecklistSnapshot,
    getServerChecklistSnapshot,
  );

  if (snapshot.status === "loading") {
    return (
      <Card>
        <CardContent className="py-10 text-sm text-muted-foreground">
          正在读取这台机器上的检查进度…
        </CardContent>
      </Card>
    );
  }

  const finished = checkItems.filter((item) => snapshot.done.includes(item.id)).length;
  const label = summarize(checkItems.length, finished);
  const groups = [...new Set(checkItems.map((item) => item.group))];

  return (
    <div className="space-y-5">
      <Card>
        <CardHeader>
          <CardTitle>进度</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-end justify-between gap-4">
            <p className="font-heading text-3xl">
              {finished}
              <span className="text-lg text-muted-foreground">
                {" "}
                / {checkItems.length}
              </span>
            </p>
            <p className="text-sm text-muted-foreground">{label}</p>
          </div>
          <div
            className="h-2 overflow-hidden rounded-full bg-muted"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={checkItems.length}
            aria-valuenow={finished}
            aria-label="检查进度"
          >
            <div
              className="h-full bg-primary transition-[width]"
              style={{
                width: `${checkItems.length === 0 ? 0 : (finished / checkItems.length) * 100}%`,
              }}
            />
          </div>
          {snapshot.status === "memory" ? (
            <p className="text-sm leading-6 text-destructive">
              浏览器没有放开本地存储，勾选只会留在这次打开里。
            </p>
          ) : (
            <p className="text-sm leading-6 text-muted-foreground">
              勾选保存在这台浏览器里，换一台机器不会跟着走。
            </p>
          )}
          <Button
            type="button"
            variant="outline"
            onClick={() => writeChecklist([])}
            disabled={finished === 0}
          >
            重置检查单
          </Button>
        </CardContent>
      </Card>

      {groups.map((group) => (
        <section key={group} className="space-y-3">
          <h2 className="font-heading text-xl">{group}</h2>
          <ul className="space-y-3">
            {checkItems
              .filter((item) => item.group === group)
              .map((item) => {
                const checked = snapshot.done.includes(item.id);
                return (
                  <li key={item.id}>
                    <Card>
                      <CardContent>
                        <label className="flex cursor-pointer gap-3">
                          <input
                            type="checkbox"
                            className="mt-1 size-4 accent-[oklch(0.34_0.05_235)]"
                            checked={checked}
                            onChange={() =>
                              writeChecklist(toggleDone(snapshot.done, item.id))
                            }
                          />
                          <span>
                            <span className="block font-medium">{item.title}</span>
                            <span className="mt-1 block text-sm leading-6 text-muted-foreground">
                              {item.detail}
                            </span>
                          </span>
                        </label>
                      </CardContent>
                    </Card>
                  </li>
                );
              })}
          </ul>
        </section>
      ))}
    </div>
  );
}
