export type PipelineStage = {
  id: string;
  name: string;
  command: string;
  detail: string;
};

export const pipelineStages: PipelineStage[] = [
  {
    id: "lint",
    name: "代码检查",
    command: "npm run lint",
    detail: "镜像构建时执行。规则报错，这一步会停，后面的测试和打包不会开始。",
  },
  {
    id: "test",
    name: "单元测试",
    command: "npm run test",
    detail: "覆盖发布筛选、检查单进度，以及发布列表搜不到结果时的空状态。",
  },
  {
    id: "build",
    name: "生产构建",
    command: "npm run build",
    detail: "打出 Next.js standalone 产物，运行时只带服务真正要用的文件。",
  },
  {
    id: "image",
    name: "打出镜像",
    command: "docker compose build",
    detail: "上面三步写在 Dockerfile 里。有一步失败，就不会留下 zhanqiao:local。",
  },
  {
    id: "up",
    name: "更换容器",
    command: "docker compose up -d",
    detail: "用新镜像换掉正在运行的容器。本机从 41821 端口访问。",
  },
  {
    id: "smoke",
    name: "冒烟检查",
    command: "GET /api/health",
    detail: "最多等 30 秒。返回 ok 才算这次发布完成，否则流水线以失败退出。",
  },
];
