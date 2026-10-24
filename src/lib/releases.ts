export const environments = ["local", "staging", "production"] as const;

export type Environment = (typeof environments)[number];

export const environmentLabels: Record<Environment, string> = {
  local: "本地",
  staging: "测试",
  production: "生产",
};

export const releaseStatuses = ["shipped", "rolled-back", "held"] as const;

export type ReleaseStatus = (typeof releaseStatuses)[number];

export const releaseStatusLabels: Record<ReleaseStatus, string> = {
  shipped: "已发布",
  "rolled-back": "已回退",
  held: "暂停",
};

export type Release = {
  id: string;
  version: string;
  environment: Environment;
  status: ReleaseStatus;
  at: string;
  summary: string;
};

export const releases: Release[] = [
  {
    id: "rel-014",
    version: "0.1.0",
    environment: "local",
    status: "shipped",
    at: "2026-10-24T01:40:00.000Z",
    summary: "检查、测试和镜像构建收进同一次 docker compose build。",
  },
  {
    id: "rel-013",
    version: "0.0.9",
    environment: "staging",
    status: "rolled-back",
    at: "2026-10-18T13:12:00.000Z",
    summary: "容器起来了，但 /api/health 一直没有返回 ok，当次发布回退。",
  },
  {
    id: "rel-012",
    version: "0.0.8",
    environment: "production",
    status: "shipped",
    at: "2026-10-11T02:05:00.000Z",
    summary: "生产镜像只带 standalone 产物，页面和健康检查走同一个容器。",
  },
  {
    id: "rel-011",
    version: "0.0.7",
    environment: "staging",
    status: "held",
    at: "2026-10-04T08:20:00.000Z",
    summary: "测试环境的检查单还差冒烟一项，发布先停在这里。",
  },
  {
    id: "rel-010",
    version: "0.0.6",
    environment: "local",
    status: "shipped",
    at: "2026-09-28T11:48:00.000Z",
    summary: "第一次在本机用端口 41821 打开打出来的镜像。",
  },
];

export type ReleaseQuery = {
  environment: Environment | "all";
  keyword: string;
};

export function filterReleases(
  items: readonly Release[],
  query: ReleaseQuery,
): Release[] {
  const keyword = query.keyword.trim().toLowerCase();
  return items
    .filter((release) => {
      const environmentMatches =
        query.environment === "all" || release.environment === query.environment;
      const keywordMatches =
        keyword.length === 0 ||
        `${release.version} ${release.summary}`.toLowerCase().includes(keyword);
      return environmentMatches && keywordMatches;
    })
    .slice()
    .sort((left, right) => right.at.localeCompare(left.at));
}

export function formatWhen(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}
