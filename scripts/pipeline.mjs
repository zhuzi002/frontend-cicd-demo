import { execSync, spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { setTimeout as delay } from "node:timers/promises";

const port = process.env.APP_PORT ?? "41821";
const healthUrl = `http://127.0.0.1:${port}/api/health`;

function stage(name) {
  console.log(`\n—— ${name} ——`);
}

function fail(message, code = 1) {
  console.error(`\n失败：${message}`);
  process.exit(code);
}

function run(args) {
  const result = spawnSync("docker", args, {
    stdio: "inherit",
    env: process.env,
  });
  if (result.status !== 0) {
    fail(`docker ${args.join(" ")}`, result.status ?? 1);
  }
}

stage("准备参数");

if (spawnSync("docker", ["--version"], { stdio: "ignore" }).status !== 0) {
  fail("没有找到 docker。安装 Docker Desktop 后，确认终端里能运行 docker compose version。");
}

if (spawnSync("docker", ["compose", "version"], { stdio: "ignore" }).status !== 0) {
  fail("docker compose 不可用。请安装带 Compose v2 的 Docker Desktop。");
}

const version = JSON.parse(readFileSync("package.json", "utf8")).version ?? "0.1.0";
let sha = "local";
try {
  sha = execSync("git rev-parse --short HEAD", { encoding: "utf8" }).trim() || "local";
} catch {
  sha = "local";
}
const builtAt = new Date().toISOString();

process.env.APP_VERSION = version;
process.env.GIT_SHA = sha;
process.env.BUILD_TIME = builtAt;
process.env.APP_PORT = port;

console.log(`版本 ${version}`);
console.log(`提交 ${sha}`);
console.log(`时间 ${builtAt}`);

stage("构建镜像");
console.log("镜像里会依次执行代码检查、单元测试和生产构建。任何一步失败，都不会留下新镜像。");
run(["compose", "build"]);

stage("更换容器");
run(["compose", "up", "-d", "--force-recreate", "--no-build"]);

stage("冒烟检查");
let last = "没有响应";
for (let attempt = 1; attempt <= 30; attempt += 1) {
  try {
    const response = await fetch(healthUrl);
    const text = await response.text();
    let body = null;
    try {
      body = JSON.parse(text);
    } catch {
      body = null;
    }
    if (response.ok && body && body.ok === true) {
      console.log(`第 ${attempt} 次请求通过：${healthUrl}`);
      console.log(JSON.stringify(body, null, 2));
      console.log(`\n发布完成。浏览器打开 http://127.0.0.1:${port}`);
      process.exit(0);
    }
    last = `HTTP ${response.status} ${text.slice(0, 180)}`;
  } catch (error) {
    last = error instanceof Error ? error.message : String(error);
  }
  console.log(`等待服务就绪 ${attempt}/30`);
  await delay(1000);
}

fail(`冒烟检查没有通过。最后一次结果：${last}`);
