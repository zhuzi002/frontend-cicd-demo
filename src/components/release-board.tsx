"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  environmentLabels,
  environments,
  filterReleases,
  formatWhen,
  releaseStatusLabels,
  type Environment,
  type Release,
  type ReleaseStatus,
} from "@/lib/releases";

const filters: { value: Environment | "all"; label: string }[] = [
  { value: "all", label: "全部" },
  ...environments.map((environment) => ({
    value: environment,
    label: environmentLabels[environment],
  })),
];

const statusVariant: Record<
  ReleaseStatus,
  "default" | "destructive" | "secondary"
> = {
  shipped: "default",
  "rolled-back": "destructive",
  held: "secondary",
};

export function ReleaseBoard({ items }: { items: readonly Release[] }) {
  const [environment, setEnvironment] = useState<Environment | "all">("all");
  const [keyword, setKeyword] = useState("");
  const visible = useMemo(
    () => filterReleases(items, { environment, keyword }),
    [items, environment, keyword],
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2" role="group" aria-label="按环境筛选">
          {filters.map((filter) => (
            <Button
              key={filter.value}
              type="button"
              size="sm"
              variant={environment === filter.value ? "default" : "outline"}
              aria-pressed={environment === filter.value}
              onClick={() => setEnvironment(filter.value)}
            >
              {filter.label}
            </Button>
          ))}
        </div>
        <label className="block w-full sm:max-w-xs">
          <span className="sr-only">搜索版本或说明</span>
          <Input
            value={keyword}
            placeholder="搜索版本或说明"
            onChange={(event) => setKeyword(event.target.value)}
          />
        </label>
      </div>

      {visible.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center">
            <p className="font-heading text-xl">没有符合条件的发布</p>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
              换一个环境，或把关键字清掉。记录本身还在，只是这次筛选没有命中。
            </p>
            <Button
              type="button"
              variant="outline"
              className="mt-4"
              onClick={() => {
                setEnvironment("all");
                setKeyword("");
              }}
            >
              清空筛选
            </Button>
          </CardContent>
        </Card>
      ) : (
        <ul className="space-y-3">
          {visible.map((release) => (
            <li key={release.id}>
              <Card>
                <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-heading text-xl">{release.version}</h2>
                      <Badge variant="outline">
                        {environmentLabels[release.environment]}
                      </Badge>
                      <Badge variant={statusVariant[release.status]}>
                        {releaseStatusLabels[release.status]}
                      </Badge>
                    </div>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                      {release.summary}
                    </p>
                  </div>
                  <time
                    dateTime={release.at}
                    className="shrink-0 text-sm text-muted-foreground"
                  >
                    {formatWhen(release.at)}
                  </time>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
