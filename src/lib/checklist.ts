export type CheckItem = {
  id: string;
  group: string;
  title: string;
  detail: string;
};

export const checkItems: CheckItem[] = [
  {
    id: "lint",
    group: "代码",
    title: "代码检查通过",
    detail: "流水线会在镜像里执行 npm run lint，本地先跑一次能少等一轮构建。",
  },
  {
    id: "test",
    group: "代码",
    title: "单元测试通过",
    detail: "npm run test。筛选、进度和空列表都有对应用例。",
  },
  {
    id: "image",
    group: "镜像",
    title: "镜像构建没有中断",
    detail: "npm run pipeline 里的「构建镜像」走完，才会有 zhanqiao:local。",
  },
  {
    id: "container",
    group: "镜像",
    title: "容器换上了新镜像",
    detail: "docker compose ps 里 web 是本次构建，端口映射到 41821。",
  },
  {
    id: "smoke",
    group: "上线后",
    title: "健康检查返回 ok",
    detail: "打开 /api/health，ok 为 true，版本和提交号是这一次的。",
  },
  {
    id: "pages",
    group: "上线后",
    title: "三个页面都能打开",
    detail: "概览、发布记录、上线检查单。发布记录没有结果时要看到空状态。",
  },
];

export function parseDone(raw: string | null) {
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is string => typeof item === "string");
  } catch {
    return [];
  }
}

export function toggleDone(done: readonly string[], id: string) {
  return done.includes(id)
    ? done.filter((item) => item !== id)
    : [...done, id];
}

export function summarize(total: number, done: number) {
  if (total === 0) return "没有检查项";
  if (done <= 0) return "还没开始";
  if (done >= total) return "可以发布";
  return "进行中";
}

export const checklistStorageKey = "zhanqiao.checklist.v1";

export type ChecklistSnapshot = {
  status: "loading" | "local" | "memory";
  done: string[];
};

const serverSnapshot: ChecklistSnapshot = { status: "loading", done: [] };
const listeners = new Set<() => void>();

let memoryMode = false;
let memoryDone: string[] = [];
let cacheKey = "";
let cache: ChecklistSnapshot = { status: "local", done: [] };

export function getServerChecklistSnapshot() {
  return serverSnapshot;
}

export function readChecklistSnapshot(): ChecklistSnapshot {
  let status: "local" | "memory" = "local";
  let raw = "[]";

  if (memoryMode) {
    status = "memory";
    raw = JSON.stringify(memoryDone);
  } else {
    try {
      raw = window.localStorage.getItem(checklistStorageKey) ?? "[]";
    } catch {
      status = "memory";
      raw = JSON.stringify(memoryDone);
    }
  }

  const nextKey = `${status}:${raw}`;
  if (nextKey === cacheKey) return cache;
  cacheKey = nextKey;
  cache = { status, done: parseDone(raw) };
  return cache;
}

export function subscribeChecklist(callback: () => void) {
  listeners.add(callback);
  const onStorage = () => {
    cacheKey = "";
    callback();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", onStorage);
  };
}

export function writeChecklist(done: string[]) {
  try {
    window.localStorage.setItem(checklistStorageKey, JSON.stringify(done));
    memoryMode = false;
  } catch {
    memoryMode = true;
    memoryDone = done;
  }
  cacheKey = "";
  for (const listener of listeners) listener();
}

export function resetChecklistMemory() {
  memoryMode = false;
  memoryDone = [];
  cacheKey = "";
  cache = { status: "local", done: [] };
}
